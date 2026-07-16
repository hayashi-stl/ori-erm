import type { Theme } from '@/themes/theme'
import { Graphics } from 'pixi.js'

/** A storage for icons that change based on the theme */
export class Icon {
  graphics: Graphics
  render: (g: Graphics, theme: Theme) => void

  constructor(graphics: Graphics, render: (g: Graphics, theme: Theme) => void) {
    this.graphics = graphics
    this.render = render
  }

  /** Re-renders all icons according to theme */
  static renderAll(theme: Theme) {
    for (const icon of Icon.ICONS) {
      icon.graphics.clear()
      icon.render(icon.graphics, theme)
    }
  }

  static RECT_CURSOR = new Graphics()

  static ICONS = [
    new Icon(this.RECT_CURSOR, (g, theme) => {
      g.rect(-5, -5, 10, 10).stroke({ width: 2, color: theme.cursor })
    }),
  ]
}
