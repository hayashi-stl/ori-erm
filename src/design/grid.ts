import { Rat, type Int } from '@/math/fraction'
import { Vec2 } from '@/math/linear'
import { clamp } from '@/math/math'
import type { Graphics, Point, Renderer } from 'pixi.js'
import { Matrix } from 'pixi.js'

/** Stores a grid. For now, only rectangular grids. */
export class Grid {
  private width: Int
  private height: Int

  constructor(width: Int, height: Int) {
    this.width = width
    this.height = height
  }

  /** Get the transform that the grid should be drawn with on the given renderer */
  transform(renderer: Renderer): Matrix {
    const MARGIN = 12
    const width = (renderer.width - 2 * MARGIN) / this.width
    const height = (renderer.height - 2 * MARGIN) / this.height
    const scale = Math.floor(Math.min(width, height)) // keep grid intervals nice and even
    return Matrix.IDENTITY.scale(scale, scale).translate(
      renderer.width / 2 - (this.width / 2) * scale,
      renderer.height / 2 - (this.height / 2) * scale,
    )
  }

  /** Snaps a point to the grid, assuming it's infinite.
   * Returns a `Vec2` for now. If in the future bespoke ERM 22.5° gets implemented,
   * this would need to be more dynamic.
   */
  snap(point: Point): Vec2 {
    return new Vec2(Rat.int(Math.round(point.x)), Rat.int(Math.round(point.y)))
  }

  /** Snaps a point to the grid, staying in its bounds.
   * Returns a `Vec2` for now. If in the future bespoke ERM 22.5° gets implemented,
   * this would need to be more dynamic.
   */
  snapWithBounds(point: Point): Vec2 {
    return new Vec2(
      Rat.int(clamp(Math.round(point.x), 0, this.width)),
      Rat.int(clamp(Math.round(point.y), 0, this.height)),
    )
  }

  /** Draw the grid. The size of the grid and the graphics are both the width and height given,
   * so resize the graphics as necessary.
   */
  draw(graphics: Graphics): Graphics {
    for (let i = 0; i <= this.width; ++i) graphics.moveTo(i, 0).lineTo(i, this.height)
    for (let i = 0; i <= this.height; ++i) graphics.moveTo(0, i).lineTo(this.width, i)
    return graphics
  }
}
