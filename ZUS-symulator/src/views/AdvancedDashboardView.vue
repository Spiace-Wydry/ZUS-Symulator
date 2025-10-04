<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'
import TimelineEditor from '@/components/advanced/TimelineEditor.vue'
import AccountBalanceChart from '@/components/advanced/AccountBalanceChart.vue'
import { isValidPostalCode } from '@/utils/validators'

const store = usePensionStore()
const postal = ref<string>(store.postalCode || '')

const results = computed(() => store.results)
const params = computed(() => store.simulationParams)

function pln(n?: number) {
  if (n == null || isNaN(n as any)) return '—'
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n)
}

function runScenarioDelay(years: number) {
  const p = params.value
  if (!p) return
  store.runSimulation({ ...p, endYear: p.endYear + years })
}

watch(postal, (v) => {
  store.setPostalCode(v)
  try { localStorage.setItem('zus_postal', v) } catch {}
})
</script>

<template>
  <main class="container">
    <h1>Zaawansowany dashboard</h1>
    <p class="helper">Interaktywny panel z kluczowymi wskaźnikami i scenariuszami.</p>

    <section v-if="results && params" class="grid">
      <div class="card kpi">
        <div class="label">Emerytura nominalna</div>
        <div class="value">{{ pln(results.nominalPension) }}/mies.</div>
      </div>
      <div class="card kpi">
        <div class="label">W cenach bieżących</div>
        <div class="value">{{ pln(results.realPension) }}/mies.</div>
      </div>
      <div class="card kpi">
        <div class="label">Stopa zastąpienia</div>
        <div class="value">{{ results.replacementRate?.toFixed(2) }}%</div>
      </div>
      <div class="card kpi">
        <div class="label">Okres aktywności</div>
        <div class="value">{{ params.startYear }}–{{ params.endYear }}</div>
      </div>
    </section>

    <section class="card" v-if="params">
      <h3>Szybkie scenariusze</h3>
      <div class="chips">
        <button type="button" class="chip" @click="runScenarioDelay(1)">Opóźnij o 1 rok</button>
        <button type="button" class="chip" @click="runScenarioDelay(2)">Opóźnij o 2 lata</button>
        <button type="button" class="chip" @click="runScenarioDelay(5)">Opóźnij o 5 lat</button>
      </div>
      <p class="helper">Natychmiast aktualizuje prognozy i wykres.</p>
    </section>

    <section class="card">
      <h3>Edycja scenariusza</h3>
      <TimelineEditor />
    </section>

    <section class="card">
      <h3>Zgromadzone środki</h3>
      <AccountBalanceChart />
    </section>

    <section class="card">
      <label for="postal">Kod pocztowy (opcjonalnie)</label>
      <input id="postal" placeholder="00-000" v-model="postal" />
      <p :class="isValidPostalCode(postal) ? 'success' : 'error'">
        {{ isValidPostalCode(postal) ? 'Format poprawny' : 'Format: XX-XXX' }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (min-width: 900px) { .grid { grid-template-columns: repeat(4, 1fr); } }
.kpi .label { color: #6b7280; }
.kpi .value { font: 700 1.2rem/1.2 system-ui, sans-serif; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { background: #eef5ff; border: 1px solid #d6e6ff; color: #0b3a63; padding: 6px 10px; border-radius: 999px; }
</style>
