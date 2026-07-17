<script setup lang="ts">
import ImageDropdown from '@/components/ImageDropdown.vue'
import { translate } from '@/config'
import { Project } from '@/project/project'

function undo() {
  Project.activeProject?.undo()
}

function redo() {
  Project.activeProject?.redo()
}
</script>

<template>
  <ImageDropdown
    :name="translate((t) => t.toolbarEdit)"
    :items="[
      { text: translate((t) => t.toolbarUndo), click: undo },
      { text: translate((t) => t.toolbarRedo), click: redo },
    ]"
  />
</template>
