<script setup lang="ts">
import ImageDropdown from '@/components/ImageDropdown.vue'
import { translate } from '@/config'
import { Project } from '@/project/project'

function newProject() {
  if (Project.newProject === undefined) return
  const project = Project.newProject()
  Project.insertProject(Project.activeProjectIndex + 1, project)
  Project.activeProjectIndex += 1
}

function closeProject() {
  // TODO: Do you want to save? dialog
  Project.removeProject(Project.activeProjectIndex)
}
</script>

<template>
  <ImageDropdown
    :name="translate((t) => t.toolbarFile)"
    :items="[
      { text: translate((t) => t.toolbarNewProject), click: newProject },
      { text: translate((t) => t.toolbarCloseProject), click: closeProject },
    ]"
  />
</template>
