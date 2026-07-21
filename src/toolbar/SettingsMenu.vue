<script setup lang="ts">
// For now, some theme-changing settings go here. They should probably be moved to a modal dialog.
import ImageDropdown from '@/components/ImageDropdown.vue'
import { Config, Language, Theme, translate } from '@/config'
import { ref } from 'vue'

function setLanguage(language: Language) {
  Config.config.language = language
  document.documentElement.lang = translate((t) => t.code).value // abuse of this function
}

function setTheme(theme: Theme) {
  Config.config.theme = theme
}
</script>

<template>
  <ImageDropdown
    :name="translate((t) => t.toolbarSettings)"
    :items="[
      { text: ref('English'), click: (_) => setLanguage(Language.English) },
      { text: ref('日本語'), click: (_) => setLanguage(Language.Japanese) },
      { text: translate((t) => t.toolbarLightMode), click: (_) => setTheme(Theme.Tsai) },
      { text: translate((t) => t.toolbarDarkMode), click: (_) => setTheme(Theme.Layers) },
    ]"
  />
</template>
