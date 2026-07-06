import { computed, reactive } from 'vue'
import type { Translation } from './languages/translation'
import { ENGLISH } from './languages/en'
import { JAPANESE } from './languages/ja'
import * as theme from './themes/theme'

export enum Language {
  English,
  Japanese,
}

export const TRANSLATIONS: Map<Language, Translation> = new Map([
  [Language.English, ENGLISH],
  [Language.Japanese, JAPANESE],
])

export enum Theme {
  Tsai,
  Layers,
}

export const THEMES: Map<Theme, theme.Theme> = new Map([
  [Theme.Tsai, theme.TSAI],
  [Theme.Layers, theme.LAYERS],
])

export class Config {
  static config = reactive(new Config())

  language: Language = Language.English
  theme: Theme = Theme.Tsai
}

/** Get the translation for the given field. */
export function translate(field: (tr: Translation) => string) {
  return computed(() => field(TRANSLATIONS.get(Config.config.language)!))
}

/** Get the current theme. Not computed because
 * UI stuff is handled by CSS (not Vue) and graphics are handled by a renderer (not Vue)
 */
export function currTheme(): theme.Theme {
  return THEMES.get(Config.config.theme)!
}
