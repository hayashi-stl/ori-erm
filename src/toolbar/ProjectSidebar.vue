<script setup lang="ts">
import NumberInput from '@/components/NumberInput.vue'
import { translate } from '@/config'
import { Grid } from '@/design/grid'
import { M } from '@/keyboard'
import type { Int } from '@/math/fraction'
import { Project } from '@/project/project'
import { computed, useTemplateRef } from 'vue'
import ToolMenu from './ToolMenu.vue'

const width = computed(() => {
  return Project.activeProject?.design.gridRef.value.width || 16 // note: the left side can't be 0
})
const height = computed(() => {
  return Project.activeProject?.design.gridRef.value.height || 16 // note: the left side can't be 0
})
const zoom = computed(() => {
  return Project.activeProject?.zoomRef.value || 1 // note: the left side can't be 0
})

const faceNameBox = useTemplateRef('faceNameBox')

// The selected face, if there's exactly one
const selectedFace = computed(() => {
  const selection = Project.activeProject?.abstractionView.facesSelected
  if (selection === undefined || selection.size !== 1) return undefined
  return selection.values().next().value!
})

const faceName = computed(() => {
  const faceID = selectedFace.value
  if (faceID === undefined) return undefined
  return Project.activeProject!.design.abstraction.faces.get(faceID)!.name
})

function onWidthChange(n: Int) {
  const project = Project.activeProject
  if (project === undefined) return
  const action = project.design.setGrid(new Grid(n, project.design.grid.height))
  project.pushAction(action)
}

function onHeightChange(n: Int) {
  const project = Project.activeProject
  if (project === undefined) return
  const action = project.design.setGrid(new Grid(project.design.grid.width, n))
  project.pushAction(action)
}

function onZoomChange(n: number) {
  const project = Project.activeProject
  if (project === undefined) return
  project.zoom = n
}

/** Returns the step for the zoom control. This should grow like an exponential function
 * with respect to the zoom, while not giving weird non-representable numbers like √2
 */
function zoomStep(zoom: number, increase: boolean): number {
  const log = Math.floor(Math.log2(zoom))
  let step = Math.pow(2, log - 2)
  if (!increase && Math.floor(Math.log2(zoom - step)) < log) step /= 2
  return step
}

function changeFaceName() {
  const name = faceNameBox.value?.value
  const faceID = selectedFace.value
  if (faceID === undefined || name === undefined) return
  const project = Project.activeProject! // since the faceID exists, this must exist
  const action = project.design.abstraction.changeFace(faceID, (f) => (f.name = name))
  project.pushAction(action)
}
</script>

<template>
  <div class="super-sidebar">
    <ToolMenu />
    <div class="sidebar">
      <div>
        <b>{{ translate((tr) => tr.sidebarGrid) }}</b>
      </div>
      <div class="grid-settings">
        <div class="label">{{ translate((tr) => tr.gridWidth) }}</div>
        <NumberInput
          :min="1"
          :max="9999"
          :integer="true"
          :value="width"
          :decrease-tooltip="translate((t) => t.gridDecreaseWidth + ' (Shift+A)').value"
          :increase-tooltip="translate((t) => t.gridIncreaseWidth + ' (Shift+D)').value"
          :decrease-key="[M.Shift, 'KeyA']"
          :increase-key="[M.Shift, 'KeyD']"
          @change="onWidthChange"
        />
        <div class="label">{{ translate((tr) => tr.gridHeight) }}</div>
        <NumberInput
          :min="1"
          :max="9999"
          :integer="true"
          :value="height"
          :decrease-tooltip="translate((t) => t.gridDecreaseHeight + ' (Shift+S)').value"
          :increase-tooltip="translate((t) => t.gridIncreaseHeight + ' (Shift+W)').value"
          :decrease-key="[M.Shift, 'KeyS']"
          :increase-key="[M.Shift, 'KeyW']"
          @change="onHeightChange"
        />
        <div class="label">{{ translate((tr) => tr.gridZoom) }}</div>
        <NumberInput
          :min="1"
          :max="64"
          :step="zoomStep"
          :precision="2"
          :integer="false"
          :value="zoom"
          :decrease-tooltip="translate((t) => t.gridZoomOut + ' (Ctrl+-)').value"
          :increase-tooltip="translate((t) => t.gridZoomIn + ' (Ctrl+=)').value"
          :decrease-key="[M.Ctrl, 'Equal']"
          :increase-key="[M.Ctrl, 'Minus']"
          @change="onZoomChange"
        />
      </div>
      <div v-if="selectedFace !== undefined" class="space"></div>
      <div v-if="selectedFace !== undefined">
        <b>{{ translate((tr) => tr.sidebarPolygon) }}</b>
      </div>
      <div v-if="selectedFace !== undefined" class="row">
        <div class="label">{{ translate((tr) => tr.polygonName) }}</div>
        <input
          type="text"
          @keydown.stop
          size="10"
          ref="faceNameBox"
          :value="faceName || ''"
          @change="changeFaceName"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/_defs.scss';

.super-sidebar {
  height: 100%;
  width: 300px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
}
@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] .super-sidebar {
    background-color: map.get(defs.$bar-color, $theme);
  }
}

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.grid-settings {
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: max-content max-content;
  align-items: center;
}

.space {
  @include defs.fixed-height(5px);
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label {
  margin-right: 4px;
}
</style>
