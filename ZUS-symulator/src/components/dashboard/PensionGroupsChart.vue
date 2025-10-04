<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { pensionGroups } from '@/services/mockData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title)

const labels = pensionGroups.map((g) => g.name)
const data = {
  labels,
  datasets: [
    {
      label: 'Średnia kwota (PLN) w grupie',
      backgroundColor: ['#fbbf24', '#60a5fa', '#34d399', '#93c5fd', '#f59e0b'],
      data: pensionGroups.map((g) => g.average),
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'Grupy emerytur' },
    tooltip: {
      callbacks: {
        afterLabel: (ctx: any) => pensionGroups[ctx.dataIndex].description,
      },
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
}

const chartRef = ref()

onMounted(() => {
  // no-op; chart renders via vue-chartjs
})
</script>

<template>
  <div class="card" aria-label="Wykres grup emerytalnych">
    <div class="chart-container">
      <Bar ref="chartRef" :data="data" :options="options" />
    </div>
  </div>
</template>

<style scoped>
</style>
