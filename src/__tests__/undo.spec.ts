import { Design, Face, FaceAdded, FaceRemoved, UndoStack, type Action } from '@/design/design'
import { Grid } from '@/design/grid'
import { Rat, type Int } from '@/math/fraction'
import { Polygon } from '@/math/geometry'
import { Mtx2x3, Vec2 } from '@/math/linear'
import { describe, expect, it } from 'vitest'
import { shallowRef, type ShallowRef } from 'vue'

function setup(): { design: Design; undo: UndoStack; expectedUpdate: ShallowRef<Action> } {
  const design = Design.from({ grid: new Grid(16, 16) })
  const expectedUpdate = shallowRef(new FaceAdded(-1))
  const undo = new UndoStack((action) => expect(action).toEqual(expectedUpdate.value))
  return { design: design, expectedUpdate: expectedUpdate, undo: undo }
}

function polygon(id: Int): Polygon {
  return new Polygon([
    new Vec2(Rat.ZERO, Rat.ZERO),
    new Vec2(Rat.int(id), Rat.ZERO),
    new Vec2(Rat.ZERO, Rat.ONE),
  ])
}

describe('Undo stack', () => {
  it('adds to the stack', () => {
    const { design, undo, expectedUpdate } = setup()
    const action = design.abstraction.addFace(Face.unconnected(polygon(0), false, Mtx2x3.I))
    expectedUpdate.value = action
    undo.push(action)
    expect(undo.undoStack).toEqual([action])
    expect(undo.redoStack).toEqual([])
  })

  it('undoes', () => {
    const { design, undo, expectedUpdate } = setup()
    const act0 = design.abstraction.addFace(Face.unconnected(polygon(0), false, Mtx2x3.I))
    expectedUpdate.value = act0
    undo.push(act0)
    const act1 = design.abstraction.addFace(Face.unconnected(polygon(1), false, Mtx2x3.I))
    expectedUpdate.value = act1
    undo.push(act1)
    expectedUpdate.value = new FaceRemoved(act1.faceID, design.abstraction.faces.get(act1.faceID)!)
    undo.undo(design)
    expect([...design.abstraction.faces.keys()]).toEqual([act0.faceID])
    expect(undo.undoStack).toEqual([act0])
    expect(undo.redoStack).toEqual([expectedUpdate.value])
  })

  it('redoes', () => {
    const { design, undo, expectedUpdate } = setup()
    const act0 = design.abstraction.addFace(Face.unconnected(polygon(0), false, Mtx2x3.I))
    expectedUpdate.value = act0
    undo.push(act0)
    const act1 = design.abstraction.addFace(Face.unconnected(polygon(1), false, Mtx2x3.I))
    expectedUpdate.value = act1
    undo.push(act1)
    expectedUpdate.value = new FaceRemoved(act1.faceID, design.abstraction.faces.get(act1.faceID)!)
    undo.undo(design)
    expectedUpdate.value = act1
    undo.redo(design)
    expect([...design.abstraction.faces.keys()].sort()).toEqual([act0.faceID, act1.faceID].sort())
    expect(undo.undoStack).toEqual([act0, act1])
    expect(undo.redoStack).toEqual([])
  })
})
