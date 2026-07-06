<script setup lang="ts">
import ImageDropdown from '@/components/ImageDropdown.vue'
import { translate } from '@/config'
import { setStatus } from '@/StatusBar.vue'

function newProject() {
  setStatus('Project newed.')
}

function closeProject() {
  setStatus('Project closed.')
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
