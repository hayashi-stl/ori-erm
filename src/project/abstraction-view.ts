import { currTheme } from '@/config'
import {
  Face,
  FaceAdded,
  FaceChanged,
  FaceRemoved,
  GridChanged,
  type Action,
  type FaceID,
} from '@/design/design'
import { Mtx2x3, Vec2 } from '@/math/linear'
import { Container, FederatedPointerEvent, Graphics, Matrix, Point, Text } from 'pixi.js'
import { Icon } from './icon'
import { Polygon } from '@/math/geometry'
import { Rat } from '@/math/fraction'
import { AbstractionMode, type Project } from './project'
import type { Selectable } from '@/drawable/selectable'
import { MountableManager } from '@/drawable/mountableManager'
import { SelectableManager } from '@/drawable/selectableManager'
import * as tag from '@/drawable/tag'
import { shallowReactive, type ShallowReactive } from 'vue'
import type { Theme } from '@/themes/theme'

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

class StSelect implements State {
  view: AbstractionView

  constructor(view: AbstractionView) {
    this.view = view
    this.view.selectableManager.enable()
  }

  cleanup(): void {
    this.view.selectableManager.disable()
  }
}

//class StMove implements State {
//  view: AbstractionView
//
//  constructor(view: AbstractionView) {
//    this.view = view
//  }
//
//  cleanup(): void {}
//}

/** The container that renders the abstraction */
export class AbstractionView {
  project: Project
  container: Container
  transform: Matrix
  grid: Graphics
  faces: Map<FaceID, Selectable> = new Map()
  facesSelected: ShallowReactive<Set<FaceID>> = shallowReactive(new Set())
  state: State
  mountableManager: MountableManager
  selectableManager: SelectableManager

  /* prettier-ignore */ get renderer() { return this.project.renderer }
  /* prettier-ignore */ get design() { return this.project.design }
  /* prettier-ignore */ get parent() { return this.project.container }
  /* prettier-ignore */ get zoom() { return this.project.zoom }

  /** Constructs an abstraction view for a specific project under a parent container */
  constructor(project: Project) {
    this.project = project
    this.container = new Container()
    project.parent.addChild(this.container)

    this.transform = Matrix.IDENTITY
    this.grid = new Graphics()
    this.container.addChild(this.grid)
    // ideally this would be the rectangle of the container, but
    // right now the container's size is 0
    this.container.hitArea = this.renderer.screen
    this.container.eventMode = 'static'

    this.mountableManager = new MountableManager()
    this.selectableManager = new SelectableManager(this.mountableManager)
    this.selectableManager.disable()
    this.selectableManager.onSelect = (item) => {
      if (item.tag.type === 'face') this.facesSelected.add(item.tag.faceID)
    }
    this.selectableManager.onDeselect = (item) => {
      if (item.tag.type === 'face') this.facesSelected.delete(item.tag.faceID)
    }
    this.selectableManager.onClear = () => this.facesSelected.clear()
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
    this.project.pushAction(action)
    return action.faceID
  }

  show() {
    this.parent.addChild(this.container)
  }

  hide() {
    this.container.removeFromParent()
  }

  /** Sets the new state. Unfortunately the name needs to be passed separately because
   * we want to clean up the old state before initializing the new state, and we can't
   * get the name of the new state without first initializing it.
   */
  private setState(name: string, state: () => State, force: boolean = false) {
    if (!force && this.state.constructor.name === name) return
    this.state.cleanup()
    this.state = state()
    if (this.state.constructor.name !== name)
      throw Error(`Liar! ${this.state.constructor.name} ≠ ${name}`)
  }

  setMode(mode: AbstractionMode) {
    if (mode === AbstractionMode.Select) this.setState(StSelect.name, () => new StSelect(this))
    else if (mode === AbstractionMode.Rectangle) this.setState(StDraw.name, () => new StDraw(this))
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
      const id = action.faceID
      const container = new Container()
      const polygon = new Graphics()
      const text = new Text()
      text.anchor = new Point(0.5, 0.5)
      text.eventMode = 'none'
      container.addChild(polygon, text)
      const prevTheme: [Theme | undefined] = [undefined]
      const graphics = this.selectableManager.new(tag.face(id), this.container, container, (s) => {
        const face = this.design.abstraction.faces.get(id)
        // This can be called when the face is gone, i.e. right before deletion
        if (face === undefined) return
        const transform = face.transform.toPixi().prepend(this.transform)
        const graphics = s.container.getChildAt<Graphics>(0)
        graphics
          .clear()
          .setTransform(transform)
          .poly(
            face.polygon.points.map((p) => p.toPixi()),
            true,
          )
          .fill(currTheme().abstractionFill)
          .stroke({
            width: s.selected ? 3 : 1,
            color: currTheme().abstractionOutline,
          })
        const text = s.container.getChildAt<Text>(1)
        text.position = transform.apply(face.polygon.centerOfMassApprox())
        // Round to avoid blurry text
        text.position.x = Math.round(text.position.x)
        text.position.y = Math.round(text.position.y)
        // Don't rerender the text if it didn't change
        if (face.name !== text.text || prevTheme[0] !== currTheme()) {
          prevTheme[0] = currTheme()
          text.text = face.name
          text.style = {
            fill: currTheme().textFill,
            stroke: { color: currTheme().textStroke, width: 3, miterLimit: 1.42 },
            fontSize: '15pt',
          }
        }
      })
      this.faces.set(id, graphics)
      //
    } else if (action instanceof FaceChanged) {
      this.faces.get(action.faceID)!.draw()
      //
    } else if (action instanceof FaceRemoved) {
      this.faces.get(action.faceID)!.destroy()
      this.faces.delete(action.faceID)
      //
    } else {
      throw new Error(`Unknown action type: ${action.constructor.name}`)
    }
  }

  render() {
    this.container.hitArea = this.renderer.screen
    this.transform = this.design.grid.transform(this.renderer, this.zoom)
    this.grid.clear().setTransform(this.transform)
    this.design.grid.draw(this.grid).stroke({ width: 1, color: currTheme().grid })
    this.mountableManager.draw()
  }
}
