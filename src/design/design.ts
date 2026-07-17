import type { Int } from '@/math/fraction'
import { Grid } from './grid'
import type { Polygon } from '@/math/geometry'
import type { Mtx2x3 } from '@/math/linear'

///** A face in an abstraction. Usually a rectangle. */
//export class Face {
//  polygon: Polygon
//  back: boolean
//
//  /** Beware: this aliases */
//  constructor(polygon: Polygon, back: boolean) {
//    this.polygon = polygon
//    this.back = back
//  }
//
//  /** Checks if a face is valid. It must be convex and have no length-0 edges.
//   * (Technically you can use ERM with concave faces, but the paper
//   * needs to be concave, and it's annoying to specify the validity
//   * condition for concave faces, so we pretend they don't exist.)
//   * Note that area-0 faces are allowed. The path must go back and forth only once.
//   */
//  valid(): boolean {
//    return !this.polygon.hasDuplicate() && this.polygon.isConvex()
//  }
//}

type Target = { target: Face; edges: [Int, Int] }

/** An entry storing per-face data relevant to the abstraction such as the polygon,
 * position and connections.
 */
export class Face {
  /** The polygon */
  polygon: Polygon
  /** Whether this is a backside face */
  back: boolean
  /** The transform in the abstraction, which is really just for visual/organization purposes. */
  transform: Mtx2x3
  /** Target face, followed by the source-edge-index and target-edge-index that connect. */
  targets: Target[]

  /** Beware: this aliases */
  constructor(polygon: Polygon, back: boolean, transform: Mtx2x3, targets: Target[]) {
    this.polygon = polygon
    this.back = back
    this.transform = transform
    this.targets = targets
  }

  /** Creates an unconnected face */
  static unconnected(polygon: Polygon, back: boolean, transform: Mtx2x3) {
    return new Face(polygon, back, transform, [])
  }
}

export type FaceID = number

/** An abstraction: the object you want to represent */
export class Abstraction {
  faces: Map<FaceID, Face> = new Map()
  currID: number = 0

  private nextID(): number {
    return this.currID++
  }

  /** Beware: this aliases the faces */
  private constructor(faces: Face[]) {
    this.faces = new Map(faces.map((f) => [this.nextID(), f]))
  }

  /** Constructs a shiny new abstraction with no faces */
  static new() {
    return new Abstraction([])
  }

  /** Adds a face to the abstraction and gets the corresponding action,
   * which contains the face ID that got added. */
  addFace(face: Face): FaceAdded {
    const id = this.nextID()
    this.faces.set(id, face)
    return new FaceAdded(id)
  }
}

/** The structure of an ERM project: grid size, abstraction, layout, all the good stuff */
export class Design {
  grid: Grid = new Grid(16, 16)
  abstraction: Abstraction = Abstraction.new()

  private constructor() {}

  /** Initialization by fields for convenience. TODO: Error checking. */
  static from(init?: Partial<Design>): Design {
    const result = new Design()
    Object.assign(result, init)
    return result
  }
}

/** An action done to the design, with information needed to reverse it. */
export interface Action {
  /** The function that undoes the action. It's allowed to assume that this action gets consumed. */
  undo(design: Design): Action
}

/** The grid was changed. The old grid is stored. */
export class GridChanged implements Action {
  grid: Grid

  constructor(grid: Grid) {
    this.grid = grid
  }

  undo(design: Design): Action {
    const result = new GridChanged(design.grid)
    design.grid = this.grid
    return result
  }
}

/** A face was added. The face ID is stored */
export class FaceAdded implements Action {
  faceID: FaceID

  constructor(faceID: FaceID) {
    this.faceID = faceID
  }

  undo(design: Design): Action {
    const result = new FaceRemoved(this.faceID, design.abstraction.faces.get(this.faceID)!)
    design.abstraction.faces.delete(this.faceID)
    return result
  }
}

/** A face's data was changed. The old face data is stored */
export class FaceChanged implements Action {
  faceID: FaceID
  face: Face

  constructor(faceID: FaceID, face: Face) {
    this.faceID = faceID
    this.face = face
  }

  undo(design: Design): Action {
    const result = new FaceChanged(this.faceID, design.abstraction.faces.get(this.faceID)!)
    design.abstraction.faces.set(this.faceID, this.face)
    return result
  }
}

/** A face was removed. The old face data is stored */
export class FaceRemoved implements Action {
  faceID: FaceID
  face: Face

  constructor(faceID: FaceID, face: Face) {
    this.faceID = faceID
    this.face = face
  }

  undo(design: Design): Action {
    const result = new FaceAdded(this.faceID)
    design.abstraction.faces.set(this.faceID, this.face)
    return result
  }
}

/** Many things were done. The actions are stored in the order they were done. */
export class BatchAction implements Action {
  actions: Action[]

  constructor(actions: Action[]) {
    this.actions = actions
  }

  undo(design: Design): Action {
    this.actions.reverse()
    for (let i = 0; i < this.actions.length; ++i) this.actions[i] = this.actions[i]!.undo(design)
    // We use the self-consuming assumption and return this.
    return this
  }
}

/** A stack of undoable actions */
export class UndoStack {
  undoStack: Action[] = []
  redoStack: Action[] = []
  update: ((action: Action) => void) | undefined

  /** Takes an update callback that gets called when an action just got done */
  constructor(update: ((action: Action) => void) | undefined) {
    this.update = update
  }

  undo(design: Design) {
    const action = this.undoStack.pop()
    if (action === undefined) return
    const reverse = action.undo(design)
    this.redoStack.push(reverse)
    if (this.update) this.update(reverse)
  }

  redo(design: Design) {
    const action = this.redoStack.pop()
    if (action === undefined) return
    const reverse = action.undo(design)
    this.undoStack.push(reverse)
    if (this.update) this.update(reverse)
  }

  push(action: Action) {
    this.undoStack.push(action)
    this.redoStack = []
    if (this.update) this.update(action)
  }
}

///** An action done to the design, with information needed to reverse it. */
//export class Action {
//  /** The old grid, if the grid changed */
//  grid: Grid | undefined
//  /** Faces added to the abstraction */
//  addedFaces: FaceID[] = []
//  /** Faces whose data changed, along with their old data */
//  changedFaces: [FaceID, Face][] = []
//  /** Faces removed from the abstraction, along with their old abstraction entry info */

///** An action done to the design, with information needed to reverse it. */
//export class Action {
//  /** The old grid, if the grid changed */
//  grid: Grid | undefined
//  /** Faces added to the abstraction */
//  addedFaces: FaceID[] = []
//  /** Faces whose data changed, along with their old data */
//  changedFaces: [FaceID, Face][] = []
//  /** Faces removed from the abstraction, along with their old abstraction entry info */
//  removedFaces: [FaceID, Face][] = []
//
//  constructor(init: Partial<Action>) {
//    Object.assign(this, init)
//  }
//
//  /** Reverses the action */
//  undo(design: Design): Action {
//    const result = new Action({})
//
//    if (this.grid !== undefined) {
//      result.grid = design.grid
//      design.grid = this.grid
//    }
//
//    this.addedFaces.reverse()
//    for (const faceID of this.addedFaces) {
//      result.removedFaces.push([faceID, design.abstraction.faces.get(faceID)!])
//      design.abstraction.faces.delete(faceID)
//    }
//
//    this.changedFaces.reverse()
//    for (const [faceID, face] of this.changedFaces) {
//      result.changedFaces.push([faceID, design.abstraction.faces.get(faceID)!])
//      design.abstraction.faces.set(faceID, face)
//    }
//
//    this.removedFaces.reverse()
//    for (const [faceID, face] of this.removedFaces) {
//      result.addedFaces.push(faceID)
//      design.abstraction.faces.set(faceID, face)
//    }
//
//    return result
//  }
//}
//
