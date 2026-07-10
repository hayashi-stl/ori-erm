import { describe, expect, it } from 'vitest'
import { gcd, lcm, Rat } from '@/math/fraction'

describe('GCD', () => {
  it('a = 0', () => expect(gcd(0, 5)).toBe(5))
  it('b = 0', () => expect(gcd(5, 0)).toBe(5))
  it('a = 1', () => expect(gcd(1, 4)).toBe(1))
  it('multiple iterations', () => expect(gcd(6, 10)).toBe(2))
  it('a = b', () => expect(gcd(7, 7)).toBe(7))
  it('a < 0, b > 0', () => expect(gcd(-6, 10)).toBe(2))
  it('a < 0, b = 0', () => expect(gcd(-6, 0)).toBe(6))
  it('a < 0, b < 0', () => expect(gcd(-6, -10)).toBe(2))
  it('a = 0, b < 0', () => expect(gcd(0, -6)).toBe(6))
  it('a > 0, b < 0', () => expect(gcd(10, -6)).toBe(2))
})

describe('LCM', () => {
  it('a = 0', () => expect(lcm(0, 5)).toBe(0))
  it('b = 0', () => expect(lcm(5, 0)).toBe(0))
  it('a = 1', () => expect(lcm(1, 4)).toBe(4))
  it('multiple iterations', () => expect(lcm(6, 10)).toBe(30))
  it('a = b', () => expect(lcm(7, 7)).toBe(7))
})

describe('Fraction new', () => {
  it('simplified', () => expect(Rat.of(3, 2)).toEqual(Rat.of(3, 2)))
  it('needs simplification', () => expect(Rat.of(6, 4)).toEqual(Rat.of(3, 2)))
  it('zero', () => expect(Rat.of(0, 5)).toEqual(Rat.of(0, 1)))
  it('negative numerator', () => expect(Rat.of(-3, 15)).toEqual(Rat.of(-1, 5)))
  it('negative denominator', () => expect(Rat.of(3, -15)).toEqual(Rat.of(-1, 5)))
})

describe('Fraction neg', () => {
  it('positive', () => expect(Rat.of(4, 3).neg()).toEqual(Rat.of(-4, 3)))
  it('negative', () => expect(Rat.of(-4, 3).neg()).toEqual(Rat.of(4, 3)))
})

describe('Fraction add', () => {
  it('same denominator', () => expect(Rat.of(4, 3).add(Rat.of(1, 3))).toEqual(Rat.of(5, 3)))
  it('needs simplification', () => expect(Rat.of(4, 3).add(Rat.of(2, 3))).toEqual(Rat.of(2, 1)))
  it('big values', () =>
    expect(Rat.of(10, 2 ** 53 - 1).add(Rat.of(23, 2 ** 53 - 1))).toEqual(Rat.of(33, 2 ** 53 - 1)))
  it('different denominators', () => expect(Rat.of(4, 9).add(Rat.of(7, 6))).toEqual(Rat.of(29, 18)))
})

describe('Fraction sub', () => {
  it('same denominator', () => expect(Rat.of(4, 3).sub(Rat.of(2, 3))).toEqual(Rat.of(2, 3)))
  it('needs simplification', () => expect(Rat.of(4, 3).sub(Rat.of(1, 3))).toEqual(Rat.of(1, 1)))
  it('big values', () =>
    expect(Rat.of(10, 2 ** 53 - 1).sub(Rat.of(23, 2 ** 53 - 1))).toEqual(Rat.of(-13, 2 ** 53 - 1)))
  it('different denominators', () =>
    expect(Rat.of(4, 9).sub(Rat.of(7, 6))).toEqual(Rat.of(-13, 18)))
})

describe('Fraction recip', () => {
  it('positive', () => expect(Rat.of(4, 3).recip()).toEqual(Rat.of(3, 4)))
  it('negative', () => expect(Rat.of(-4, 3).recip()).toEqual(Rat.of(-3, 4)))
})

describe('Fraction mul', () => {
  it('simple', () => expect(Rat.of(2, 3).mul(Rat.of(5, 7))).toEqual(Rat.of(10, 21)))
  it('needs simplification', () => expect(Rat.of(2, 3).mul(Rat.of(9, 2))).toEqual(Rat.of(3, 1)))
  it('big values', () =>
    expect(Rat.of(10, 2 ** 53 - 1).mul(Rat.of(2 ** 53 - 1, 23))).toEqual(Rat.of(10, 23)))
  it('left negative', () => expect(Rat.of(-2, 3).mul(Rat.of(5, 7))).toEqual(Rat.of(-10, 21)))
  it('right negative', () => expect(Rat.of(2, 3).mul(Rat.of(-5, 7))).toEqual(Rat.of(-10, 21)))
})

describe('Fraction div', () => {
  it('simple', () => expect(Rat.of(2, 3).div(Rat.of(7, 5))).toEqual(Rat.of(10, 21)))
  it('needs simplification', () => expect(Rat.of(2, 3).div(Rat.of(2, 9))).toEqual(Rat.of(3, 1)))
  it('big values', () =>
    expect(Rat.of(10, 2 ** 53 - 1).div(Rat.of(23, 2 ** 53 - 1))).toEqual(Rat.of(10, 23)))
  it('left negative', () => expect(Rat.of(-2, 3).div(Rat.of(7, 5))).toEqual(Rat.of(-10, 21)))
  it('right negative', () => expect(Rat.of(2, 3).div(Rat.of(-7, 5))).toEqual(Rat.of(-10, 21)))
})
