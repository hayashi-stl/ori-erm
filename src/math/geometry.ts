import { Point } from 'pixi.js'
import { type Int } from './fraction'
import { Vec2 } from './linear'
import { mod } from './math'
import 'pixi.js/math-extras'

/** A polygon, which is a sequence of points. Polygons are assumed to be closed. */
export class Polygon {
  points: Vec2[]

  get length(): Int {
    return this.points.length
  }

  /** Beware: the list is aliased */
  constructor(points: Vec2[]) {
    this.points = points
  }

  /** Constructs an axis-aligned rectangle from two corners, winded clockwise.
   */
  static rect(start: Vec2, end: Vec2) {
    const min = start.min(end)
    const max = start.max(end)
    return new Polygon([min, new Vec2(max.x, min.y), max, new Vec2(min.x, max.y)])
  }

  clone(): Polygon {
    return new Polygon([...this.points])
  }

  /** Gets a reference to the point at `index`, going in cyclic order of the point.
   * For example, passing 9 to a 7-sided polygon will get the vertex at index 2.
   * Negative indices also work. -1 in a 5-sided polygon is equivalent to 4.
   */
  at(index: Int): Vec2 {
    // Because of how `at` works, this works even with
    // negative `index` and silly truncation modulo.
    return this.points[index % this.length]!
  }

  /** Rotate the points so that point `index` moves to position 0. */
  rotatePoints(index: Int) {
    const reduced = mod(index, this.length)
    this.points = this.points.slice(reduced).concat(this.points.slice(0, reduced))
  }

  /** Generates a list of vertex duplicates (indices of vertices that have the same position as the next vertex) */
  *duplicates() {
    // Do the naïve quadratic check for now.
    // Input size is expected to be small.
    for (let i = 0; i < this.length; ++i) if (this.at(i).eq(this.at(i + 1))) yield i
  }

  /** Gets whether this polygon has a pair of duplicate vertices (consecutive vertices that have the same position) */
  hasDuplicate(): boolean {
    return !this.duplicates().next().done
  }

  /** Check if a polygon is (weakly) convex. We assume the polygon has no duplicate points
   * (`hasDuplicate()` returns `false`).
   * A weakly convex polygon is a polygon that either
   *  * makes at least 1 left/right turn, and never turns left or never turns right, and never turns 180°
   *  * makes no left/right turns, and makes at most 2 180° turns (technically exactly, but that's equivalent)
   */
  isConvex(): boolean {
    let uTurns = 0
    let sideTurn = 0 // negative for one turn direction, positive for the other.

    for (let i = 0; i < this.length; ++i) {
      const p0 = this.at(i)
      const p1 = this.at(i + 1)
      const p2 = this.at(i + 2)
      const turn = p1.sub(p0).cross(p2.sub(p1)).sign()
      if (turn === 0) {
        // Straight or 180° turn
        if (p1.sub(p0).dot(p2.sub(p1)).isNegative()) {
          ++uTurns
          if (sideTurn !== 0 || uTurns > 2) return false
        }
      } else if ((sideTurn > 0 && turn < 0) || (sideTurn < 0 && turn > 0) || uTurns > 0)
        return false
      else sideTurn = turn
    }

    return true
  }

  /** Gets the approximate center of mass of the polygon; useful for e.g. rendering.
   * The approximation is computed by converting everything to floats first
   */
  centerOfMassApprox(): Point {
    const points = this.points.map((p) => p.toPixi())
    const sumCenters = new Point(0, 0)
    let sumWeights = 0
    for (let i = 1; i < points.length; ++i) {
      const p0 = points[0]!
      const p1 = points[i]!
      const p2 = points[(i + 1) % points.length]!
      const weight = p1.subtract(p0).cross(p2.subtract(p0))
      sumCenters.add(
        p0
          .add(p1)
          .add(p2)
          .multiplyScalar(weight / 3),
        sumCenters,
      )
      sumWeights += weight
    }
    return sumCenters.multiplyScalar(1 / sumWeights)
  }
}
