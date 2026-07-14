import { describe, expect, it } from 'vitest'
import { Mtx2, Mtx2x3, Vec2, Vec3 } from '@/math/linear'
import { Rat } from '@/math/fraction'

// Implementations are simple, so just make sure the correct thing is being done

describe('Vec2', () => {
  it('clone', () => {
    const a = new Vec2(Rat.ZERO, Rat.ZERO)
    const b = a.clone()
    b.x = Rat.ONE
    expect(a).toEqual(Vec2.ZERO)
  })

  it('addAssign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    const b = new Vec2(Rat.THREE, Rat.FOUR)
    a.addAssign(b)
    expect(a).toEqual(new Vec2(Rat.int(4), Rat.int(6)))
  })
  it('add', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).add(new Vec2(Rat.THREE, Rat.FOUR))).toEqual(
      new Vec2(Rat.int(4), Rat.int(6)),
    ))

  it('subAssign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    const b = new Vec2(Rat.THREE, Rat.FOUR)
    a.subAssign(b)
    expect(a).toEqual(new Vec2(Rat.int(-2), Rat.int(-2)))
  })
  it('sub', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).sub(new Vec2(Rat.THREE, Rat.FOUR))).toEqual(
      new Vec2(Rat.int(-2), Rat.int(-2)),
    ))

  it('mulAssign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    a.mulAssign(Rat.THREE)
    expect(a).toEqual(new Vec2(Rat.int(3), Rat.int(6)))
  })
  it('mul', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).mul(Rat.THREE)).toEqual(new Vec2(Rat.int(3), Rat.int(6))))

  it('divAssign', () => {
    const a = new Vec2(Rat.ONE, Rat.TWO)
    a.divAssign(Rat.THREE)
    expect(a).toEqual(new Vec2(Rat.of(1, 3), Rat.of(2, 3)))
  })
  it('div', () =>
    expect(new Vec2(Rat.ONE, Rat.TWO).div(Rat.THREE)).toEqual(new Vec2(Rat.of(1, 3), Rat.of(2, 3))))

  it('dot', () =>
    expect(new Vec2(Rat.int(2), Rat.int(30)).dot(new Vec2(Rat.int(5), Rat.int(70)))).toEqual(
      Rat.int(2110),
    ))

  it('cross', () =>
    expect(new Vec2(Rat.int(2), Rat.int(30)).cross(new Vec2(Rat.int(70), Rat.int(-5)))).toEqual(
      Rat.int(-2110),
    ))

  it('len²', () => expect(new Vec2(Rat.int(2), Rat.int(30)).len2()).toEqual(Rat.int(904)))

  it('reflect', () =>
    expect(new Vec2(Rat.int(-1), Rat.ZERO).reflect(new Vec2(Rat.TWO, Rat.ONE))).toEqual(
      new Vec2(Rat.of(3, 5), Rat.of(4, 5)),
    ))
})

describe('Vec3', () => {
  it('clone', () => {
    const a = new Vec3(Rat.ZERO, Rat.ZERO, Rat.ZERO)
    const b = a.clone()
    b.x = Rat.ONE
    expect(a).toEqual(Vec3.ZERO)
  })

  it('addAssign', () => {
    const a = new Vec3(Rat.ONE, Rat.TWO, Rat.TWO)
    const b = new Vec3(Rat.THREE, Rat.FOUR, Rat.THREE)
    a.addAssign(b)
    expect(a).toEqual(new Vec3(Rat.int(4), Rat.int(6), Rat.int(5)))
  })
  it('add', () =>
    expect(
      new Vec3(Rat.ONE, Rat.TWO, Rat.TWO).add(new Vec3(Rat.THREE, Rat.FOUR, Rat.THREE)),
    ).toEqual(new Vec3(Rat.int(4), Rat.int(6), Rat.int(5))))

  it('subAssign', () => {
    const a = new Vec3(Rat.ONE, Rat.TWO, Rat.TWO)
    const b = new Vec3(Rat.THREE, Rat.FOUR, Rat.THREE)
    a.subAssign(b)
    expect(a).toEqual(new Vec3(Rat.int(-2), Rat.int(-2), Rat.int(-1)))
  })
  it('sub', () =>
    expect(
      new Vec3(Rat.ONE, Rat.TWO, Rat.TWO).sub(new Vec3(Rat.THREE, Rat.FOUR, Rat.THREE)),
    ).toEqual(new Vec3(Rat.int(-2), Rat.int(-2), Rat.int(-1))))

  it('mulAssign', () => {
    const a = new Vec3(Rat.ONE, Rat.TWO, Rat.THREE)
    a.mulAssign(Rat.THREE)
    expect(a).toEqual(new Vec3(Rat.int(3), Rat.int(6), Rat.int(9)))
  })
  it('mul', () =>
    expect(new Vec3(Rat.ONE, Rat.TWO, Rat.THREE).mul(Rat.THREE)).toEqual(
      new Vec3(Rat.int(3), Rat.int(6), Rat.int(9)),
    ))

  it('divAssign', () => {
    const a = new Vec3(Rat.ONE, Rat.TWO, Rat.THREE)
    a.divAssign(Rat.THREE)
    expect(a).toEqual(new Vec3(Rat.of(1, 3), Rat.of(2, 3), Rat.ONE))
  })
  it('div', () =>
    expect(new Vec3(Rat.ONE, Rat.TWO, Rat.THREE).div(Rat.THREE)).toEqual(
      new Vec3(Rat.of(1, 3), Rat.of(2, 3), Rat.ONE),
    ))

  it('dot', () =>
    expect(
      new Vec3(Rat.int(2), Rat.int(30), Rat.int(900)).dot(
        new Vec3(Rat.int(5), Rat.int(70), Rat.int(1100)),
      ),
    ).toEqual(Rat.int(992110)))

  it('cross', () =>
    expect(
      new Vec3(Rat.int(2), Rat.int(3), Rat.int(5)).cross(
        new Vec3(Rat.int(7), Rat.int(9), Rat.int(11)),
      ),
    ).toEqual(new Vec3(Rat.int(-12), Rat.int(13), Rat.int(-3))))

  it('len²', () =>
    expect(new Vec3(Rat.int(2), Rat.int(30), Rat.int(500)).len2()).toEqual(Rat.int(250904)))

  it('reflect', () =>
    expect(
      new Vec3(Rat.int(-1), Rat.ZERO, Rat.ZERO).reflect(new Vec3(Rat.ONE, Rat.TWO, Rat.THREE)),
    ).toEqual(new Vec3(Rat.of(-6, 7), Rat.of(2, 7), Rat.of(3, 7))))
})

describe('Mtx2', () => {
  it('clone', () => {
    const a = Mtx2.I
    const b = a.clone()
    b.c0.x = Rat.THREE
    expect(a).toEqual(Mtx2.I)
  })

  it('add', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const b = new Mtx2(new Vec2(Rat.int(1), Rat.int(2)), new Vec2(Rat.int(8), Rat.int(16)))
    const c = new Mtx2(new Vec2(Rat.int(4), Rat.int(7)), new Vec2(Rat.int(17), Rat.int(27)))
    expect(a.add(b)).toEqual(c)
    a.addAssign(b)
    expect(a).toEqual(c)
  })

  it('sub', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const b = new Mtx2(new Vec2(Rat.int(1), Rat.int(2)), new Vec2(Rat.int(8), Rat.int(16)))
    const c = new Mtx2(new Vec2(Rat.int(2), Rat.int(3)), new Vec2(Rat.int(1), Rat.int(-5)))
    expect(a.sub(b)).toEqual(c)
    a.subAssign(b)
    expect(a).toEqual(c)
  })

  it('mul', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const b = Rat.THREE
    const c = new Mtx2(new Vec2(Rat.int(9), Rat.int(15)), new Vec2(Rat.int(27), Rat.int(33)))
    expect(a.mul(b)).toEqual(c)
    a.mulAssign(b)
    expect(a).toEqual(c)
  })

  it('div', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const b = Rat.THREE
    const c = new Mtx2(new Vec2(Rat.int(1), Rat.of(5, 3)), new Vec2(Rat.int(3), Rat.of(11, 3)))
    expect(a.div(b)).toEqual(c)
    a.divAssign(b)
    expect(a).toEqual(c)
  })

  it('transpose', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const c = new Mtx2(new Vec2(Rat.int(3), Rat.int(9)), new Vec2(Rat.int(5), Rat.int(11)))
    expect(a.transpose()).toEqual(c)
    a.transposeAssign()
    expect(a).toEqual(c)
  })

  it('transform', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const b = new Vec2(Rat.int(2), Rat.int(300))
    const c = new Vec2(Rat.int(2706), Rat.int(3310))
    expect(a.transform(b)).toEqual(c)
  })

  it('matrix mul', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const b = new Mtx2(new Vec2(Rat.int(2), Rat.int(300)), new Vec2(Rat.int(5), Rat.int(700)))
    const c = new Mtx2(
      new Vec2(Rat.int(2706), Rat.int(3310)),
      new Vec2(Rat.int(6315), Rat.int(7725)),
    )
    expect(a.mtxMul(b)).toEqual(c)
  })

  it('det', () => {
    const a = new Mtx2(new Vec2(Rat.int(20), Rat.int(5)), new Vec2(Rat.int(-7), Rat.int(30)))
    expect(a.det()).toEqual(Rat.int(635))
  })

  it('inv', () => {
    const a = new Mtx2(new Vec2(Rat.int(3), Rat.int(5)), new Vec2(Rat.int(9), Rat.int(11)))
    const c = new Mtx2(
      new Vec2(Rat.of(-11, 12), Rat.of(5, 12)),
      new Vec2(Rat.of(3, 4), Rat.of(-1, 4)),
    )
    expect(a.inv()).toEqual(c)
    a.invAssign()
    expect(a).toEqual(c)
  })
})

describe('Mtx2x3', () => {
  it('clone', () => {
    const a = Mtx2x3.I
    const b = a.clone()
    b.c0.x = Rat.THREE
    expect(a).toEqual(Mtx2x3.I)
  })

  it('add', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const b = new Mtx2x3(
      new Vec2(Rat.int(1), Rat.int(2)),
      new Vec2(Rat.int(8), Rat.int(16)),
      new Vec2(Rat.int(64), Rat.int(128)),
    )
    const c = new Mtx2x3(
      new Vec2(Rat.int(4), Rat.int(7)),
      new Vec2(Rat.int(17), Rat.int(27)),
      new Vec2(Rat.int(79), Rat.int(145)),
    )
    expect(a.add(b)).toEqual(c)
    a.addAssign(b)
    expect(a).toEqual(c)
  })

  it('sub', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const b = new Mtx2x3(
      new Vec2(Rat.int(1), Rat.int(2)),
      new Vec2(Rat.int(8), Rat.int(16)),
      new Vec2(Rat.int(64), Rat.int(128)),
    )
    const c = new Mtx2x3(
      new Vec2(Rat.int(2), Rat.int(3)),
      new Vec2(Rat.int(1), Rat.int(-5)),
      new Vec2(Rat.int(-49), Rat.int(-111)),
    )
    expect(a.sub(b)).toEqual(c)
    a.subAssign(b)
    expect(a).toEqual(c)
  })

  it('mul', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const b = Rat.THREE
    const c = new Mtx2x3(
      new Vec2(Rat.int(9), Rat.int(15)),
      new Vec2(Rat.int(27), Rat.int(33)),
      new Vec2(Rat.int(45), Rat.int(51)),
    )
    expect(a.mul(b)).toEqual(c)
    a.mulAssign(b)
    expect(a).toEqual(c)
  })

  it('div', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const b = Rat.THREE
    const c = new Mtx2x3(
      new Vec2(Rat.int(1), Rat.of(5, 3)),
      new Vec2(Rat.int(3), Rat.of(11, 3)),
      new Vec2(Rat.int(5), Rat.of(17, 3)),
    )
    expect(a.div(b)).toEqual(c)
    a.divAssign(b)
    expect(a).toEqual(c)
  })

  it('transform', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const b = new Vec3(Rat.int(2), Rat.int(300), Rat.int(50000))
    const c = new Vec3(Rat.int(752706), Rat.int(853310), Rat.int(50000))
    expect(a.transform(b)).toEqual(c)
  })

  it('matrix mul', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const b = new Mtx2x3(
      new Vec2(Rat.int(2), Rat.int(300)),
      new Vec2(Rat.int(5), Rat.int(700)),
      new Vec2(Rat.int(11), Rat.int(1300)),
    )
    const c = new Mtx2x3(
      new Vec2(Rat.int(2706), Rat.int(3310)),
      new Vec2(Rat.int(6315), Rat.int(7725)),
      new Vec2(Rat.int(11748), Rat.int(14372)),
    )
    expect(a.mtxMul(b)).toEqual(c)
  })

  it('det', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(20), Rat.int(5)),
      new Vec2(Rat.int(-7), Rat.int(30)),
      new Vec2(Rat.FOUR, Rat.NEG_ONE),
    )
    expect(a.det()).toEqual(Rat.int(635))
  })

  it('inv', () => {
    const a = new Mtx2x3(
      new Vec2(Rat.int(3), Rat.int(5)),
      new Vec2(Rat.int(9), Rat.int(11)),
      new Vec2(Rat.int(15), Rat.int(17)),
    )
    const c = new Mtx2x3(
      new Vec2(Rat.of(-11, 12), Rat.of(5, 12)),
      new Vec2(Rat.of(3, 4), Rat.of(-1, 4)),
      new Vec2(Rat.int(1), Rat.int(-2)),
    )
    expect(a.inv()).toEqual(c)
    a.invAssign()
    expect(a).toEqual(c)
  })
})
