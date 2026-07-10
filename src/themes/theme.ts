import { Color } from 'pixi.js'

export type Theme = {
  uiTheme: string

  background: Color
  grid: Color
  abstractionFill: Color
  abstractionOutline: Color
}

export const TSAI: Theme = {
  uiTheme: 'light',

  background: new Color('white'),
  grid: new Color('#c0c0c0'),
  abstractionFill: new Color('#0096fe'),
  abstractionOutline: new Color('black'),
}

export const LAYERS: Theme = {
  uiTheme: 'dark',

  background: new Color('#003'),
  grid: new Color('#007'),
  abstractionFill: new Color('#08f'),
  abstractionOutline: new Color('white'),
}
