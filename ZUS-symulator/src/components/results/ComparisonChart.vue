<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { usePensionStore } from '@/stores/pensionStore'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const store = usePensionStore()
const results = computed(() => store.results)

const data = computed(() => ({
  labels: ['Twoja', 'Średnia'],
  datasets: [
    {
      label: 'Kwota (PLN)',
      backgroundColor: ['#10b981', '#60a5fa'],
      data: results.value
        ? [results.value.nominalPension, results.value.averagePensionInRetirementYear]
        : [0, 0],
    },
  ],
}))

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
}
</script>

<template>
  <div class="card" v-if="results">
    <h3>Porównanie z rynkiem</h3>
    <p>Średnia emerytura w roku przejścia na emeryturę: <strong>{{ results!.averagePensionInRetirementYear.toLocaleString('pl-PL') }} PLN</strong></p>
    <p>Twoja emerytura stanowi <strong>{{ results!.replacementRate }}%</strong> z ostatniego wynagrodzenia (stopa zastąpienia)</p>
    <div class="chart-container">
      <Bar :data="data" :options="options" />
    </div>
  </div>
</template>

<style scoped>
</style>
