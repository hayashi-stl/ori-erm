import { describe, expect, it } from 'vitest'
import { Polygon, Vec2 } from '@/math/geometry'
import { Rat } from '@/math/fraction'

describe('Vec2 clone', () => {
  it('clones', () => {
    const a = new Vec2(Rat.ZERO, Rat.ZERO)
    const b = a.clone()
    b.x = Rat.ONE
    expect(a).toEqual(Vec2.ZERO)
  })
})

// Implementations are simple, so just make sure the correct thing is being done

describe('Vec2 add', () => {
  it('assign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    const b = new Vec2(Rat.THREE, Rat.FOUR)
    a.addAssign(b)
    expect(a).toEqual(new Vec2(Rat.int(4), Rat.int(6)))
  })
  it('new', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).add(new Vec2(Rat.THREE, Rat.FOUR))).toEqual(
      new Vec2(Rat.int(4), Rat.int(6)),
    ))
})

describe('Vec2 sub', () => {
  it('assign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    const b = new Vec2(Rat.THREE, Rat.FOUR)
    a.subAssign(b)
    expect(a).toEqual(new Vec2(Rat.int(-2), Rat.int(-2)))
  })
  it('new', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).sub(new Vec2(Rat.THREE, Rat.FOUR))).toEqual(
      new Vec2(Rat.int(-2), Rat.int(-2)),
    ))
})

describe('Vec2 mul', () => {
  it('assign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    a.mulAssign(Rat.THREE)
    expect(a).toEqual(new Vec2(Rat.int(3), Rat.int(6)))
  })
  it('new', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).mul(Rat.THREE)).toEqual(new Vec2(Rat.int(3), Rat.int(6))))
})

describe('Vec2 div', () => {
  it('assign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    a.divAssign(Rat.THREE)
    expect(a).toEqual(new Vec2(Rat.of(1, 3), Rat.of(2, 3)))
  })
  it('new', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).div(Rat.THREE)).toEqual(new Vec2(Rat.of(1, 3), Rat.of(2, 3))))
})

describe('Vec2 dot', () => {
  it('works', () =>
    expect(new Vec2(Rat.int(2), Rat.int(30)).dot(new Vec2(Rat.int(5), Rat.int(70)))).toEqual(
      Rat.int(2110),
    ))
})

describe('Vec2 cross', () => {
  it('works', () =>
    expect(new Vec2(Rat.int(2), Rat.int(30)).cross(new Vec2(Rat.int(70), Rat.int(-5)))).toEqual(
      Rat.int(2110),
    ))
})

describe('Vec2 len²', () => {
  it('works', () => expect(new Vec2(Rat.int(2), Rat.int(30)).len2()).toEqual(Rat.int(904)))
})

describe('Vec2 reflect', () => {
  it('works', () =>
    expect(new Vec2(Rat.int(-1), Rat.ZERO).reflect(new Vec2(Rat.TWO, Rat.ONE))).toEqual(
      new Vec2(Rat.of(3, 5), Rat.of(4, 5)),
    ))
})

describe('Polygon duplicates', () => {
  it('no duplicates', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, Vec2.ONES])
    expect([...poly.duplicates()]).toEqual([])
    expect(poly.hasDuplicate()).toBe(false)
  })
  it("non-consecutive duplicates don't count", () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, Vec2.ZERO, Vec2.ONES])
    expect([...poly.duplicates()]).toEqual([])
  })
  it('duplicate at beginning', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.ZERO, Vec2.POS_X, Vec2.ONES])
    expect([...poly.duplicates()]).toEqual([0])
    expect(poly.hasDuplicate()).toBe(true)
  })
  it('duplicate at middle', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, Vec2.POS_X, Vec2.ONES])
    expect([...poly.duplicates()]).toEqual([1])
  })
  it('duplicate at end', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, Vec2.ONES, Vec2.ZERO])
    expect([...poly.duplicates()]).toEqual([3])
  })
  it('multiple duplicates', () => {
    const poly = new Polygon([
      Vec2.ZERO,
      Vec2.ZERO,
      Vec2.ZERO,
      Vec2.POS_X,
      Vec2.ONES,
      Vec2.ONES,
      Vec2.ZERO,
    ])
    expect([...poly.duplicates()]).toEqual([0, 1, 4, 6])
  })
})
