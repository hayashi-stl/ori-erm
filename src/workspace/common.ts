import { Graphics, GraphicsContext } from 'pixi.js'

/** Build a grid. The size of the grid and the graphics are both the width and height given,
 * so resize the graphics as necessary.
 */
export function grid(width: number, height: number): Graphics {
  const grid = new Graphics()
  for (let i = 0; i <= width; ++i) grid.moveTo(i, 0).lineTo(i, height)
  for (let i = 0; i <= height; ++i) grid.moveTo(0, i).lineTo(width, i)
  grid.stroke({ width: 0.05, color: 0x808080 })
  return grid
}
