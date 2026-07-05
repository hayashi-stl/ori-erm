<script setup lang="ts">
import { ref } from 'vue'

const status = ref('')

function setStatus(newStatus: string) {
  status.value = newStatus
}
</script>

<template>
  <div class="status">{{ status }}</div>
</template>
