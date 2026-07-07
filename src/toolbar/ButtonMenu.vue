<script setup lang="ts">
import EditMenu from './EditMenu.vue'
import FileMenu from './FileMenu.vue'
import SettingsMenu from './SettingsMenu.vue'
</script>

<template>
  <div class="button-menu">
    <FileMenu />
    <EditMenu />
    <SettingsMenu />
  </div>
</template>

<style scoped>
.button-menu {
  display: flex;
  flex-direction: row;
  margin: 3px;
}
</style>
