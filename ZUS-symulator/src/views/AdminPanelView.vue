<script setup lang="ts">
import UsageReportTable from '@/components/admin/UsageReportTable.vue'
import ExportButton from '@/components/admin/ExportButton.vue'
</script>

<template>
  <main class="container">
    <h1>Panel administracyjny</h1>
    <div style="display:flex; justify-content: flex-end; margin-bottom: 8px">
      <ExportButton />
    </div>
    <UsageReportTable />
  </main>
</template>

<style scoped>
</style>
