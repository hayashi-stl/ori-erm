import type { Container } from 'pixi.js'

/** The base class for objects that can be mounted on the screen */
export class Mountable {
  parent: Container
  container: Container

  /** Redraws the mountable */
  draw: () => void

  constructor(parent: Container, container: Container, draw: () => void) {
    this.parent = parent
    this.container = container
    this.draw = draw
  }

  hide() {
    this.container.removeFromParent()
  }

  show() {
    this.parent.addChild(this.container)
    this.draw()
  }
}
