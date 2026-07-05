import type { Graphics, Renderer } from 'pixi.js'
import { Matrix } from 'pixi.js'

/** Stores a grid. For now, only rectangular grids. */
export class Grid {
  private _width: number
  private _height: number

  constructor(width: number, height: number) {
    this._width = width
    this._height = height
  }

  /** Get the transform that the grid should be drawn with on the given renderer */
  transform(renderer: Renderer): Matrix {
    const MARGIN = 12
    const width = (renderer.width - 2 * MARGIN) / this._width
    const height = (renderer.height - 2 * MARGIN) / this._height
    const scale = Math.floor(Math.min(width, height)) // keep grid intervals nice and even
    return Matrix.IDENTITY.scale(scale, scale).translate(
      renderer.width / 2 - (this._width / 2) * scale,
      renderer.height / 2 - (this._height / 2) * scale,
    )
  }

  /** Draw the grid. The size of the grid and the graphics are both the width and height given,
   * so resize the graphics as necessary.
   */
  draw(graphics: Graphics): Graphics {
    for (let i = 0; i <= this._width; ++i) graphics.moveTo(i, 0).lineTo(i, this._height)
    for (let i = 0; i <= this._height; ++i) graphics.moveTo(0, i).lineTo(this._width, i)
    return graphics
  }
}
