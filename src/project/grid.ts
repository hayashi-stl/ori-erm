import type { Graphics, Renderer } from 'pixi.js'
import { Matrix } from 'pixi.js'

/** Stores a grid. For now, only rectangular grids. */
export class Grid {
  private width_: number
  private height_: number

  constructor(width: number, height: number) {
    this.width_ = width
    this.height_ = height
  }

  /** Get the transform that the grid should be drawn with on the given renderer */
  transform(renderer: Renderer): Matrix {
    const MARGIN = 12
    const width = (renderer.width - 2 * MARGIN) / this.width_
    const height = (renderer.height - 2 * MARGIN) / this.height_
    const scale = Math.floor(Math.min(width, height)) // keep grid intervals nice and even
    return Matrix.IDENTITY.scale(scale, scale).translate(
      renderer.width / 2 - (this.width_ / 2) * scale,
      renderer.height / 2 - (this.height_ / 2) * scale,
    )
  }

  /** Draw the grid. The size of the grid and the graphics are both the width and height given,
   * so resize the graphics as necessary.
   */
  draw(graphics: Graphics): Graphics {
    for (let i = 0; i <= this.width_; ++i) graphics.moveTo(i, 0).lineTo(i, this.height_)
    for (let i = 0; i <= this.height_; ++i) graphics.moveTo(0, i).lineTo(this.width_, i)
    return graphics
  }
}
