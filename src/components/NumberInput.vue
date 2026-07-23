<script setup lang="ts">
import { translate } from '@/config'
import { addKeyHandler, type M } from '@/keyboard'
import type { Int } from '@/math/fraction'
import { useTemplateRef } from 'vue'

const props = defineProps<{
  min: number
  max: number
  step?: number | ((value: number, increase: boolean) => number)
  precision?: number
  integer: boolean
  value: number
  decreaseTooltip: string | undefined
  increaseTooltip: string | undefined
  decreaseKey: [M, string] | undefined
  increaseKey: [M, string] | undefined
}>()
function getStep(value: number, increase: boolean): number {
  return props.step === undefined
    ? 1
    : typeof props.step === 'number'
      ? props.step
      : props.step(value, increase)
}

const emit = defineEmits<{
  (e: 'change', value: Int): void
}>()

const textBox = useTemplateRef('text')

function decrement() {
  if (props.value > props.min)
    emit('change', Math.max(props.min, props.value - getStep(props.value, false)))
}

function increment() {
  if (props.value < props.max)
    emit('change', Math.min(props.max, props.value + getStep(props.value, true)))
}

if (props.decreaseKey !== undefined) addKeyHandler(...props.decreaseKey, decrement)
if (props.increaseKey !== undefined) addKeyHandler(...props.increaseKey, increment)

function text(n: number) {
  return props.precision === undefined ? n.toString() : n.toFixed(props.precision)
}

function onChange() {
  const box = textBox.value
  if (box === null) return
  const value = props.integer ? Number.parseInt(box.value) : Number.parseFloat(box.value)
  if (value >= props.min && value <= props.max) emit('change', value)
  else box.value = text(props.value)
}
</script>

<template>
  <div class="integer-input">
    <input
      type="button"
      value="-"
      :title="decreaseTooltip"
      :disabled="value <= min"
      @click="decrement"
    />
    <input
      ref="text"
      type="text"
      @keydown.stop
      pattern="[0-9]"
      size="4"
      :value="text(value)"
      :title="
        translate((t) => t.integerInput.replace('${min}', `${min}`).replace('${max}', `${max}`))
          .value
      "
      @change="onChange"
    />
    <input
      type="button"
      value="+"
      :title="increaseTooltip"
      :disabled="value >= max"
      @click="increment"
    />
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
