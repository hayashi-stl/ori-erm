<script setup lang="ts">
import ImageDropdown from '@/components/ImageDropdown.vue'
import { translate } from '@/config'
import { setStatus } from '@/StatusBar.vue'

function undo() {
  setStatus('Action undone.')
}

function redo() {
  setStatus('Action redone.')
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
