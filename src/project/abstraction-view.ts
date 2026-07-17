import { currTheme } from '@/config'
import {
  Face,
  FaceAdded,
  FaceChanged,
  FaceRemoved,
  GridChanged,
  UndoStack,
  type Action,
  type Design,
  type FaceID,
} from '@/design/design'
import { Mtx2x3, Vec2 } from '@/math/linear'
import { Container, FederatedPointerEvent, Graphics, Matrix, Point, type Renderer } from 'pixi.js'
import { Icon } from './icon'
import { Polygon } from '@/math/geometry'
import { Rat } from '@/math/fraction'

interface State {
  cleanup(): void
}

class StDraw implements State {
  view: AbstractionView
  cursor: Graphics
  rect: Graphics
  start: Vec2 | undefined
  onPointerMove: (ev: FederatedPointerEvent) => void
  onPointerDown: (ev: FederatedPointerEvent) => void
  onPointerUp: (ev: FederatedPointerEvent) => void

  constructor(view: AbstractionView) {
    this.view = view
    this.cursor = Icon.RECT_CURSOR.clone()
    this.cursor.zIndex = 1
    this.rect = new Graphics()
    this.view.container.addChild(this.cursor)

    this.onPointerDown = (ev) => {
      this.start = view.mouseToGridSnappedWithBounds(ev.screen)
      this.view.container.addChild(this.rect)
      this.rect.clear()
    }

    this.onPointerMove = (ev) => {
      const coords = view.mouseToGridSnappedWithBounds(ev.screen)
      this.cursor.position = view.gridToMouse(coords)
      if (this.start !== undefined) {
        const min = this.start.min(coords)
        const max = this.start.max(coords)
        const dims = max.sub(min)
        this.rect.clear().setTransform(this.view.transform)
        if (dims.x.eq(Rat.ZERO) || dims.y.eq(Rat.ZERO))
          this.rect
            .moveTo(min.x.toFloat(), min.y.toFloat())
            .lineTo(max.x.toFloat(), max.y.toFloat())
        else
          this.rect
            .rect(min.x.toFloat(), min.y.toFloat(), dims.x.toFloat(), dims.y.toFloat())
            .fill(currTheme().abstractionFill)
        this.rect.stroke({ width: 1, color: currTheme().abstractionOutline })
      }
    }

    this.onPointerUp = (ev) => {
      if (this.start === undefined) return
      const coords = view.mouseToGridSnappedWithBounds(ev.screen)
      if (this.start.x.ne(coords.x) && this.start.y.ne(coords.y)) {
        this.view.addFace(Face.unconnected(Polygon.rect(this.start, coords), false, Mtx2x3.I))
      }
      this.start = undefined
      this.rect.removeFromParent()
    }

    this.view.container.on('pointerdown', this.onPointerDown)
    this.view.container.on('pointermove', this.onPointerMove)
    this.view.container.on('pointerup', this.onPointerUp)
    this.view.container.on('pointerupoutside', this.onPointerUp)
  }

  cleanup(): void {
    this.view.container.off('pointerdown', this.onPointerDown)
    this.view.container.off('pointermove', this.onPointerMove)
    this.view.container.off('pointerup', this.onPointerUp)
    this.view.container.off('pointerupoutside', this.onPointerUp)
    this.cursor.removeFromParent()
    this.rect.removeFromParent()
  }
}

class StMove implements State {
  view: AbstractionView

  constructor(view: AbstractionView) {
    this.view = view
  }

  cleanup(): void {}
}

/** The container that renders the abstraction */
export class AbstractionView {
  design: Design
  renderer: Renderer
  parent: Container
  undoStack: UndoStack
  container: Container
  transform: Matrix
  grid: Graphics
  faces: Map<FaceID, Graphics> = new Map()
  state: State

  /** Constructs an abstraction view for a specific project under a parent container */
  constructor(design: Design, renderer: Renderer, parent: Container, undoStack: UndoStack) {
    this.design = design
    this.renderer = renderer
    this.parent = parent
    this.undoStack = undoStack
    this.container = new Container()
    parent.addChild(this.container)

    this.transform = Matrix.IDENTITY
    this.grid = new Graphics()
    this.container.addChild(this.grid)
    // ideally this would be the rectangle of the container, but
    // right now the container's size is 0
    this.container.hitArea = this.renderer.screen
    this.container.eventMode = 'static'
    this.state = new StDraw(this)
  }

  /** Converts mouse coordinates to grid coordinates. */
  mouseToGrid(p: Point): Point {
    return this.transform.applyInverse(p)
  }

  /** Converts mouse coordinates to grid coordinates and snaps them to the grid, assuming an infinite grid. */
  mouseToGridSnapped(p: Point): Vec2 {
    return this.design.grid.snap(this.mouseToGrid(p))
  }

  /** Converts mouse coordinates to grid coordinates and snaps them to the grid in bounds. */
  mouseToGridSnappedWithBounds(p: Point): Vec2 {
    return this.design.grid.snapWithBounds(this.mouseToGrid(p))
  }

  /** Converts grid coordinates to mouse coordinates */
  gridToMouse(p: Point | Vec2): Point {
    const point = p instanceof Vec2 ? p.toPixi() : p
    return this.transform.apply(point)
  }

  /** Adds a face to the abstraction and gets the ID */
  addFace(face: Face): FaceID {
    const action = this.design.abstraction.addFace(face)
    this.undoStack.push(action)
    return action.faceID
  }

  private drawFace(faceID: FaceID) {
    const face = this.design.abstraction.faces.get(faceID)!
    const transform = face.transform.toPixi().prepend(this.transform)
    const graphics = this.faces.get(faceID)!
    graphics
      .clear()
      .setTransform(transform)
      .poly(
        face.polygon.points.map((p) => p.toPixi()),
        true,
      )
      .fill(currTheme().abstractionFill)
      .stroke({ width: 1, color: currTheme().abstractionOutline })
  }

  show() {
    this.parent.addChild(this.container)
  }

  hide() {
    this.container.removeFromParent()
  }

  /** Updates the state of the project (except the design)
   * with an action that just got performed on the design
   */
  update(action: Action) {
    if (action instanceof GridChanged) {
      // Yeah, changing the grid is effectively a resize. Gotta redraw everything
      this.render()
      //
    } else if (action instanceof FaceAdded) {
      const graphics = new Graphics()
      this.container.addChild(graphics)
      this.faces.set(action.faceID, graphics)
      this.drawFace(action.faceID)
      //
    } else if (action instanceof FaceChanged) {
      this.drawFace(action.faceID)
      //
    } else if (action instanceof FaceRemoved) {
      this.faces.get(action.faceID)!.removeFromParent()
      this.faces.delete(action.faceID)
      //
    } else {
      throw new Error(`Unknown action type: ${action.constructor.name}`)
    }
  }

  render() {
    this.container.hitArea = this.renderer.screen
    this.transform = this.design.grid.transform(this.renderer)
    this.grid.clear().setTransform(this.transform)
    this.design.grid.draw(this.grid).stroke({ width: 1, color: currTheme().grid })
    for (const face of this.design.abstraction.faces) this.drawFace(face[0])
  }
}
