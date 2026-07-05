import type { Project } from '@/project/project'
import { Container, Graphics, HTMLText, Matrix } from 'pixi.js'
import * as common from './common'

/** The container that renders the abstraction */
export class AbstractionView {
  project: Project
  container: Container
  transform: Matrix
  grid: Graphics

  /** Constructs an abstraction view for a specific project under a parent container */
  constructor(project: Project, container: Container) {
    this.project = project
    this.container = new Container()
    container.addChild(this.container)

    this.transform = Matrix.IDENTITY
    this.grid = new Graphics()
    this.container.addChild(this.grid)
  }

  redraw() {
    this.grid.clear().setTransform(this.transform)
    this.project.grid.draw(this.grid).stroke({ width: 1, color: 0xc0c0c0 })
  }

  /** Resize the transform. */
  resize(transform: Matrix) {
    this.transform = transform
    this.redraw()
  }
}
