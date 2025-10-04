<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const admin = useAdminStore()
const fileName = computed(() => {
  const d = new Date()
  const date = d.toISOString().slice(0, 10)
  const time = d.toTimeString().slice(0, 8).replaceAll(':', '-')
  return `symulator_raport_${date}_${time}.xlsx`
})

async function exportExcel() {
  const rows = (admin as any).filtered as any[]
  if (!rows?.length) return
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Użycie symulatora')
  ws['!cols'] = [
    { wch: 12 }, // Data
    { wch: 10 }, // Godzina
    { wch: 18 }, // Emerytura oczekiwana
    { wch: 6 }, // Wiek
    { wch: 8 }, // Płeć
    { wch: 16 }, // Wynagrodzenie
    { wch: 10 }, // Zwolnienia
    { wch: 16 }, // Konto
    { wch: 16 }, // Subkonto
    { wch: 18 }, // Nominalna
    { wch: 18 }, // Urealniona
    { wch: 10 }, // Kod
  ]
  XLSX.writeFile(wb, fileName.value)
}
</script>

<template>
  <button class="button" @click="exportExcel">Eksport do XLS</button>
</template>

<style scoped>
</style>
