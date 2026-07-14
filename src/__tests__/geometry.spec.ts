import { describe, expect, it } from 'vitest'
import { Vec2 } from '@/math/linear'
import { Polygon } from '@/math/geometry'
import { Rat } from '@/math/fraction'

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

describe('Polygon convex', () => {
  it('left-turning strictly convex', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, Vec2.ONES])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(true)
      poly.rotatePoints(1)
    }
  })
  it('right-turning strictly convex', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.NEG_X, Vec2.POS_Y])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(true)
      poly.rotatePoints(1)
    }
  })
  it('weakly convex', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, new Vec2(Rat.TWO, Rat.ZERO), Vec2.ONES])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(true)
      poly.rotatePoints(1)
    }
  })
  it('concave', () => {
    const poly = new Polygon([
      Vec2.ZERO,
      new Vec2(Rat.THREE, Rat.ZERO),
      Vec2.ONES,
      new Vec2(Rat.ZERO, Rat.THREE),
    ])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(false)
      poly.rotatePoints(1)
    }
  })
  it('goes back and forth and turns', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_X, Vec2.ZERO, Vec2.POS_X, Vec2.ONES])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(false)
      poly.rotatePoints(1)
    }
  })
  it('goes back and forth', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_Y])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(true)
      poly.rotatePoints(1)
    }
  })
  it('goes back and forth and pauses', () => {
    const poly = new Polygon([Vec2.ZERO, new Vec2(Rat.ZERO, Rat.TWO), Vec2.POS_Y])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(true)
      poly.rotatePoints(1)
    }
  })
  it('goes back and forth too many times', () => {
    const poly = new Polygon([Vec2.ZERO, Vec2.POS_Y, Vec2.ZERO, Vec2.POS_Y])
    for (let i = 0; i < poly.length; ++i) {
      expect(poly.isConvex()).toBe(false)
      poly.rotatePoints(1)
    }
  })
})
