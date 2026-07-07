import { Project } from '@/project/project'
import { describe, expect, it } from 'vitest'
import { Substitute } from '@fluffy-spoon/substitute'
import { ref, type Ref } from 'vue'

function fakeProject(): [Project, Ref<boolean>] {
  const fakeProject = Substitute.for<Project>()
  const shown = ref(false)
  fakeProject.show().mimicks(() => (shown.value = true))
  fakeProject.hide().mimicks(() => (shown.value = false))
  return [fakeProject, shown]
}
//const FakeProject = vi.fn(
//  class {
//    name: Ref<string> = ref('')
//    private design: Design = Design.from()
//    private renderer: Renderer = new CanvasRenderer()
//    private parent: Container = new Container()
//    private container: Container = new Container()
//    private abstractionView: AbstractionView = new AbstractionView()
//    constructor(_design: Design, _renderer: Renderer, _parent: Container) {}
//  },
//)

/** Compares two arrays for equality: the arrays must have the same length,
 * and the elements must match according to `===`.
 */
function arrayEq<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((ai, i) => ai == b[i])
}

describe('Project List', () => {
  it('adds a project', () => {
    const [f, _] = fakeProject()
    Project.insertProject(0, f)
    expect(Project.projects).toSatisfy((v) => arrayEq(v, [f]))
    Project.clearProjects()
  })

  it('adds multiple projects', () => {
    const [f, _1] = fakeProject()
    const [g, _2] = fakeProject()
    const [h, _3] = fakeProject()
    Project.insertProject(0, f)
    Project.insertProject(1, g)
    Project.insertProject(1, h)
    expect(Project.projects).toSatisfy((v) => arrayEq(v, [f, h, g]))
    Project.clearProjects()
  })

  it('shows the active project', () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    Project.insertProject(0, f)
    Project.insertProject(1, g)
    Project.activeProjectIndex = 0
    expect(fShown.value).toBe(true)
    expect(gShown.value).toBe(false)
    Project.clearProjects()
  })

  it('updates the active index on addition', () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    Project.insertProject(0, f)
    Project.activeProjectIndex = 0
    Project.insertProject(0, g)
    expect(Project.activeProjectIndex).toBe(1)
    expect(fShown.value).toBe(true)
    expect(gShown.value).toBe(false)
    Project.clearProjects()
  })

  it("doesn't change the active index on addition", () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    Project.insertProject(0, f)
    Project.activeProjectIndex = 0
    Project.insertProject(1, g)
    expect(Project.activeProjectIndex).toBe(0)
    expect(fShown.value).toBe(true)
    expect(gShown.value).toBe(false)
    Project.clearProjects()
  })

  it('updates the active index on deletion', () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    Project.insertProject(0, f)
    Project.insertProject(1, g)
    Project.activeProjectIndex = 1
    Project.removeProject(0)
    expect(Project.projects).toSatisfy((v) => arrayEq(v, [g]))
    expect(Project.activeProjectIndex).toBe(0)
    expect(fShown.value).toBe(false)
    expect(gShown.value).toBe(true)
    Project.clearProjects()
  })

  it("doesn't change the active index on deletion", () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    Project.insertProject(0, f)
    Project.insertProject(1, g)
    Project.activeProjectIndex = 0
    Project.removeProject(1)
    expect(Project.projects).toSatisfy((v) => arrayEq(v, [f]))
    expect(Project.activeProjectIndex).toBe(0)
    expect(fShown.value).toBe(true)
    expect(gShown.value).toBe(false)
    Project.clearProjects()
  })

  it('moves to the next project on deletion', () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    const [h, hShown] = fakeProject()
    Project.insertProject(0, f)
    Project.insertProject(1, g)
    Project.insertProject(2, h)
    Project.activeProjectIndex = 1
    Project.removeProject(1)
    expect(Project.activeProjectIndex).toBe(1)
    expect(fShown.value).toBe(false)
    expect(gShown.value).toBe(false)
    expect(hShown.value).toBe(true)
    Project.clearProjects()
  })

  it('moves to the previous project on deletion', () => {
    const [f, fShown] = fakeProject()
    const [g, gShown] = fakeProject()
    Project.insertProject(0, f)
    Project.insertProject(1, g)
    Project.activeProjectIndex = 1
    Project.removeProject(1)
    expect(Project.activeProjectIndex).toBe(0)
    expect(fShown.value).toBe(true)
    expect(gShown.value).toBe(false)
    Project.clearProjects()
  })

  it('resets the active project index on deletion', () => {
    const [f, fShown] = fakeProject()
    Project.insertProject(0, f)
    Project.activeProjectIndex = 0
    Project.removeProject(0)
    expect(Project.activeProjectIndex).toBe(-1)
    expect(fShown.value).toBe(false)
    Project.clearProjects()
  })
})
