<script setup lang="ts">
import { Project } from '@/project/project'
import { Application } from 'pixi.js'
import { onMounted, useTemplateRef, watch } from 'vue'
import { AbstractionView } from './abstraction-view'
import { Config, currTheme, THEMES } from '@/config'

const project = new Project()

const workspace = useTemplateRef('workspace')

onMounted(async () => {
  const graphics = new Application()
  await graphics.init({
    background: '#ffffff',
    resizeTo: workspace.value!,
  })

  workspace.value!.appendChild(graphics.canvas)

  const abstraction = new AbstractionView(project, graphics.stage)
  abstraction.resize(project.grid.transform(graphics.renderer))

  graphics.renderer.on('resize', (_width, _height, _resolution) => {
    abstraction.resize(project.grid.transform(graphics.renderer))
  })

  // Theme change. Putting it here because it needs access to the workspace graphics
  watch(
    () => Config.config.theme,
    (newValue, _oldValue) => {
      document.documentElement.dataset.theme = THEMES.get(newValue)!.uiTheme
      graphics.renderer.background.color = currTheme().background
      abstraction.redraw()
    },
  )
})
</script>

<template>
  <div id="workspace" ref="workspace"></div>
</template>
