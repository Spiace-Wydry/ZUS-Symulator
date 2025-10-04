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

const submitting = ref(false)
const salaryPresets = [5000, 8000, 12000, 20000]
const selectPreset = (val: number) => { setFieldValue('grossSalary', val) }
const completion = computed(() => {
  const required: (keyof SimulationParams)[] = ['age','gender','grossSalary','startYear','endYear']
  let validCount = 0
  for (const k of required) {
    const v = (values as any)[k]
    if (v !== undefined && v !== null && v !== '' && !(k === 'gender' && v !== 'M' && v !== 'K')) validCount++
  }
  return Math.round((validCount / required.length) * 100)
})

const onSubmit = handleSubmit((vals) => {
  submitting.value = true
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
  submitting.value = false
})
</script>

<template>
  <form class="card glam" @submit.prevent="onSubmit" novalidate>
    <div class="form-hero">
      <div class="title">
        ✨ Parametry symulacji
      </div>
      <div class="meter" aria-label="Postęp wypełnienia">
        <div class="bar" :style="{ width: completion + '%' }"></div>
      </div>
      <p class="sub">Wypełnij kilka pól, a my policzymy resztę.</p>
    </div>

    <div class="grid">
      <div>
        <label for="age">Wiek</label>
        <input id="age" type="number" min="18" max="67" v-model.number="age" />
        <span class="error" v-if="errors.age">{{ errors.age }}</span>
      </div>
      <div>
        <label>Płeć</label>
        <div class="radio-group pill-group" role="radiogroup" aria-label="Płeć">
          <label class="pill"><input type="radio" value="K" v-model="gender" /> Kobieta</label>
          <label class="pill"><input type="radio" value="M" v-model="gender" /> Mężczyzna</label>
        </div>
        <span class="error" v-if="errors.gender">{{ errors.gender }}</span>
      </div>
    </div>

    <div class="grid">
      <div>
        <label for="salary">Wynagrodzenie brutto miesięczne (PLN)</label>
        <div class="affix-input">
          <span class="prefix">PLN</span>
          <input id="salary" type="number" step="100" min="100" v-model.number="grossSalary" />
        </div>
        <div class="chips">
          <button type="button" class="chip" v-for="p in salaryPresets" :key="p" @click="selectPreset(p)">
            {{ p.toLocaleString('pl-PL') }}
          </button>
        </div>
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
        <div class="affix-input">
          <span class="prefix">zł</span>
          <input id="acc" type="number" step="100" v-model.number="accountBalance" />
        </div>
      </div>
    </div>

    <div class="grid">
      <div>
        <label for="subacc">Środki na subkoncie ZUS (opcjonalnie)</label>
        <div class="affix-input">
          <span class="prefix">zł</span>
          <input id="subacc" type="number" step="100" v-model.number="subAccountBalance" />
        </div>
      </div>
      <div>
        <SickLeaveToggle v-model="includeSickLeave" />
      </div>
    </div>

    <div class="actions">
      <button type="submit" class="button" :disabled="submitting">
        Zaprognozuj moją przyszłą emeryturę
      </button>
    </div>
  </form>
</template>

<style scoped>
.grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
.radio-group { display: flex; gap: 16px; }

.glam {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 0;
}
.glam::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: conic-gradient(from 180deg at 50% 50%, rgba(63,132,210,0.4), rgba(255,179,79,0.5), rgba(63,132,210,0.4));
  filter: blur(12px);
  z-index: 0;
}
.glam > * {
  position: relative;
  z-index: 1;
}
.form-hero {
  padding: 16px 16px 8px 16px;
  border-bottom: 1px solid #eef2f7;
  background:
    radial-gradient(400px 120px at 10% 0%, rgba(63,132,210,0.12), transparent),
    radial-gradient(360px 120px at 90% 0%, rgba(255,179,79,0.18), transparent),
    white;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.title { font-size: 1.1rem; font-weight: 800; color: var(--zus-navy); letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; }
.sub { margin: 6px 0 0 0; color: #6b7280; font-size: 0.95rem; }
.meter { height: 8px; border-radius: 999px; background: #eef2f7; overflow: hidden; margin-top: 10px; }
.bar { height: 100%; background: linear-gradient(90deg, var(--zus-blue), #3a79c4, var(--zus-orange)); width: 0%; transition: width 300ms ease; }

.card.glam .grid, .card.glam .actions { padding: 16px; }

.pill-group .pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  cursor: pointer;
  user-select: none;
}
.pill-group .pill input { appearance: none; width: 10px; height: 10px; border-radius: 999px; box-shadow: inset 0 0 0 2px #d1d5db; margin: 0; }
.pill-group .pill:has(input:checked) {
  background: var(--zus-blue-light);
  border-color: var(--zus-blue);
  color: #0b3a63;
}
.affix-input {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}
.affix-input .prefix {
  padding: 10px 12px;
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  border-right: 1px solid #e5e7eb;
}
.affix-input input {
  border: none;
  outline: none;
  padding: 10px 12px;
  flex: 1;
}
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.chip {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #0b3a63;
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease;
}
.chip:hover { background: #e8edf5; transform: translateY(-1px); }

.actions { margin-top: 12px; }
</style>
