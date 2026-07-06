<script setup lang="ts">
import { ref, type Ref } from 'vue'

const status = ref('')
theStatus = status
</script>

<script lang="ts">
let theStatus: Ref<string, string> | undefined = undefined

/** Sets the status in the one status bar */
export function setStatus(newStatus: string) {
  if (theStatus !== undefined) theStatus.value = newStatus
}
</script>

<template>
  <div class="status">{{ status }}</div>
</template>
