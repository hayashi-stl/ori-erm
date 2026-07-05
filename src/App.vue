<script setup lang="ts">
import ToolbarMenu from './ToolbarMenu.vue'
import WorkspaceView from './workspace/WorkspaceView.vue'
</script>

<template>
  <ToolbarMenu />
  <WorkspaceView />
</template>

<style>
html {
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
}

body {
  margin: 0;
  display: flex;
  height: 100%;
  max-height: 100vh;
  flex-direction: column;
}

#app {
  display: flex;
  flex-grow: 1;
  max-height: 100vh;
  flex-direction: column;
}
</style>

<style scoped>
.toolbar {
  display: flex;
  width: 100%;
  height: 32px;
  min-height: 32px;
  background-color: lightgray;
}

#workspace {
  width: 100%;
  max-height: 100%;
  flex-grow: 1;
  min-height: 0;
}
</style>
