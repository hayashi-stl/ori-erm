<script setup lang="ts">
import { Design } from '@/design/design'
import { Application } from 'pixi.js'
import { onMounted, useTemplateRef, watch } from 'vue'
import { Config, currTheme, THEMES } from '@/config'
import { Project } from './project'
import { Grid } from '@/design/grid'
import { Icon } from './icon'

const workspace = useTemplateRef('workspace')

onMounted(async () => {
  const graphics = new Application()
  await graphics.init({
    background: '#ffffff',
    resizeTo: workspace.value!,
  })

  workspace.value!.appendChild(graphics.canvas)

  Icon.renderAll(currTheme())

  Project.insertProject(
    0,
    new Project(Design.from({ grid: new Grid(16, 16) }), graphics.renderer, graphics.stage),
  )
  Project.insertProject(
    1,
    new Project(Design.from({ grid: new Grid(24, 20) }), graphics.renderer, graphics.stage),
  )
  Project.activeProjectIndex = 0
  Project.newProject = () => new Project(Design.from(), graphics.renderer, graphics.stage)

  graphics.renderer.on('resize', (_width, _height, _resolution) => {
    Project.activeProject?.render()
  })

  // Theme change. Putting it here because it needs access to the project graphics
  watch(
    () => Config.config.theme,
    (newValue, _oldValue) => {
      document.documentElement.dataset.theme = THEMES.get(newValue)!.uiTheme
      graphics.renderer.background.color = currTheme().background
      Icon.renderAll(currTheme())
      Project.activeProject?.render()
    },
  )
})

function killContextMenu(ev: PointerEvent) {
  ev.preventDefault()
}
</script>

<template>
  <div id="workspace" ref="workspace" @contextmenu="killContextMenu"></div>
</template>
