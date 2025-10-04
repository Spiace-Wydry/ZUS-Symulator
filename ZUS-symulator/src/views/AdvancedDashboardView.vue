<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'
import TimelineEditor from '@/components/advanced/TimelineEditor.vue'
import AccountBalanceChart from '@/components/advanced/AccountBalanceChart.vue'
import { isValidPostalCode } from '@/utils/validators'

const store = usePensionStore()
const postal = ref<string>(store.postalCode || '')

watch(postal, (v) => {
  store.setPostalCode(v)
  try { localStorage.setItem('zus_postal', v) } catch {}
})
</script>

<template>
  <main class="container">
    <h1>Zaawansowany dashboard (MVP)</h1>
    <p class="helper">Wersja MVP — funkcje edycji i wykresy w przygotowaniu.</p>

    <section class="card">
      <h3>Historia wynagrodzeń</h3>
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
</style>
