/*! For now, we will only be supporting box pleating, so
we'll be doing a lot of integral math. And rational math. */

/** A note that the value should be an integer.
 * Unfortunately JavaScript doesn't have a dedicated integer type,
 * so this is just a note. */
export type Int = number

/** Greatest common divisor
 * (the greatest positive integer `n` such that `n` divides both `a` and `b`.
 * If `a` and `b` are both 0, the result is undefined.) */
export function gcd(a: Int, b: Int): Int {
  // Modulo is defined in JS to return the result of abs(`a`) % abs(`b`),
  // with the sign being the sign of `a`.
  // We are taking advantage of this here.
  // As a floor modulo fan, I'm ashamed to have to admit this one and only convenient
  // use of truncation modulo and then wash my hands afterward.
  while (b !== 0) [a, b] = [b, a % b]
  return Math.abs(a)
}

/** Least common multiple */
export function lcm(a: Int, b: Int): Int {
  const gcd_ = gcd(a, b)
  return gcd_ * (a / gcd_) * (b / gcd_)
}

/** The rational type. Is immutable.
 * Fractions are simplified after every operation,
 * so two fractions equal iff they have the same
 * numerator and denominator.
 */
export class Rat {
  private n: Int
  private d: Int // should be positive

  /** The raw construction method. Does no simplification. */
  private constructor(n: Int, d: Int) {
    this.n = n
    this.d = d
  }

  /** Construct a rational. */
  static of(numerator: Int, denominator: Int): Rat {
    const self = new Rat(numerator, denominator)
    return self.simplify().normalizeNegative()
  }

  // Some small constants
  static NEG_ONE: Rat = Rat.of(-1, 1)
  static ZERO: Rat = Rat.of(0, 1)
  static ONE: Rat = Rat.of(1, 1)
  static TWO: Rat = Rat.of(2, 1)
  static THREE: Rat = Rat.of(3, 1)
  static FOUR: Rat = Rat.of(4, 1)

  /** Construct a `Rat` from an integer */
  static int(n: Int): Rat {
    // No simplification necessary
    return new Rat(n, 1)
  }

  private normalizeNegative(): Rat {
    if (this.d < 0) {
      this.n *= -1
      this.d *= -1
    }
    return this
  }

  private simplify(): Rat {
    const gcd_ = gcd(this.n, this.d)
    this.n /= gcd_
    this.d /= gcd_
    return this
  }

  neg(): Rat {
    // No simplification needed
    return new Rat(-this.n, this.d)
  }

  add(that: Rat): Rat {
    const gcd_ = gcd(this.d, that.d)
    return Rat.of(
      this.n * (that.d / gcd_) + that.n * (this.d / gcd_),
      gcd_ * (this.d / gcd_) * (that.d / gcd_),
    )
  }

  sub(that: Rat): Rat {
    const gcd_ = gcd(this.d, that.d)
    return Rat.of(
      this.n * (that.d / gcd_) - that.n * (this.d / gcd_),
      gcd_ * (this.d / gcd_) * (that.d / gcd_),
    )
  }

  recip(): Rat {
    return new Rat(this.d, this.n).normalizeNegative()
  }

  mul(that: Rat): Rat {
    const thisGcd = gcd(this.n, that.d)
    const thatGcd = gcd(that.n, this.d)
    // No simplication needed
    return new Rat((this.n / thisGcd) * (that.n / thatGcd), (this.d / thatGcd) * (that.d / thisGcd))
  }

  div(that: Rat): Rat {
    const thisGcd = gcd(this.n, that.n)
    const thatGcd = gcd(that.d, this.d)
    return new Rat(
      (this.n / thisGcd) * (that.d / thatGcd),
      (this.d / thatGcd) * (that.n / thisGcd),
    ).normalizeNegative()
  }

  eq(that: Rat): boolean {
    // The nice thing about keeping a standard representation is that
    // this becomes easy
    return this.n === that.n && this.d === that.d
  }

  ne(that: Rat): boolean {
    return !this.eq(that)
  }

  lt(that: Rat): boolean {
    const gcd_ = gcd(this.d, that.d)
    return this.n * (that.d / gcd_) < that.n * (this.d / gcd_)
  }

  le(that: Rat): boolean {
    return this.eq(that) || this.lt(that)
  }

  gt(that: Rat): boolean {
    const gcd_ = gcd(this.d, that.d)
    return this.n * (that.d / gcd_) > that.n * (this.d / gcd_)
  }

  ge(that: Rat): boolean {
    return this.eq(that) || this.gt(that)
  }

  // Some comparison functions that just require comparing the numerator
  // (because the denominator is positive)

  isNegative(): boolean {
    return this.n < 0
  }

  isPositive(): boolean {
    return this.n > 0
  }

  isNonpositive(): boolean {
    return this.n <= 0
  }

  isNonnegative(): boolean {
    return this.n >= 0
  }

  /** -1, 0, or 1 depending on the sign of this rational. */
  sign(): Int {
    return Math.sign(this.n)
  }
}
