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

<style>
.project-tab {
  width: max-content;
  padding: 3px;
}
html[data-theme='light'] .project-tab {
  border: gray 1px solid;
  background-color: lightgray;
  color: #0008;

  &:hover {
    background-color: #c0c0c0;
    color: #000f;
  }

  &.active {
    background-color: #a0a0a0;
    color: #000f;
  }
}
html[data-theme='dark'] .project-tab {
  border: #6060c0 1px solid;
  background-color: #404080;
  color: #fff8;

  &:hover {
    background-color: #484890;
    color: #ffff;
  }

  &.active {
    background-color: #5858b0;
    color: #ffff;
  }
}
</style>
