<script setup lang="ts">
import { translate } from '@/config'
import { addKeyHandler, type M } from '@/keyboard'
import type { Int } from '@/math/fraction'
import { useTemplateRef } from 'vue'

const props = defineProps<{
  min: Int
  max: Int
  value: Int
  decreaseTooltip: string | undefined
  increaseTooltip: string | undefined
  decreaseKey: [M, string] | undefined
  increaseKey: [M, string] | undefined
}>()

const emit = defineEmits<{
  (e: 'change', value: Int): void
}>()

const textBox = useTemplateRef('text')

function decrement() {
  if (props.value > props.min) emit('change', props.value - 1)
}

function increment() {
  if (props.value < props.max) emit('change', props.value + 1)
}

if (props.decreaseKey !== undefined) addKeyHandler(...props.decreaseKey, decrement)
if (props.increaseKey !== undefined) addKeyHandler(...props.increaseKey, increment)

function onChange() {
  const box = textBox.value
  if (box === null) return
  const value = Number.parseInt(box.value || '')
  if (value >= props.min && value <= props.max) emit('change', value)
  else box.value = props.value.toString()
}
</script>

<template>
  <div class="integer-input">
    <input type="button" value="-" :title="decreaseTooltip" @click="decrement" />
    <input
      ref="text"
      type="text"
      pattern="[0-9]"
      size="4"
      :value="value"
      :title="
        translate((t) => t.integerInput.replace('${min}', `${min}`).replace('${max}', `${max}`))
          .value
      "
      @change="onChange"
    />
    <input type="button" value="+" :title="increaseTooltip" @click="increment" />
  </div>
</template>

<style lang="scss">
@use 'sass:map';
@use '@/_defs.scss';

.integer-input {
  display: flex;
  flex-direction: row;

  > input[type='button'] {
    @include defs.fixed-width(22px);
    @include defs.fixed-height(22px);
  }

  > input[type='text'] {
    text-align: right;
  }
}
</style>
