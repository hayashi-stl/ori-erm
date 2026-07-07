<script setup lang="ts">
import { Project } from '@/project/project.ts'
import ProjectTab from './ProjectTab.vue'
import { computed } from 'vue'

const indexedProjects = computed(() =>
  Project.projects.map((p, index) => ({
    index: index,
    project: p,
    active: index === Project.activeProjectIndexRef.value,
  })),
)
</script>

<template>
  <div class="project-tabs">
    <ProjectTab
      v-for="p in indexedProjects"
      v-bind:key="p.index"
      :index="p.index"
      :project="p.project"
      :active="p.active"
    ></ProjectTab>
  </div>
</template>

<style>
.project-tabs {
  display: flex;
  flex-direction: row;
}
</style>
