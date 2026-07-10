import type { Polygon } from 'pixi.js'

/** Generates a list of vertex duplicates (indices of vertices that have the same position) */
function* genDuplicates(polygon: Polygon) {
  // Do the naïve quadratic check for now.
  // Input size is expected to be small.
  //for (let i = 0; i < polygon.; ++i)
  //    for (let j = i + 1; j < polygon.points.length; ++i)
  //        if (polygon.points[i])
}

/** Check if a polygon is semi-convex.
 * A semi-convex polygon is either
 *  * a positive-area polygon that never makes left turns or never makes right turns
 *  * a zero-area polygon makes exactly 2 180° turns.
 */
//export function isConvex(polygon: Polygon): boolean {}
