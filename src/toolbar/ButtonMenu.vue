<script setup lang="ts">
import EditMenu from './EditMenu.vue'
import FileMenu from './FileMenu.vue'
</script>

<template>
  <div class="button-menu">
    <FileMenu />
    <EditMenu />
  </div>
</template>

<style scoped>
.button-menu {
  display: flex;
  flex-direction: row;
  margin: 3px;
  gap: 3px;
}
</style>
