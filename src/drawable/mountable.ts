import type { Container } from 'pixi.js'
import type { MountableManager } from './mountableManager'

/** The base class for objects that can be mounted on the screen */
export class Mountable {
  parent: Container
  container: Container
  mountableManager: MountableManager | undefined

  /** Redraws the mountable */
  protected draw_: () => void

  constructor(parent: Container, container: Container, draw: (self: Mountable) => void) {
    this.parent = parent
    this.container = container
    this.draw_ = () => draw(this)
    this.show()
  }

  removeFromMountableManager() {
    this.mountableManager?.remove(this)
  }

  removeFromManagers() {
    this.removeFromMountableManager()
  }

  /** Removes this mountable from all managers and destroys it */
  destroy() {
    this.removeFromManagers()
    this.container.removeFromParent()
    this.container.destroy()
  }

  hide() {
    this.container.removeFromParent()
  }

  show() {
    this.parent.addChild(this.container)
    this.draw()
  }

  draw() {
    this.draw_()
  }
}
