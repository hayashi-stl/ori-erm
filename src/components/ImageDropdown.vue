<script setup lang="ts">
import type { Ref } from 'vue'
import DropdownMenu from './DropdownMenu.vue'

defineProps<{
  name: Ref<string>
  items: { text: Ref<string>; click: (ev: MouseEvent) => void }[]
}>()
</script>

<template>
  <DropdownMenu :items="items">
    <input type="button" class="image-button" :value="name.value" />
  </DropdownMenu>
</template>
