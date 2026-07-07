import { Design } from '@/design/design'
import { AbstractionView } from './abstraction-view'
import { ref, shallowReactive, type Ref, type ShallowReactive } from 'vue'
import { translate } from '@/config'
import { Container, type Renderer } from 'pixi.js'

/** A project contains a design and stuff needed to manage it. */
export class Project {
  name: Ref<string>
  private design: Design
  private renderer: Renderer
  private parent: Container
  private container: Container
  private abstractionView: AbstractionView

  constructor(design: Design, renderer: Renderer, parent: Container) {
    this.name = ref(translate((t) => t.untitled).value)
    this.design = design
    this.renderer = renderer
    this.parent = parent
    this.container = new Container()
    this.abstractionView = new AbstractionView(design, renderer, this.container)
  }

  /** Make a new empty project. Initialized to `undefined` because
   * we need access to the graphics first
   */
  static newProject: (() => Project) | undefined = undefined

  show() {
    this.parent.addChild(this.container)
    this.abstractionView.show()
    this.render()
  }

  hide() {
    this.container.removeFromParent()
  }

  /** Performs a full render. */
  render() {
    this.abstractionView.render()
  }

  /** All open projects. */
  private static projects_: ShallowReactive<Project[]> = shallowReactive([])
  /** -1 indicates no active project */
  private static activeProjectIndex_ = ref(-1)

  static get projects() {
    return this.projects_
  }

  static get activeProjectIndexRef() {
    return this.activeProjectIndex_
  }

  static get activeProjectIndex() {
    return this.activeProjectIndex_.value
  }

  static get activeProject() {
    return this.projects[this.activeProjectIndex]
  }

  /** Set the active project index and update the interface. */
  static set activeProjectIndex(index: number) {
    this.activeProject?.hide()
    this.activeProjectIndex_.value = index
    this.activeProject?.show()
  }

  /** Inserts a project at the specified index. Doesn't make it active */
  static insertProject(index: number, project: Project) {
    this.projects_.splice(index, Infinity, ...[project, ...this.projects.slice(index)])
    if (this.activeProjectIndex >= index) this.activeProjectIndex_.value += 1
  }

  /** Removes a project at the specified index.
   * If the active project is removed, the next one becomes active.
   * If there is no next project, the previous one becomes active.
   * If there is no previous project, then oh well, no active project.
   */
  static removeProject(index: number) {
    if (index === -1) return
    if (index === this.activeProjectIndex)
      this.activeProjectIndex += index === this.projects.length - 1 ? -1 : 1
    if (index < this.activeProjectIndex) this.activeProjectIndex_.value -= 1
    this.projects_.splice(index, Infinity, ...this.projects.slice(index + 1))
  }

  /** Remove all projects. */
  static clearProjects() {
    this.activeProjectIndex = -1
    this.projects_.splice(0)
  }
}
