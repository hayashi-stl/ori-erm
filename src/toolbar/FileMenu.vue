<script setup lang="ts">
import { setStatus } from '@/StatusBar.vue'
import { useTemplateRef, ref } from 'vue'

const dropdown = useTemplateRef('dropdown')
const activated = ref(false)

let hideEvent: MouseEvent | undefined = undefined

function showDropdown(ev: MouseEvent) {
  // Don't show the dropdown on the same click that hides it
  if (ev === hideEvent) {
    hideEvent = undefined
    return
  }
  activated.value = true
  // Make the dropdown go away on click
  window.addEventListener(
    'click',
    (ev2: MouseEvent) => {
      hideEvent = ev2
      activated.value = false
    },
    { capture: true, passive: true, once: true },
  )
}

function newProject() {
  setStatus('Project newed.')
}

function closeProject() {
  setStatus('Project closed.')
}
</script>

<template>
  <div class="dropdown" ref="dropdown" @click="showDropdown">
    <input type="button" class="image-button" />
    <div class="dropdown-menu" v-if="activated">
      <input type="button" value="New Project" />
      <input type="button" value="Close Project" />
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  width: max-content;
  background-color: lightgray;
  border: gray 1px solid;
  display: flex;
  flex-direction: column;

  > input {
    border: none;
    text-align: left;
  }
}
</style>
