<script setup lang="ts">
import { computed } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'

const store = usePensionStore()
const results = computed(() => store.results)
</script>

<template>
  <div class="card" v-if="results">
    <h3>Symulacja odroczenia emerytury</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Odroczenie o</th>
            <th>Emerytura</th>
            <th>Wzrost</th>
            <th>Wzrost %</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results!.delayBenefits" :key="row.years">
            <td>+{{ row.years }} {{ row.years === 1 ? 'rok' : row.years === 2 ? 'lata' : 'lat' }}</td>
            <td>{{ row.pension.toLocaleString('pl-PL') }} PLN</td>
            <td>+{{ row.increase.toLocaleString('pl-PL') }} PLN</td>
            <td>+{{ row.increasePercent.toFixed(2) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px 12px; border-bottom: 1px solid #eee; text-align: left; }
th { background: var(--zus-blue-light); }
</style>
