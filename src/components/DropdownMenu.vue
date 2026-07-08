<script setup lang="ts">
/*! A generic dropdown menu. */

import { useTemplateRef, ref, type Ref } from 'vue'

const props = defineProps<{
  items: { text: Ref<string>; click: (ev: MouseEvent) => void }[]
}>()

// Index the items so that the v-for is keyed
const keyedItems = props.items.map((item, index) => ({
  index: index,
  text: item.text,
  click: item.click,
}))

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
</script>

<template>
  <div class="dropdown" ref="dropdown" @click="showDropdown">
    <slot></slot>
    <div class="dropdown-menu" v-if="activated">
      <input
        type="button"
        v-for="item in keyedItems"
        :key="item.index"
        :value="item.text.value"
        @click="item.click"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/_defs.scss';

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  width: max-content;
  display: flex;
  flex-direction: column;

  > input {
    border: none;
    text-align: left;
  }
}
@each $theme in defs.$themes {
  html[data-theme='#{$theme}'] .dropdown-menu {
    border: map.get(defs.$border-color, $theme) 1px solid;
    > input {
      color: map.get(defs.$text-color, $theme);
      @include defs.button-color($theme);
    }
  }
}
</style>
