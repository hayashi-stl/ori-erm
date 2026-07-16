import { Matrix, Point } from 'pixi.js'
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

  /** Extends this to a Vec3 by adding a z component */
  extend(z: Rat): Vec3 {
    return new Vec3(this.x, this.y, z)
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

  negAssign(): Vec2 {
    this.x = this.x.neg()
    this.y = this.y.neg()
    return this
  }

  neg(): Vec2 {
    return new Vec2(this.x.neg(), this.y.neg())
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

  /** The dot product of `this` and `that` rotated 90° clockwise.
   * Equivalent to the ([`this`.x, `this`.y, 0] × [`that`.x, `that`.y, 0]).z
   */
  cross(that: Vec2): Rat {
    return this.x.mul(that.y).sub(this.y.mul(that.x))
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

  /** Elementwise minimum */
  min(that: Vec2): Vec2 {
    return new Vec2(this.x.min(that.x), this.y.min(that.y))
  }

  /** Elementwise maximum */
  max(that: Vec2): Vec2 {
    return new Vec2(this.x.max(that.x), this.y.max(that.y))
  }

  /** Elementwise clamping */
  clamp(min: Vec2, max: Vec2): Vec2 {
    return new Vec2(this.x.clamp(min.x, max.x), this.y.clamp(min.y, max.y))
  }

  toString(): string {
    return `[${this.x}, ${this.y}]`
  }

  toFloat(): { x: number; y: number } {
    return { x: this.x.toFloat(), y: this.y.toFloat() }
  }

  /** Converts this to a pixi `Point` */
  toPixi(): Point {
    return new Point(this.x.toFloat(), this.y.toFloat())
  }
}

/** A vector in 3D space. Also used to represent points.
 * Unfortunately TypeScript doesn't support const generics.
 */
export class Vec3 {
  x: Rat = Rat.ZERO
  y: Rat = Rat.ZERO
  z: Rat = Rat.ZERO

  /** The zero vector. */
  static get ZERO() {
    return new Vec3(Rat.ZERO, Rat.ZERO, Rat.ZERO)
  }

  /** The all-1 vector */
  static get ONES() {
    return new Vec3(Rat.ONE, Rat.ONE, Rat.ONE)
  }

  /** The +x unit vector */
  static get POS_X() {
    return new Vec3(Rat.ONE, Rat.ZERO, Rat.ZERO)
  }

  /** The +y unit vector */
  static get POS_Y() {
    return new Vec3(Rat.ZERO, Rat.ONE, Rat.ZERO)
  }

  /** The +z unit vector */
  static get POS_Z() {
    return new Vec3(Rat.ZERO, Rat.ZERO, Rat.ONE)
  }

  /** The -x unit vector */
  static get NEG_X() {
    return new Vec3(Rat.NEG_ONE, Rat.ZERO, Rat.ZERO)
  }

  /** The -y unit vector */
  static get NEG_Y() {
    return new Vec3(Rat.ZERO, Rat.NEG_ONE, Rat.ZERO)
  }

  /** The -z unit vector */
  static get NEG_Z() {
    return new Vec3(Rat.ZERO, Rat.ZERO, Rat.NEG_ONE)
  }

  constructor(x: Rat, y: Rat, z: Rat) {
    this.x = x
    this.y = y
    this.z = z
  }

  /** Clones this vector. */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z)
  }

  addAssign(that: Vec3): Vec3 {
    this.x = this.x.add(that.x)
    this.y = this.y.add(that.y)
    this.z = this.z.add(that.z)
    return this
  }

  add(that: Vec3): Vec3 {
    return new Vec3(this.x.add(that.x), this.y.add(that.y), this.z.add(that.z))
  }

  subAssign(that: Vec3): Vec3 {
    this.x = this.x.sub(that.x)
    this.y = this.y.sub(that.y)
    this.z = this.z.sub(that.z)
    return this
  }

  sub(that: Vec3): Vec3 {
    return new Vec3(this.x.sub(that.x), this.y.sub(that.y), this.z.sub(that.z))
  }

  negAssign(): Vec3 {
    this.x = this.x.neg()
    this.y = this.y.neg()
    this.z = this.z.neg()
    return this
  }

  neg(): Vec3 {
    return new Vec3(this.x.neg(), this.y.neg(), this.z.neg())
  }

  /** Scalar multiplication */
  mulAssign(that: Rat): Vec3 {
    this.x = this.x.mul(that)
    this.y = this.y.mul(that)
    this.z = this.z.mul(that)
    return this
  }

  /** Scalar multiplication */
  mul(that: Rat): Vec3 {
    return new Vec3(this.x.mul(that), this.y.mul(that), this.z.mul(that))
  }

  /** Scalar division */
  divAssign(that: Rat): Vec3 {
    this.x = this.x.div(that)
    this.y = this.y.div(that)
    this.z = this.z.div(that)
    return this
  }

  /** Scalar division */
  div(that: Rat): Vec3 {
    return new Vec3(this.x.div(that), this.y.div(that), this.z.div(that))
  }

  dot(that: Vec3): Rat {
    return this.x.mul(that.x).add(this.y.mul(that.y)).add(this.z.mul(that.z))
  }

  cross(that: Vec3): Vec3 {
    return new Vec3(
      this.y.mul(that.z).sub(this.z.mul(that.y)),
      this.z.mul(that.x).sub(this.x.mul(that.z)),
      this.x.mul(that.y).sub(this.y.mul(that.x)),
    )
  }

  /** The squared length of the vector */
  len2(): Rat {
    return this.dot(this)
  }

  // Note: there is no normalization function becase that requires a square root,
  // which rational numbers are not closed under.

  /** Reflects `this` across the plane whose normal is defined by `that`.
   * Do NOT reflect across the zero vector!
   */
  reflect(that: Vec3): Vec3 {
    return this.sub(that.mul(this.dot(that).mul(Rat.TWO)).div(that.len2()))
  }

  eq(that: Vec3): boolean {
    return this.x.eq(that.x) && this.y.eq(that.y) && this.z.eq(that.z)
  }

  ne(that: Vec3): boolean {
    return !this.eq(that)
  }

  /** Elementwise minimum */
  min(that: Vec3): Vec3 {
    return new Vec3(this.x.min(that.x), this.y.min(that.y), this.z.min(that.z))
  }

  /** Elementwise maximum */
  max(that: Vec3): Vec3 {
    return new Vec3(this.x.max(that.x), this.y.max(that.y), this.z.max(that.z))
  }

  /** Elementwise clamping */
  clamp(min: Vec3, max: Vec3): Vec3 {
    return new Vec3(
      this.x.clamp(min.x, max.x),
      this.y.clamp(min.y, max.y),
      this.z.clamp(min.z, max.z),
    )
  }

  toString(): string {
    return `[${this.x}, ${this.y}, ${this.z}]`
  }

  toFloat(): { x: number; y: number; z: number } {
    return { x: this.x.toFloat(), y: this.y.toFloat(), z: this.z.toFloat() }
  }
}

/** A 2×2 matrix. */
export class Mtx2 {
  // The columns
  c0: Vec2
  c1: Vec2

  /** The zero matrix. */
  static get ZERO() {
    return new Mtx2(Vec2.ZERO, Vec2.ZERO)
  }

  /** The identity matrix. */
  static get I() {
    return new Mtx2(Vec2.POS_X, Vec2.POS_Y)
  }

  /** Beware: the vectors are aliased */
  constructor(c0: Vec2, c1: Vec2) {
    this.c0 = c0
    this.c1 = c1
  }

  /** Clones this matrix. */
  clone() {
    return new Mtx2(this.c0.clone(), this.c1.clone())
  }

  addAssign(that: Mtx2): Mtx2 {
    this.c0.addAssign(that.c0)
    this.c1.addAssign(that.c1)
    return this
  }

  add(that: Mtx2): Mtx2 {
    return new Mtx2(this.c0.add(that.c0), this.c1.add(that.c1))
  }

  subAssign(that: Mtx2): Mtx2 {
    this.c0.subAssign(that.c0)
    this.c1.subAssign(that.c1)
    return this
  }

  sub(that: Mtx2): Mtx2 {
    return new Mtx2(this.c0.sub(that.c0), this.c1.sub(that.c1))
  }

  negAssign(): Mtx2 {
    this.c0.negAssign()
    this.c1.negAssign()
    return this
  }

  neg(): Mtx2 {
    return new Mtx2(this.c0.neg(), this.c1.neg())
  }

  /** Scalar multiplication */
  mulAssign(that: Rat): Mtx2 {
    this.c0.mulAssign(that)
    this.c1.mulAssign(that)
    return this
  }

  /** Scalar multiplication */
  mul(that: Rat): Mtx2 {
    return new Mtx2(this.c0.mul(that), this.c1.mul(that))
  }

  /** Scalar division */
  divAssign(that: Rat): Mtx2 {
    this.c0.divAssign(that)
    this.c1.divAssign(that)
    return this
  }

  /** Scalar division */
  div(that: Rat): Mtx2 {
    return new Mtx2(this.c0.div(that), this.c1.div(that))
  }

  transposeAssign(): Mtx2 {
    ;[this.c0.x, this.c0.y, this.c1.x, this.c1.y] = [this.c0.x, this.c1.x, this.c0.y, this.c1.y]
    return this
  }

  transpose(): Mtx2 {
    return new Mtx2(new Vec2(this.c0.x, this.c1.x), new Vec2(this.c0.y, this.c1.y))
  }

  /** Transforms a column vector by multiplying by it with the vector on the right */
  transform(that: Vec2): Vec2 {
    return this.c0.mul(that.x).add(this.c1.mul(that.y))
  }

  /** Matrix multiplication */
  mtxMul(that: Mtx2): Mtx2 {
    return new Mtx2(this.transform(that.c0), this.transform(that.c1))
  }

  det(): Rat {
    return this.c0.cross(this.c1)
  }

  invAssign(): Mtx2 {
    this.divAssign(this.det())
    ;[this.c0.x, this.c0.y, this.c1.x, this.c1.y] = [
      this.c1.y,
      this.c0.y.neg(),
      this.c1.x.neg(),
      this.c0.x,
    ]
    return this
  }

  inv(): Mtx2 {
    return new Mtx2(new Vec2(this.c1.y, this.c0.y.neg()), new Vec2(this.c1.x.neg(), this.c0.x)).div(
      this.det(),
    )
  }

  eq(that: Mtx2): boolean {
    return this.c0.eq(that.c0) && this.c1.eq(that.c1)
  }

  ne(that: Mtx2): boolean {
    return !this.eq(that)
  }

  toString(): string {
    return `[${this.c0}, ${this.c1}]`
  }

  toFloat(): { c0: { x: number; y: number }; c1: { x: number; y: number } } {
    return { c0: this.c0.toFloat(), c1: this.c1.toFloat() }
  }

  /** Converts this to a pixi `Matrix` */
  toPixi(): Matrix {
    return new Matrix(
      this.c0.x.toFloat(),
      this.c0.y.toFloat(),
      this.c1.x.toFloat(),
      this.c1.y.toFloat(),
      0,
      0,
    )
  }
}

/** A 2×3 matrix. Used for representing affine transformations in 2D.
 * This matrix includes square-matrix-specific operations despite not being square.
 * In such cases, it acts like a 3×3 matrix where the last row is [0, 0, 1].
 */
export class Mtx2x3 {
  // The columns
  c0: Vec2
  c1: Vec2
  c2: Vec2

  /** The zero matrix. */
  static get ZERO() {
    return new Mtx2x3(Vec2.ZERO, Vec2.ZERO, Vec2.ZERO)
  }

  /** The identity matrix.*/
  static get I() {
    return new Mtx2x3(Vec2.POS_X, Vec2.POS_Y, Vec2.ZERO)
  }

  /** Beware: the vectors are aliased */
  constructor(c0: Vec2, c1: Vec2, c2: Vec2) {
    this.c0 = c0
    this.c1 = c1
    this.c2 = c2
  }

  /** Clones this matrix. */
  clone() {
    return new Mtx2x3(this.c0.clone(), this.c1.clone(), this.c2.clone())
  }

  addAssign(that: Mtx2x3): Mtx2x3 {
    this.c0.addAssign(that.c0)
    this.c1.addAssign(that.c1)
    this.c2.addAssign(that.c2)
    return this
  }

  add(that: Mtx2x3): Mtx2x3 {
    return new Mtx2x3(this.c0.add(that.c0), this.c1.add(that.c1), this.c2.add(that.c2))
  }

  subAssign(that: Mtx2x3): Mtx2x3 {
    this.c0.subAssign(that.c0)
    this.c1.subAssign(that.c1)
    this.c2.subAssign(that.c2)
    return this
  }

  sub(that: Mtx2x3): Mtx2x3 {
    return new Mtx2x3(this.c0.sub(that.c0), this.c1.sub(that.c1), this.c2.sub(that.c2))
  }

  negAssign(): Mtx2x3 {
    this.c0.negAssign()
    this.c1.negAssign()
    this.c2.negAssign()
    return this
  }

  neg(): Mtx2x3 {
    return new Mtx2x3(this.c0.neg(), this.c1.neg(), this.c2.neg())
  }

  /** Scalar multiplication */
  mulAssign(that: Rat): Mtx2x3 {
    this.c0.mulAssign(that)
    this.c1.mulAssign(that)
    this.c2.mulAssign(that)
    return this
  }

  /** Scalar multiplication */
  mul(that: Rat): Mtx2x3 {
    return new Mtx2x3(this.c0.mul(that), this.c1.mul(that), this.c2.mul(that))
  }

  /** Scalar division */
  divAssign(that: Rat): Mtx2x3 {
    this.c0.divAssign(that)
    this.c1.divAssign(that)
    this.c2.divAssign(that)
    return this
  }

  /** Scalar division */
  div(that: Rat): Mtx2x3 {
    return new Mtx2x3(this.c0.div(that), this.c1.div(that), this.c2.div(that))
  }

  /** Transforms a column vector by multiplying by it with the vector on the right */
  transform(that: Vec3): Vec3 {
    return this.c0.mul(that.x).add(this.c1.mul(that.y)).add(this.c2.mul(that.z)).extend(that.z)
  }

  /** Transforms a vector, assuming that its z component is 0 */
  transformVec(that: Vec2): Vec2 {
    return this.c0.mul(that.x).add(this.c1.mul(that.y))
  }

  /** Transforms a vector, assuming that its z component is 1 */
  transformPoint(that: Vec2): Vec2 {
    return this.c0.mul(that.x).add(this.c1.mul(that.y)).add(this.c2)
  }

  /** Matrix multiplication. Remember the square matrix assumption. */
  mtxMul(that: Mtx2x3): Mtx2x3 {
    return new Mtx2x3(
      this.transformVec(that.c0),
      this.transformVec(that.c1),
      this.transformPoint(that.c2),
    )
  }

  det(): Rat {
    return this.c0.cross(this.c1)
  }

  invAssign(): Mtx2x3 {
    ;[this.c0.x, this.c0.y, this.c1.x, this.c1.y] = [
      this.c1.y,
      this.c0.y.neg(),
      this.c1.x.neg(),
      this.c0.x,
    ]
    this.c2 = this.transformVec(this.c2.neg())
    this.divAssign(this.det())
    return this
  }

  inv(): Mtx2x3 {
    const result = new Mtx2x3(
      new Vec2(this.c1.y, this.c0.y.neg()),
      new Vec2(this.c1.x.neg(), this.c0.x),
      this.c2.neg(),
    )
    result.c2 = result.transformVec(result.c2)
    return result.div(this.det())
  }

  eq(that: Mtx2x3): boolean {
    return this.c0.eq(that.c0) && this.c1.eq(that.c1) && this.c2.eq(that.c2)
  }

  ne(that: Mtx2x3): boolean {
    return !this.eq(that)
  }

  toString(): string {
    return `[${this.c0}, ${this.c1}, ${this.c2}]`
  }

  toFloat(): {
    c0: { x: number; y: number }
    c1: { x: number; y: number }
    c2: { x: number; y: number }
  } {
    return { c0: this.c0.toFloat(), c1: this.c1.toFloat(), c2: this.c2.toFloat() }
  }

  /** Converts this to a pixi `Matrix` */
  toPixi(): Matrix {
    return new Matrix(
      this.c0.x.toFloat(),
      this.c0.y.toFloat(),
      this.c1.x.toFloat(),
      this.c1.y.toFloat(),
      this.c2.x.toFloat(),
      this.c2.y.toFloat(),
    )
  }
}
