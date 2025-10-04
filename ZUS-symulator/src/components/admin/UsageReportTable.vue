<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const admin = useAdminStore()

onMounted(() => {
  admin.fetchUsageData()
})
</script>

<template>
  <div class="card">
    <h3>Raport użycia</h3>
    <div class="controls" style="display:flex; gap:8px; flex-wrap: wrap; margin-bottom: 8px">
      <input type="date" v-model="admin.filters.dateFrom" aria-label="Data od" />
      <input type="date" v-model="admin.filters.dateTo" aria-label="Data do" />
      <select v-model="admin.filters.gender" aria-label="Płeć">
        <option :value="null">Płeć (wszystkie)</option>
        <option value="K">Kobieta</option>
        <option value="M">Mężczyzna</option>
      </select>
      <input type="text" v-model="admin.filters.search" placeholder="Szukaj..." aria-label="Szukaj" />
      <select v-model="admin.filters.pageSize" aria-label="Rozmiar strony">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Godzina</th>
            <th>Emerytura oczekiwana</th>
            <th>Wiek</th>
            <th>Płeć</th>
            <th>Wynagrodzenie</th>
            <th>Zwolnienia</th>
            <th>Konto</th>
            <th>Subkonto</th>
            <th>Emerytura nominalna</th>
            <th>Emerytura urealniona</th>
            <th>Kod pocztowy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in admin.paginated" :key="row.timestamp">
            <td>{{ new Date(row.timestamp).toISOString().slice(0,10) }}</td>
            <td>{{ new Date(row.timestamp).toISOString().slice(11,19) }}</td>
            <td>{{ row.expectedPension?.toLocaleString('pl-PL') }} PLN</td>
            <td>{{ row.age }}</td>
            <td>{{ row.gender }}</td>
            <td>{{ row.grossSalary.toLocaleString('pl-PL') }} PLN</td>
            <td>{{ row.includedSickLeave ? 'Tak' : 'Nie' }}</td>
            <td>{{ row.accountBalance?.toLocaleString('pl-PL') || '-' }}</td>
            <td>{{ row.subAccountBalance?.toLocaleString('pl-PL') || '-' }}</td>
            <td>{{ row.nominalPension.toLocaleString('pl-PL') }} PLN</td>
            <td>{{ row.realPension.toLocaleString('pl-PL') }} PLN</td>
            <td>{{ row.postalCode || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display:flex; justify-content: space-between; align-items: center; margin-top: 8px">
      <span>Wiersze: {{ admin.totalRows }}</span>
      <div style="display:flex; gap:4px; align-items: center">
        <button class="button" :disabled="admin.filters.page === 1" @click="admin.filters.page = Math.max(1, admin.filters.page-1)">Prev</button>
        <span>Strona {{ admin.filters.page }}</span>
        <button class="button" :disabled="admin.filters.page * admin.filters.pageSize >= admin.totalRows" @click="admin.filters.page = admin.filters.page + 1">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px 12px; border-bottom: 1px solid #eee; text-align: left; }
th { background: var(--zus-blue-light); }
</style>
