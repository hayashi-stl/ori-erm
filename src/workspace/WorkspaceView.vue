<script setup lang="ts">
import { Project } from '@/project/project'
import { Application } from 'pixi.js'
import { onMounted, useTemplateRef } from 'vue'
import { AbstractionView } from './abstraction-view'

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
})
</script>

<template>
  <div id="workspace" ref="workspace"></div>
</template>
