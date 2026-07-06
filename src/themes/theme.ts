import { Color } from 'pixi.js'

export type Theme = {
  uiTheme: string

  background: Color
  grid: Color
}

export const TSAI: Theme = {
  uiTheme: 'light',

  background: new Color('white'),
  grid: new Color('#c0c0c0'),
}

export const LAYERS: Theme = {
  uiTheme: 'dark',

  background: new Color('#003'),
  grid: new Color('#006'),
}
