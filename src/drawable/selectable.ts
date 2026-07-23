import type { Container } from 'pixi.js'
import { Mountable } from './mountable'
import type { SelectableManager } from './selectableManager'
import type { Tag } from './tag'

export class Selectable extends Mountable {
  selected: boolean = false
  selectableManager: SelectableManager | undefined

  constructor(tag: Tag, parent: Container, container: Container, draw: (self: Selectable) => void) {
    super(tag, parent, container, () => {})
    this.draw_ = () => draw(this)
    this.draw()
    container.eventMode = 'static'
    container.on('click', (ev) => {
      if (ev.shiftKey) {
        if (this.selected) this.selectableManager?.deselect(this)
        else this.selectableManager?.select(this)
      } else {
        this.selectableManager?.clearSelection()
        this.selectableManager?.select(this)
      }
    })
  }

  removeFromSelectableManager() {
    this.selectableManager?.remove(this)
  }

  removeFromManagers() {
    this.removeFromSelectableManager()
    this.removeFromMountableManager()
  }

  /** Selects the selectable, ignoring the manager */
  select() {
    this.selected = true
    this.draw()
  }

  /** Deselects the selectable, ignoring the manager */
  deselect() {
    this.selected = false
    this.draw()
  }
}
