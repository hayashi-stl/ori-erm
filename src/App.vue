<script setup lang="ts">
import StatusBar from './StatusBar.vue'
import ToolbarMenu from './toolbar/ToolbarMenu.vue'
import WorkspaceView from './workspace/WorkspaceView.vue'
</script>

<template>
  <ToolbarMenu />
  <WorkspaceView />
  <StatusBar />
</template>

<style>
/* Set height and max-height to ensure that the app doesn't go out of bounds.
Also set overflow because of a weird ~5-pixel margin at the bottom */
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
  font-family: sans-serif;
}

.image-button {
  width: 32px;
  min-width: 32px;
  max-width: 32px;
  height: 32px;
  min-height: 32px;
  max-height: 32px;
}
</style>

<style scoped>
.toolbar {
  display: flex;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: lightgray;
}

#workspace {
  width: 100%;
  max-height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
}

.status {
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  min-height: 24px;
  max-height: 24px;
  padding: 3px;
  background-color: lightgray;
}
</style>
