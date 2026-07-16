import { currTheme } from '@/config'
import type { Design } from '@/design/design'
import { Mtx2x3, Vec2 } from '@/math/linear'
import { Container, FederatedPointerEvent, Graphics, Matrix, Point, type Renderer } from 'pixi.js'
import { Icon } from './icon'
import { Face } from '@/design/abstraction'
import { Polygon } from '@/math/geometry'

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
    this.rect = new Graphics()
    this.view.container.addChild(this.cursor)

    this.onPointerDown = (ev) => {
      this.start = view.mouseToGridSnappedWithBounds(ev.screen)
      this.view.container.addChild(this.rect)
      this.rect.clear()
      this.cursor.removeFromParent()
    }

    this.onPointerMove = (ev) => {
      const coords = view.mouseToGridSnappedWithBounds(ev.screen)
      this.cursor.position = view.gridToMouse(coords)
      if (this.start !== undefined) {
        const min = this.start.min(coords)
        const dims = this.start.max(coords).sub(min)
        this.rect
          .clear()
          .setTransform(this.view.transform)
          .rect(min.x.toFloat(), min.y.toFloat(), dims.x.toFloat(), dims.y.toFloat())
          .fill(currTheme().abstractionFill)
          .stroke({ width: 1, color: currTheme().abstractionOutline })
      }
    }

    this.onPointerUp = (ev) => {
      if (this.start === undefined) return
      const coords = view.mouseToGridSnappedWithBounds(ev.screen)
      if (this.start.x.ne(coords.x) && this.start.y.ne(coords.y)) {
        this.view.addFace(new Face(Polygon.rect(this.start, coords), false), Mtx2x3.I)
      }
      this.start = undefined
      this.view.container.addChild(this.cursor)
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
  project: Design
  renderer: Renderer
  parent: Container
  container: Container
  transform: Matrix
  grid: Graphics
  faces: Map<Face, Graphics> = new Map()
  state: State

  /** Constructs an abstraction view for a specific project under a parent container */
  constructor(project: Design, renderer: Renderer, parent: Container) {
    this.project = project
    this.renderer = renderer
    this.parent = parent
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
    return this.project.grid.snap(this.mouseToGrid(p))
  }

  /** Converts mouse coordinates to grid coordinates and snaps them to the grid in bounds. */
  mouseToGridSnappedWithBounds(p: Point): Vec2 {
    return this.project.grid.snapWithBounds(this.mouseToGrid(p))
  }

  /** Converts grid coordinates to mouse coordinates */
  gridToMouse(p: Point | Vec2): Point {
    const point = p instanceof Vec2 ? p.toPixi() : p
    return this.transform.apply(point)
  }

  /** Adds a face to the abstraction and draws it */
  addFace(face: Face, transform: Mtx2x3) {
    this.project.abstraction.addFace(face, transform)
    const graphics = new Graphics()
    this.container.addChild(graphics)
    this.faces.set(face, graphics)
    this.drawFace(face)
  }

  private drawFace(face: Face) {
    const transform = this.project.abstraction.faces
      .get(face)!
      .transform.toPixi()
      .prepend(this.transform)
    const graphics = this.faces.get(face)!
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

  render() {
    this.container.hitArea = this.renderer.screen
    this.transform = this.project.grid.transform(this.renderer)
    this.grid.clear().setTransform(this.transform)
    this.project.grid.draw(this.grid).stroke({ width: 1, color: currTheme().grid })
    for (const face of this.project.abstraction.faces) this.drawFace(face[0])
  }
}
