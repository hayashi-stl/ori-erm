<script setup lang="ts">
import StatusBar from './StatusBar.vue'
import ToolbarMenu from './toolbar/ToolbarMenu.vue'
import ProjectView from './project/ProjectView.vue'
import ProjectSidebar from './toolbar/ProjectSidebar.vue'
import { onMounted } from 'vue'
import { handleKeyDown } from './keyboard.ts'

document.addEventListener('keydown', (ev) => {
  handleKeyDown(ev)
})

onMounted(() => {
  // Prevent text input from sending key events
  for (const textInput of document.getElementsByTagName('input'))
    if (textInput.type === 'text')
      textInput.addEventListener('keydown', (ev) => ev.stopPropagation())
})
</script>

<template>
  <ToolbarMenu />
  <div class="middle">
    <ProjectView />
    <ProjectSidebar />
  </div>
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

.middle {
  width: 100%;
  max-height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
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

@each $theme in defs.$themes {
  // Using :where for low specificity (this is supposed to be general)
  :where(html[data-theme='#{$theme}'] input[type='button']) {
    background-color: map.get(defs.$button-color, $theme);
    border: map.get(defs.$button-border, $theme) 1px solid;
    color: map.get(defs.$text-color, $theme);
    &:hover {
      background-color: map.get(defs.$button-hover-color, $theme);
      border: map.get(defs.$button-hover-border, $theme) 1px solid;
    }
    &:active {
      background-color: map.get(defs.$button-active-color, $theme);
      border: map.get(defs.$button-active-border, $theme) 1px solid;
    }
  }
}

@each $theme in defs.$themes {
  // Using :where for low specificity (this is supposed to be general)
  :where(html[data-theme='#{$theme}'] input[type='text']) {
    background-color: map.get(defs.$text-input-color, $theme);
    border: map.get(defs.$text-input-border, $theme) 1px solid;
    color: map.get(defs.$text-color, $theme);
  }
}
</style>
