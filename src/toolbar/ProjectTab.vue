<script setup lang="ts">
import { Project } from '@/project/project'

const props = defineProps<{ index: number; project: Project; active: boolean }>()

function setActiveIndex() {
  Project.activeProjectIndex = props.index
}
</script>

<template>
  <input
    type="button"
    class="project-tab"
    :class="{ active: active }"
    :value="project.name.value"
    @click="setActiveIndex"
  />
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use 'sass:color';
@use '@/_defs.scss';

.project-tab {
  width: max-content;
  padding: 3px;
}
@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] .project-tab {
    border: map.get(defs.$border-color, $theme) 1px solid;
    background-color: map.get(defs.$bar-color, $theme);
    color: color.change(map.get(defs.$text-color, $theme), $alpha: 0.5);

    &:hover {
      background-color: map.get(defs.$hover-color, $theme);
      color: map.get(defs.$text-color, $theme);
    }

    &.active {
      background-color: map.get(defs.$active-color, $theme);
      color: map.get(defs.$text-color, $theme);
    }
  }
}
</style>
