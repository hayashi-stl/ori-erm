import { BatchAction, Design, UndoStack, type Action } from '@/design/design'
import { AbstractionView } from './abstraction-view'
import { ref, shallowReactive, type Ref, type ShallowReactive } from 'vue'
import { translate } from '@/config'
import { Container, type Renderer } from 'pixi.js'

/** The abstraction editing modes of a project */
export enum AbstractionMode {
  Select,
  Rectangle,
}

/** A project contains a design and stuff needed to manage it. */
export class Project {
  name: Ref<string>
  design: Design
  undoStack: UndoStack
  renderer: Renderer
  parent: Container
  container: Container
  abstractionView: AbstractionView
  zoomRef: Ref<number> = ref(1)
  /* prettier-ignore */ get zoom() { return this.zoomRef.value }
  set zoom(v) {
    this.zoomRef.value = v
    this.render()
  }

  constructor(design: Design, renderer: Renderer, parent: Container) {
    this.name = ref(translate((t) => t.untitled).value)
    this.design = design
    this.renderer = renderer
    this.parent = parent
    this.undoStack = new UndoStack(this.update.bind(this))
    this.container = new Container()
    this.abstractionView = new AbstractionView(this)
  }

  /** Make a new empty project. Initialized to `undefined` because
   * we need access to the graphics first
   */
  static newProject: (() => Project) | undefined = undefined

  show() {
    this.parent.addChild(this.container)
    this.abstractionView.setMode(Project.abstractionMode)
    this.abstractionView.show()
    this.render()
  }

  hide() {
    this.container.removeFromParent()
  }

  /** Pushes an action to the project's undo stack */
  pushAction(action: Action) {
    this.undoStack.push(action)
  }

  undo() {
    this.undoStack.undo(this.design)
  }

  redo() {
    this.undoStack.redo(this.design)
  }

  /** Updates the state of the project (except the design)
   * with an action that just got performed on the design
   */
  update(action: Action) {
    if (action instanceof BatchAction) {
      for (const a of action.actions) this.update(a)
    } else {
      this.abstractionView.update(action)
    }
  }

  /** Performs a full render. */
  render() {
    this.abstractionView.render()
  }

  static abstractionModeRef = ref(AbstractionMode.Rectangle)
  /* prettier-ignore */ static get abstractionMode() { return this.abstractionModeRef.value }
  static set abstractionMode(v) {
    this.abstractionModeRef.value = v
    Project.activeProject?.abstractionView.setMode(this.abstractionMode)
  }

  /** All open projects. */
  private static projects_: ShallowReactive<Project[]> = shallowReactive([])
  /** -1 indicates no active project */
  private static activeProjectIndex_ = ref(-1)

  /* prettier-ignore */ static get projects() { return this.projects_ }
  /* prettier-ignore */ static get activeProjectIndexRef() { return this.activeProjectIndex_ }
  /* prettier-ignore */ static get activeProjectIndex() { return this.activeProjectIndex_.value }
  /* prettier-ignore */ static get activeProject() { return this.projects[this.activeProjectIndex] }

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
