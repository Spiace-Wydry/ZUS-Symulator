<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'

const store = usePensionStore()
const params = computed(() => store.simulationParams)

const newEndYear = ref<number>(params.value?.endYear || new Date().getFullYear() + 35)
const newSalary = ref<number>(params.value?.grossSalary || 8000)

watch(params, (p) => {
  if (p) {
    newEndYear.value = p.endYear
    newSalary.value = p.grossSalary
  }
})

function applyChanges() {
  const p = params.value
  if (!p) return
  store.runSimulation({
    ...p,
    grossSalary: Math.max(0, Math.round(newSalary.value || p.grossSalary)),
    endYear: Math.max(p.startYear, Math.round(newEndYear.value || p.endYear)),
  })
}

function adjustDelay(years: number) {
  const p = params.value
  if (!p) return
  newEndYear.value = p.endYear + years
  applyChanges()
}
</script>

<template>
  <div>
    <div v-if="!params">
      <p class="helper">Uruchom najpierw symulację, aby modyfikować scenariusz.</p>
    </div>
    <div v-else class="editor">
      <div class="row">
        <label>Wiek przejścia na emeryturę (rok zakończenia)</label>
        <div class="control">
          <input
            type="range"
            :min="Math.max(params!.startYear + 30, params!.startYear)"
            :max="params!.startYear + 55"
            v-model.number="newEndYear"
          />
          <input class="num" type="number" v-model.number="newEndYear" />
        </div>
        <div class="chips">
          <button type="button" class="chip" @click="adjustDelay(1)">+1 rok</button>
          <button type="button" class="chip" @click="adjustDelay(2)">+2 lata</button>
          <button type="button" class="chip" @click="adjustDelay(5)">+5 lat</button>
        </div>
      </div>

      <div class="row">
        <label>Wynagrodzenie brutto (mies.)</label>
        <div class="control">
          <span class="prefix">PLN</span>
          <input class="num" type="number" step="100" min="0" v-model.number="newSalary" />
        </div>
      </div>

      <div class="actions">
        <button type="button" class="button" @click="applyChanges">Zastosuj zmiany</button>
        <span class="helper">Aktualizuje prognozę i wykres na żywo.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor { display: grid; gap: 12px; }
.row { display: grid; gap: 6px; }
.control { display: flex; gap: 8px; align-items: center; }
.num { width: 120px; }
.prefix { background: #f3f4f6; padding: 6px 8px; border-radius: 6px; color: #374151; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { background: #eef5ff; border: 1px solid #d6e6ff; color: #0b3a63; padding: 6px 10px; border-radius: 999px; }
.actions { display: flex; align-items: center; gap: 12px; }
</style>
