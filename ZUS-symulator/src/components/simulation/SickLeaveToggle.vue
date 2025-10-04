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
    <label class="toggle">
      <input type="checkbox" :checked="props.modelValue" @change="onChange" />
      <span>Uwzględnij możliwość zwolnień lekarskich</span>
    </label>
    <p class="helper">
      Średnio pracujący w Polsce przebywa na zwolnieniu: kobiety - 15 dni/rok, mężczyźni - 10 dni/rok. Średnie
      obniżenie świadczenia wynika z mniejszych składek.
    </p>
  </div>
</template>

<style scoped>
.toggle { display: flex; gap: 8px; align-items: center; }
</style>
