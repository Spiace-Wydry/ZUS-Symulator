<script setup lang="ts">
import { computed } from 'vue'
import { usePensionStore } from '@/stores/pensionStore'
import { indexWages } from '@/utils/calculations'

const store = usePensionStore()
const params = computed(() => store.simulationParams)

function pln(n?: number) {
  if (n == null || isNaN(n as any)) return '—'
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(n)
}

// Build a simple cumulative balance series using current params
const series = computed(() => {
  const p = params.value
  if (!p) return null
  const years: number[] = []
  for (let y = p.startYear; y <= p.endYear; y++) years.push(y)
  const wages = indexWages(p.grossSalary, years)
  const CONTRIBUTION_RATE = 0.1952
  const contributions = wages.map((w) => w * CONTRIBUTION_RATE)
  let startBalance = (p.accountBalance || 0) + (p.subAccountBalance || 0)
  const cumulative: { x: number; y: number; year: number }[] = []
  let acc = startBalance
  for (let i = 0; i < years.length; i++) {
    acc += contributions[i]
    cumulative.push({ x: i, y: Math.round(acc), year: years[i] })
  }
  return {
    points: cumulative,
    startBalance,
  }
})

const maxY = computed(() => {
  if (!series.value) return 0
  return Math.max(...series.value.points.map((p) => p.y))
})

function pathD() {
  const s = series.value
  if (!s || s.points.length === 0) return ''
  const width = 640
  const height = 200
  const padL = 40
  const padR = 16
  const padT = 12
  const padB = 28
  const cw = width - padL - padR
  const ch = height - padT - padB
  const xs = s.points
  const max = maxY.value || 1
  const n = xs.length
  const stepX = n > 1 ? cw / (n - 1) : cw
  const toX = (i: number) => padL + i * stepX
  const toY = (val: number) => padT + (1 - val / max) * ch
  let d = ''
  xs.forEach((pt, i) => {
    const x = toX(i)
    const y = toY(pt.y)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  })
  // Area baseline
  d += ` L ${padL + cw} ${padT + ch} L ${padL} ${padT + ch} Z`
  return d
}
</script>

<template>
  <div>
    <div v-if="!params">
      <p class="helper">Brak danych. Uruchom symulację, aby zobaczyć wykres.</p>
    </div>
    <div v-else>
      <svg viewBox="0 0 640 200" role="img" aria-label="Wykres salda konta ZUS" class="chart">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="var(--zus-blue, #3f84d2)" stop-opacity="0.35" />
            <stop offset="100%" stop-color="var(--zus-blue, #3f84d2)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="640" height="200" fill="transparent" />
        <!-- axes -->
        <line x1="40" y1="172" x2="624" y2="172" class="axis" />
        <line x1="40" y1="172" x2="40" y2="12" class="axis" />
        <!-- area path -->
        <path :d="pathD()" fill="url(#area)" stroke="var(--zus-blue, #3f84d2)" stroke-width="2" />
        <!-- labels -->
        <g v-if="series && series.points.length">
          <text x="40" y="192" class="tick">{{ series.points[0].year }}</text>
          <text x="624" y="192" class="tick" text-anchor="end">{{ series.points[series.points.length-1].year }}</text>
        </g>
      </svg>
      <div class="legend">
        <div>
          <span class="dot" /> Saldo łączne
        </div>
        <div class="spacer"></div>
        <div class="muted">Od {{ pln(series?.startBalance) }} do {{ pln(series?.points.at(-1)?.y) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart { width: 100%; height: auto; display: block; }
.axis { stroke: #e5e7eb; stroke-width: 1; }
.tick { fill: #6b7280; font-size: 12px; }
.legend { display: flex; align-items: center; gap: 12px; margin-top: 6px; color: #374151; }
.legend .dot { width: 10px; height: 10px; background: var(--zus-blue, #3f84d2); border-radius: 999px; display: inline-block; margin-right: 6px; }
.legend .spacer { flex: 1; }
</style>
