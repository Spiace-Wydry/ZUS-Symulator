<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="card">
    <label class="toggle switch">
      <input type="checkbox" :checked="props.modelValue" @change="onChange" />
      <span class="slider" aria-hidden="true"></span>
      <span class="text">Uwzględnij możliwość zwolnień lekarskich</span>
    </label>
    <p class="helper">
      Średnio pracujący w Polsce przebywa na zwolnieniu: kobiety - 15 dni/rok, mężczyźni - 10 dni/rok. Średnie
      obniżenie świadczenia wynika z mniejszych składek.
    </p>
  </div>
</template>

<style scoped>
.toggle { display: flex; gap: 12px; align-items: center; }
.switch { user-select: none; cursor: pointer; }
.switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.switch .slider {
  position: relative;
  width: 44px; height: 24px;
  background: #e5e7eb;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  box-shadow: inset 0 -1px 0 rgba(0,0,0,0.04);
}
.switch .slider::before {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 18px; height: 18px;
  background: white;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08);
  transition: transform 200ms cubic-bezier(.2,.7,.2,1);
}
.switch input:checked + .slider { background: var(--zus-blue); border-color: var(--zus-blue); }
.switch input:checked + .slider::before { transform: translateX(20px); }
.switch:focus-within .slider { box-shadow: 0 0 0 3px rgba(63,132,210,0.20); }
.text { font-weight: 600; color: #374151; }
</style>
