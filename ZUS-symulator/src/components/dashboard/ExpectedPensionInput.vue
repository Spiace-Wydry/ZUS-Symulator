<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'

const store = usePensionStore()
const value = ref<number | null>(store.expectedPension || null)

watch(value, (v) => {
  if (typeof v === 'number') store.setExpectedPension(v)
})
</script>

<template>
  <div class="card" role="region" aria-labelledby="expected-label">
    <label id="expected-label" for="expected-input">Jaką emeryturę chciałbyś mieć w przyszłości? (PLN)</label>
    <input
      id="expected-input"
      type="number"
      inputmode="decimal"
      min="0"
      step="100"
      placeholder="np. 5000"
      v-model.number="value"
      aria-describedby="expected-help"
    />
    <p id="expected-help" class="helper">Podaj kwotę brutto w złotówkach.</p>
  </div>
</template>

<style scoped>
</style>
