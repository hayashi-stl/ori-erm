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
  it('infinite loop regression', () => Rat.ONE.add(Rat.THREE))
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

describe('Fraction eq', () => {
  it('equal', () => expect(Rat.of(1, 2).eq(Rat.of(2, 4))).toBe(true))
  it('not equal', () => expect(Rat.of(1, 2).eq(Rat.of(2, 5))).toBe(false))
})

describe('Fraction ne', () => {
  it('equal', () => expect(Rat.of(1, 2).ne(Rat.of(2, 4))).toBe(false))
  it('not equal', () => expect(Rat.of(1, 2).ne(Rat.of(2, 5))).toBe(true))
})

describe('Fraction lt', () => {
  it('equal', () => expect(Rat.of(1, 2).lt(Rat.of(2, 4))).toBe(false))
  it('same denominator lt', () => expect(Rat.of(2, 3).lt(Rat.of(4, 3))).toBe(true))
  it('same denominator gt', () => expect(Rat.of(4, 3).lt(Rat.of(2, 3))).toBe(false))
  it('big values lt', () => expect(Rat.of(10, 2 ** 53 - 1).lt(Rat.of(23, 2 ** 53 - 1))).toBe(true))
  it('big values gt', () => expect(Rat.of(23, 2 ** 53 - 1).lt(Rat.of(10, 2 ** 53 - 1))).toBe(false))
  it('different denominators lt', () => expect(Rat.of(4, 9).lt(Rat.of(7, 6))).toBe(true))
  it('different denominators gt', () => expect(Rat.of(7, 6).lt(Rat.of(4, 9))).toBe(false))
})

describe('Fraction le', () => {
  it('equal', () => expect(Rat.of(1, 2).le(Rat.of(2, 4))).toBe(true))
  it('same denominator lt', () => expect(Rat.of(2, 3).le(Rat.of(4, 3))).toBe(true))
  it('same denominator gt', () => expect(Rat.of(4, 3).le(Rat.of(2, 3))).toBe(false))
  it('big values lt', () => expect(Rat.of(10, 2 ** 53 - 1).le(Rat.of(23, 2 ** 53 - 1))).toBe(true))
  it('big values gt', () => expect(Rat.of(23, 2 ** 53 - 1).le(Rat.of(10, 2 ** 53 - 1))).toBe(false))
  it('different denominators lt', () => expect(Rat.of(4, 9).le(Rat.of(7, 6))).toBe(true))
  it('different denominators gt', () => expect(Rat.of(7, 6).le(Rat.of(4, 9))).toBe(false))
})

describe('Fraction gt', () => {
  it('equal', () => expect(Rat.of(1, 2).gt(Rat.of(2, 4))).toBe(false))
  it('same denominator lt', () => expect(Rat.of(2, 3).gt(Rat.of(4, 3))).toBe(false))
  it('same denominator gt', () => expect(Rat.of(4, 3).gt(Rat.of(2, 3))).toBe(true))
  it('big values lt', () => expect(Rat.of(10, 2 ** 53 - 1).gt(Rat.of(23, 2 ** 53 - 1))).toBe(false))
  it('big values gt', () => expect(Rat.of(23, 2 ** 53 - 1).gt(Rat.of(10, 2 ** 53 - 1))).toBe(true))
  it('different denominators lt', () => expect(Rat.of(4, 9).gt(Rat.of(7, 6))).toBe(false))
  it('different denominators gt', () => expect(Rat.of(7, 6).gt(Rat.of(4, 9))).toBe(true))
})

describe('Fraction ge', () => {
  it('equal', () => expect(Rat.of(1, 2).ge(Rat.of(2, 4))).toBe(true))
  it('same denominator lt', () => expect(Rat.of(2, 3).ge(Rat.of(4, 3))).toBe(false))
  it('same denominator gt', () => expect(Rat.of(4, 3).ge(Rat.of(2, 3))).toBe(true))
  it('big values lt', () => expect(Rat.of(10, 2 ** 53 - 1).ge(Rat.of(23, 2 ** 53 - 1))).toBe(false))
  it('big values gt', () => expect(Rat.of(23, 2 ** 53 - 1).ge(Rat.of(10, 2 ** 53 - 1))).toBe(true))
  it('different denominators lt', () => expect(Rat.of(4, 9).ge(Rat.of(7, 6))).toBe(false))
  it('different denominators gt', () => expect(Rat.of(7, 6).ge(Rat.of(4, 9))).toBe(true))
})

describe('Fraction min', () => {
  it('lt', () => expect(Rat.of(1, 1).min(Rat.of(2, 1))).toEqual(Rat.of(1, 1)))
  it('eq', () => expect(Rat.of(2, 1).min(Rat.of(2, 1))).toEqual(Rat.of(2, 1)))
  it('gt', () => expect(Rat.of(3, 1).min(Rat.of(2, 1))).toEqual(Rat.of(2, 1)))
})

describe('Fraction max', () => {
  it('lt', () => expect(Rat.of(1, 1).max(Rat.of(2, 1))).toEqual(Rat.of(2, 1)))
  it('eq', () => expect(Rat.of(2, 1).max(Rat.of(2, 1))).toEqual(Rat.of(2, 1)))
  it('gt', () => expect(Rat.of(3, 1).max(Rat.of(2, 1))).toEqual(Rat.of(3, 1)))
})

describe('Fraction clamp', () => {
  it('lt lt', () => expect(Rat.of(0, 1).clamp(Rat.of(1, 1), Rat.of(3, 1))).toEqual(Rat.of(1, 1)))
  it('eq lt', () => expect(Rat.of(1, 1).clamp(Rat.of(1, 1), Rat.of(3, 1))).toEqual(Rat.of(1, 1)))
  it('gt lt', () => expect(Rat.of(2, 1).clamp(Rat.of(1, 1), Rat.of(3, 1))).toEqual(Rat.of(2, 1)))
  it('gt eq', () => expect(Rat.of(3, 1).clamp(Rat.of(1, 1), Rat.of(3, 1))).toEqual(Rat.of(3, 1)))
  it('gt gt', () => expect(Rat.of(4, 1).clamp(Rat.of(1, 1), Rat.of(3, 1))).toEqual(Rat.of(3, 1)))
})
