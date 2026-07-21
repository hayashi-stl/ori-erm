<script setup lang="ts">
import { translate } from '@/config'
import { addKeyHandler, M } from '@/keyboard'
import { AbstractionMode, Project } from '@/project/project'
import type { Ref } from 'vue'

const abstractionModes: { mode: AbstractionMode; name: Ref<string>; key: [M, string] }[] = [
  {
    mode: AbstractionMode.Select,
    name: translate((t) => t.toolSelect + ' (S)'),
    key: [M.None, 'KeyS'],
  },
  {
    mode: AbstractionMode.Rectangle,
    name: translate((t) => t.toolRectangle + ' (R)'),
    key: [M.None, 'KeyR'],
  },
]

for (const mode of abstractionModes) {
  addKeyHandler(...mode.key, () => {
    Project.abstractionMode = mode.mode
  })
}
</script>

<template>
  <div class="tool-menu">
    <input
      v-for="(mode, index) in abstractionModes"
      :key="index"
      type="button"
      class="image-button"
      :class="{ active: Project.abstractionMode === mode.mode }"
      :title="mode.name.value"
      :value="mode.name.value"
      @click="Project.abstractionMode = mode.mode"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/_defs.scss';

.tool-menu {
  width: 32px;
  flex-grow: 0;
  flex-shrink: 0;
}

@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] .tool-menu > input.active {
    background-color: map.get(defs.$button-active-color, $theme);
    border: map.get(defs.$button-active-border, $theme) 1px solid;
  }
}
</style>
