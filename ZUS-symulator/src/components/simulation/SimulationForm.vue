<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePensionStore } from '@/stores/pensionStore'
import SickLeaveToggle from './SickLeaveToggle.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import type { SimulationParams } from '@/types/pension.types'

const currentYear = new Date().getFullYear()
const store = usePensionStore()
const router = useRouter()

const schema = yup.object({
  age: yup
    .number()
    .typeError('Wiek jest wymagany')
    .required('Wiek jest wymagany')
    .min(18, 'Minimalny wiek to 18 lat')
    .max(67, 'Maksymalny wiek to 67 lat'),
  gender: yup.string().required('Płeć jest wymagana').oneOf(['M', 'K']),
  grossSalary: yup
    .number()
    .typeError('Wynagrodzenie jest wymagane')
    .required('Wynagrodzenie jest wymagane')
    .min(100, 'Minimalne wynagrodzenie to 100 zł')
    .max(1000000, 'Maksymalne wynagrodzenie to 1 000 000 zł'),
  startYear: yup
    .number()
    .typeError('Rok rozpoczęcia pracy jest wymagany')
    .required('Rok rozpoczęcia pracy jest wymagany')
    .min(1970, 'Najwcześniej 1970')
    .max(currentYear, `Najpóźniej ${currentYear}`),
  endYear: yup
    .number()
    .typeError('Rok zakończenia pracy jest wymagany')
    .required('Rok zakończenia pracy jest wymagany')
    .min(yup.ref('startYear'), 'Rok zakończenia nie może być wcześniej niż rozpoczęcia'),
  accountBalance: yup.number().transform((v) => (isNaN(v) ? undefined : v)).optional(),
  subAccountBalance: yup.number().transform((v) => (isNaN(v) ? undefined : v)).optional(),
  includeSickLeave: yup.boolean().required(),
})

const { handleSubmit, errors, setFieldValue, values } = useForm<SimulationParams>({
  validationSchema: schema as any,
  initialValues: {
    age: 30,
    gender: 'M',
    grossSalary: 8000,
    startYear: currentYear - 10,
    endYear: currentYear + 35, // will be recalculated below
    includeSickLeave: false,
    expectedPension: store.expectedPension || 0,
  },
})

const { value: age } = useField<number>('age')
const { value: gender } = useField<'M' | 'K'>('gender')
const { value: grossSalary } = useField<number>('grossSalary')
const { value: startYear } = useField<number>('startYear')
const { value: endYear } = useField<number>('endYear')
const { value: accountBalance } = useField<number | undefined>('accountBalance')
const { value: subAccountBalance } = useField<number | undefined>('subAccountBalance')
const { value: includeSickLeave } = useField<boolean>('includeSickLeave')

// Auto-calculate default endYear based on retirement age: K=60, M=65
watch([age, gender], ([a, g]) => {
  if (!a || !g) return
  const retirementAge = g === 'K' ? 60 : 65
  const birthYear = currentYear - a
  const autoEnd = birthYear + retirementAge
  setFieldValue('endYear', autoEnd)
})

// Ensure endYear >= startYear
watch([startYear, endYear], ([s, e]) => {
  if (s && e && e < s) setFieldValue('endYear', s)
})

const onSubmit = handleSubmit((vals) => {
  const params: SimulationParams = {
    age: vals.age,
    gender: vals.gender,
    grossSalary: vals.grossSalary,
    startYear: vals.startYear,
    endYear: vals.endYear,
    accountBalance: vals.accountBalance || undefined,
    subAccountBalance: vals.subAccountBalance || undefined,
    includeSickLeave: vals.includeSickLeave,
    expectedPension: store.expectedPension || 0,
  }
  store.runSimulation(params)
  router.push({ name: 'results' })
})
</script>

<template>
  <form class="card" @submit.prevent="onSubmit" novalidate>
    <h2>Parametry symulacji</h2>

    <div class="grid">
      <div>
        <label for="age">Wiek</label>
        <input id="age" type="number" min="18" max="67" v-model.number="age" />
        <span class="error" v-if="errors.age">{{ errors.age }}</span>
      </div>
      <div>
        <label>Płeć</label>
        <div class="radio-group" role="radiogroup" aria-label="Płeć">
          <label><input type="radio" value="K" v-model="gender" /> Kobieta</label>
          <label><input type="radio" value="M" v-model="gender" /> Mężczyzna</label>
        </div>
        <span class="error" v-if="errors.gender">{{ errors.gender }}</span>
      </div>
    </div>

    <div class="grid">
      <div>
        <label for="salary">Wynagrodzenie brutto miesięczne (PLN)</label>
        <input id="salary" type="number" step="100" min="100" v-model.number="grossSalary" />
        <span class="helper">Kwota w PLN, brutto.</span>
        <span class="error" v-if="errors.grossSalary">{{ errors.grossSalary }}</span>
      </div>
      <div>
        <label for="start">Rok rozpoczęcia pracy</label>
        <input id="start" type="number" :max="new Date().getFullYear()" min="1970" v-model.number="startYear" />
        <span class="error" v-if="errors.startYear">{{ errors.startYear }}</span>
      </div>
    </div>

    <div class="grid">
      <div>
        <label for="end">Planowany rok zakończenia aktywności zawodowej</label>
        <input id="end" type="number" min="1970" v-model.number="endYear" />
        <span class="helper">Automatycznie ustawiany na wiek emerytalny (K=60, M=65) — możesz zmienić.</span>
        <span class="error" v-if="errors.endYear">{{ errors.endYear }}</span>
      </div>
      <div>
        <label for="acc">Środki na koncie ZUS (opcjonalnie)</label>
        <input id="acc" type="number" step="100" v-model.number="accountBalance" />
      </div>
    </div>

    <div class="grid">
      <div>
        <label for="subacc">Środki na subkoncie ZUS (opcjonalnie)</label>
        <input id="subacc" type="number" step="100" v-model.number="subAccountBalance" />
      </div>
      <div>
        <SickLeaveToggle v-model="includeSickLeave" />
      </div>
    </div>

    <div style="margin-top: 12px">
      <button type="submit" class="button">Zaprognozuj moją przyszłą emeryturę</button>
    </div>
  </form>
</template>

<style scoped>
.grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
.radio-group { display: flex; gap: 16px; }
</style>
