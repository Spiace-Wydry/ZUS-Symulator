<script setup lang="ts">
import { computed } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'

const store = usePensionStore()
const results = computed(() => store.results)
const params = computed(() => store.simulationParams)

function pln(n?: number) {
  if (n == null || isNaN(n as any)) return '—'
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <main class="container">
    <h1>Wyniki symulacji</h1>

    <div v-if="!results">
      <p>Brak wyników do wyświetlenia. Wypełnij formularz, aby zobaczyć prognozę.</p>
      <RouterLink class="button" to="/simulate">Przejdź do formularza</RouterLink>
    </div>

    <div v-else class="grid">
      <section class="card highlight">
        <h2>Twoja prognozowana emerytura</h2>
        <div class="kv">
          <div>
            <span class="label">Nominalnie</span>
            <span class="value">{{ pln(results.nominalPension) }}/mies.</span>
          </div>
          <div>
            <span class="label">W cenach bieżących</span>
            <span class="value">{{ pln(results.realPension) }}/mies.</span>
          </div>
          <div>
            <span class="label">Stopa zastąpienia</span>
            <span class="value">{{ results.replacementRate?.toFixed(2) }}%</span>
          </div>
          <div>
            <span class="label">Śr. emerytura w roku przejścia</span>
            <span class="value">{{ pln(results.averagePensionInRetirementYear) }}</span>
          </div>
        </div>
      </section>

      <section class="card" v-if="results.pensionWithoutSickLeave || results.pensionWithSickLeave">
        <h3>Wpływ zwolnień lekarskich</h3>
        <p v-if="results.pensionWithoutSickLeave && results.pensionWithSickLeave">
          Bez L4: <strong>{{ pln(results.pensionWithoutSickLeave) }}</strong>,
          z L4: <strong>{{ pln(results.pensionWithSickLeave) }}</strong>
        </p>
      </section>

      <section class="card" v-if="results.delayBenefits?.length">
        <h3>Co daje odłożenie emerytury?</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Opóźnienie</th>
              <th>Prognozowana emerytura</th>
              <th>Wzrost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in results.delayBenefits" :key="row.years">
              <td>+{{ row.years }} {{ row.years === 1 ? 'rok' : 'lata' }}</td>
              <td>{{ pln(row.pension) }}</td>
              <td>{{ pln(row.increase) }} ({{ row.increasePercent.toFixed(2) }}%)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card" v-if="results.yearsNeededForExpected !== undefined && params?.expectedPension">
        <h3>Droga do oczekiwanej emerytury</h3>
        <p>
          Aby osiągnąć oczekiwaną kwotę {{ pln(params!.expectedPension) }}, potrzeba
          <strong>{{ results.yearsNeededForExpected === 0 ? '0 lat (już osiągnięta)' : results.yearsNeededForExpected + ' lat' }}</strong>
          dodatkowej pracy.
        </p>
      </section>

      <section class="card">
        <h3>Podsumowanie parametrów</h3>
        <ul class="params">
          <li><span>Wiek:</span> <strong>{{ params?.age }}</strong></li>
          <li><span>Płeć:</span> <strong>{{ params?.gender === 'K' ? 'Kobieta' : 'Mężczyzna' }}</strong></li>
          <li><span>Wynagrodzenie brutto:</span> <strong>{{ pln(params?.grossSalary) }}</strong></li>
          <li><span>Okres aktywności:</span> <strong>{{ params?.startYear }}–{{ params?.endYear }}</strong></li>
          <li v-if="params?.accountBalance"><span>Saldo konta ZUS:</span> <strong>{{ pln(params?.accountBalance) }}</strong></li>
          <li v-if="params?.subAccountBalance"><span>Saldo subkonta:</span> <strong>{{ pln(params?.subAccountBalance) }}</strong></li>
          <li><span>Uwzględnij L4:</span> <strong>{{ params?.includeSickLeave ? 'Tak' : 'Nie' }}</strong></li>
        </ul>
      </section>

      <div class="actions">
        <RouterLink class="button" to="/simulate">Wróć do formularza</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
h1 { color: var(--zus-navy, #00416e); margin-bottom: 16px; }
.grid { display: grid; gap: 16px; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.highlight { border-color: var(--zus-blue, #3f84d2); box-shadow: 0 0 0 3px rgba(63,132,210,0.1); }
.kv { display: grid; grid-template-columns: 1fr; gap: 12px; }
.kv .label { color: #6b7280; display: block; }
.kv .value { font-weight: 700; font-size: 1.1rem; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; border-bottom: 1px solid #e5e7eb; padding: 8px; }
.params { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr; gap: 8px; }
.params li span { color: #6b7280; margin-right: 6px; }
.actions { margin-top: 8px; }
@media (min-width: 768px) {
  .kv { grid-template-columns: repeat(4, 1fr); }
  .params { grid-template-columns: repeat(2, 1fr); }
}
</style>
