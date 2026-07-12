import { Rat } from './fraction'

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

  /** Beware: the list is aliased */
  constructor(points: Vec2[]) {
    this.points = points
  }

  clone(): Polygon {
    return new Polygon([...this.points])
  }

  /** Generates a list of vertex duplicates (indices of vertices that have the same position as the next vertex) */
  *duplicates() {
    // Do the naïve quadratic check for now.
    // Input size is expected to be small.
    for (let i = 0; i < this.points.length; ++i)
      if (this.points[i]!.eq(this.points[(i + 1) % this.points.length]!)) yield i
  }

  /** Gets whether this polygon has a pair of duplicate vertices (consecutive vertices that have the same position) */
  hasDuplicate(): boolean {
    return !this.duplicates().next().done
  }
}

/** Check if a polygon is semi-convex.
 * A semi-convex polygon is either
 *  * a positive-area polygon that never makes left turns or never makes right turns
 *  * a zero-area polygon makes exactly 2 180° turns.
 */
//export function isConvex(polygon: Polygon): boolean {}
