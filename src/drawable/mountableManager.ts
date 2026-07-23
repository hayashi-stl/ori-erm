import type { Container } from 'pixi.js'
import { Mountable } from './mountable'
import type { Tag } from './tag'

/** Manages a group of mountables. Really only redraws everything when requested. */
export class MountableManager {
  mountables: Set<Mountable> = new Set()

  constructor() {}

  /** Constructs a new mountable and adds it to the manager. */
  new(
    tag: Tag,
    parent: Container,
    container: Container,
    draw: (self: Mountable) => void,
  ): Mountable {
    const mountable = new Mountable(tag, parent, container, draw)
    this.add(mountable)
    return mountable
  }

  add(mountable: Mountable) {
    this.mountables.add(mountable)
  }

  remove(mountable: Mountable) {
    this.mountables.delete(mountable)
  }

  /** Redraws all the mountables. */
  draw() {
    for (const item of this.mountables) item.draw()
  }
}
