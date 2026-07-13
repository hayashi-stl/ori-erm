import { Rat, type Int } from './fraction'
import { mod } from './math'

/** A vector in 2D space. Also used to represent points. */
export class Vec2 {
  x: Rat = Rat.ZERO
  y: Rat = Rat.ZERO

  /** The zero vector. */
  static get ZERO() {
    return new Vec2(Rat.ZERO, Rat.ZERO)
  }

  /** The all-1 vector */
  static get ONES() {
    return new Vec2(Rat.ONE, Rat.ONE)
  }

  /** The +x unit vector */
  static get POS_X() {
    return new Vec2(Rat.ONE, Rat.ZERO)
  }

  /** The +y unit vector */
  static get POS_Y() {
    return new Vec2(Rat.ZERO, Rat.ONE)
  }

  /** The -x unit vector */
  static get NEG_X() {
    return new Vec2(Rat.NEG_ONE, Rat.ZERO)
  }

  /** The -y unit vector */
  static get NEG_Y() {
    return new Vec2(Rat.ZERO, Rat.NEG_ONE)
  }

  constructor(x: Rat, y: Rat) {
    this.x = x
    this.y = y
  }

  /** Clones this vector. */
  clone(): Vec2 {
    return new Vec2(this.x, this.y)
  }

  addAssign(that: Vec2): Vec2 {
    this.x = this.x.add(that.x)
    this.y = this.y.add(that.y)
    return this
  }

  add(that: Vec2): Vec2 {
    return new Vec2(this.x.add(that.x), this.y.add(that.y))
  }

  subAssign(that: Vec2): Vec2 {
    this.x = this.x.sub(that.x)
    this.y = this.y.sub(that.y)
    return this
  }

  sub(that: Vec2): Vec2 {
    return new Vec2(this.x.sub(that.x), this.y.sub(that.y))
  }

  /** Scalar multiplication */
  mulAssign(that: Rat): Vec2 {
    this.x = this.x.mul(that)
    this.y = this.y.mul(that)
    return this
  }

  /** Scalar multiplication */
  mul(that: Rat): Vec2 {
    return new Vec2(this.x.mul(that), this.y.mul(that))
  }

  /** Scalar division */
  divAssign(that: Rat): Vec2 {
    this.x = this.x.div(that)
    this.y = this.y.div(that)
    return this
  }

  /** Scalar division */
  div(that: Rat): Vec2 {
    return new Vec2(this.x.div(that), this.y.div(that))
  }

  dot(that: Vec2): Rat {
    return this.x.mul(that.x).add(this.y.mul(that.y))
  }

  /** The dot product of `this` and `that` rotated 90° counterclockwise. */
  cross(that: Vec2): Rat {
    return this.y.mul(that.x).sub(this.x.mul(that.y))
  }

  /** The squared length of the vector */
  len2(): Rat {
    return this.dot(this)
  }

  // Note: there is no normalization function becase that requires a square root,
  // which rational numbers are not closed under.

  /** Reflects `this` across the line whose normal is defined by `that`.
   * Do NOT reflect across the zero vector!
   */
  reflect(that: Vec2): Vec2 {
    return this.sub(that.mul(this.dot(that).mul(Rat.TWO)).div(that.len2()))
  }

  eq(that: Vec2): boolean {
    return this.x.eq(that.x) && this.y.eq(that.y)
  }

  ne(that: Vec2): boolean {
    return !this.eq(that)
  }
}

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
    return this.points.at(index % this.length)!
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
}

/** Check if a polygon is semi-convex.
 * A semi-convex polygon is either
 *  * a positive-area polygon that never makes left turns or never makes right turns
 *  * a zero-area polygon makes exactly 2 180° turns.
 */
//export function isConvex(polygon: Polygon): boolean {}
