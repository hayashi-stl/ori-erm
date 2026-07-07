import { currTheme } from '@/config'
import type { Design } from '@/design/design'
import { Container, Graphics, Matrix, type Renderer } from 'pixi.js'

/** The container that renders the abstraction */
export class AbstractionView {
  project: Design
  renderer: Renderer
  parent: Container
  container: Container
  transform: Matrix
  grid: Graphics

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
  }

  show() {
    this.parent.addChild(this.container)
  }

  hide() {
    this.container.removeFromParent()
  }

  render() {
    this.transform = this.project.grid.transform(this.renderer)
    this.grid.clear().setTransform(this.transform)
    this.project.grid.draw(this.grid).stroke({ width: 1, color: currTheme().grid })
  }
}
