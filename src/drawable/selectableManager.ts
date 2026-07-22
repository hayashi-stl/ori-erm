import type { Container } from 'pixi.js'
import type { MountableManager } from './mountableManager'
import { Selectable } from './selectable'
import { shallowReactive, type ShallowReactive } from 'vue'

/** Manages a group of `Selectable`s */
export class SelectableManager {
  selectables: Set<Selectable> = new Set()
  selection: ShallowReactive<Set<Selectable>> = shallowReactive(new Set())
  mountableManager: MountableManager
  private enabled: boolean = true

  constructor(mountableManager: MountableManager) {
    this.mountableManager = mountableManager
  }

  /** Constructs a new selectable and adds it to the managers. */
  new(parent: Container, container: Container, draw: (self: Selectable) => void): Selectable {
    const selectable = new Selectable(parent, container, draw)
    this.mountableManager.add(selectable)
    this.add(selectable)
    return selectable
  }

  /** Adds a selectable to only the `SelectableManager` */
  add(selectable: Selectable) {
    this.selectables.add(selectable)
    selectable.selectableManager = this
  }

  /** Removes a selectable from only the `SelectableManager` */
  remove(selectable: Selectable) {
    this.selectables.delete(selectable)
    this.selection.delete(selectable)
    selectable.selectableManager = undefined
  }

  select(selectable: Selectable) {
    if (!this.enabled) return
    this.selection.add(selectable)
    selectable.select()
  }

  deselect(selectable: Selectable) {
    if (!this.enabled) return
    this.selection.delete(selectable)
    selectable.deselect()
  }

  clearSelection() {
    for (const item of this.selection) item.deselect()
    this.selection.clear()
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
    this.clearSelection()
  }
}
