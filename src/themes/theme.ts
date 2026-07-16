import { Color } from 'pixi.js'

export type Theme = {
  uiTheme: string

  background: Color
  grid: Color
  cursor: Color
  abstractionFill: Color
  abstractionOutline: Color
}

export const TSAI: Theme = {
  uiTheme: 'light',

  background: new Color('white'),
  grid: new Color('#c0c0c0'),
  cursor: new Color('black'),
  abstractionFill: new Color('#0096fe'),
  abstractionOutline: new Color('black'),
}

export const LAYERS: Theme = {
  uiTheme: 'dark',

  background: new Color('#003'),
  grid: new Color('#007'),
  cursor: new Color('#0aa'),
  abstractionFill: new Color('#08f'),
  abstractionOutline: new Color('white'),
}
