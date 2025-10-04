<script setup lang="ts">
import { computed } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'

const store = usePensionStore()
const results = computed(() => store.results)
</script>

<template>
  <div class="card" v-if="results">
    <h2>Twoja prognozowana emerytura</h2>
    <div class="grid">
      <div>
        <h3>Rzeczywista (nominalna)</h3>
        <p style="font-size: 1.8rem; color: var(--zus-navy)">{{ results!.nominalPension.toLocaleString('pl-PL') }} PLN</p>
      </div>
      <div>
        <h3>Urealniona (w cenach bieżących)</h3>
        <p style="font-size: 1.8rem; color: var(--zus-green)">{{ results!.realPension.toLocaleString('pl-PL') }} PLN</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
</style>
