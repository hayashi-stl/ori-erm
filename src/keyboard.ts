import { Project } from './project/project'

export enum M {
  None = 0,
  Ctrl = 1,
  Shift = 2,
  Alt = 4,
}

function k(modifiers: M, keyCode: string): string {
  return `${modifiers},${keyCode}`
}

// Items can be added to this list.
const keyHandlers: Map<string, () => void> = new Map([
  [
    k(M.Ctrl, 'KeyZ'),
    () => {
      Project.activeProject?.undo()
    },
  ],
  [
    k(M.Ctrl | M.Shift, 'KeyZ'),
    () => {
      Project.activeProject?.redo()
    },
  ],
  [
    k(M.Ctrl, 'KeyY'),
    () => {
      Project.activeProject?.redo()
    },
  ],
])

export function addKeyHandler(modifiers: M, keyCode: string, handler: () => void) {
  keyHandlers.set(k(modifiers, keyCode), handler)
}

export function handleKeyDown(ev: KeyboardEvent) {
  let modifiers = M.None
  if (ev.ctrlKey) modifiers |= M.Ctrl
  if (ev.shiftKey) modifiers |= M.Shift
  if (ev.altKey) modifiers |= M.Alt
  const handler = keyHandlers.get(k(modifiers, ev.code))
  if (handler !== undefined) handler()
}
