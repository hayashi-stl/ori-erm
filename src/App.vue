<script setup lang="ts">
import StatusBar from './StatusBar.vue'
import ToolbarMenu from './toolbar/ToolbarMenu.vue'
import ProjectView from './project/ProjectView.vue'
</script>

<template>
  <ToolbarMenu />
  <ProjectView />
  <StatusBar />
</template>

<style lang="scss">
@use 'sass:map';
@use '@/_defs.scss';

/* Set height and max-height to ensure that the app doesn't go out of bounds.
Also set overflow because of a weird ~5-pixel margin at the bottom */
html {
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  font-size: defs.$text-size;
}
@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] {
    color: map.get(defs.$text-color, $theme);
  }
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
  @include defs.fixed-width(32px);
  @include defs.fixed-height(32px);
}

.toolbar {
  display: flex;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
}
@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] .toolbar {
    background-color: map.get(defs.$bar-color, $theme);
  }
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
  @include defs.fixed-height(24px);
  padding: 3px;
}
@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] .status {
    background-color: map.get(defs.$bar-color, $theme);
  }
}
</style>
