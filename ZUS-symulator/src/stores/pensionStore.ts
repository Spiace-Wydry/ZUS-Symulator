import { defineStore } from 'pinia'
import type { PensionResult, SimulationParams, UsageRecord } from '@/types/pension.types'
import { calculatePension } from '@/utils/calculations'

export const usePensionStore = defineStore('pension', {
  state: () => ({
    expectedPension: 0,
    simulationParams: null as SimulationParams | null,
    results: null as PensionResult | null,
    history: [] as SimulationParams[],
    postalCode: '' as string,
  }),
  actions: {
    setExpectedPension(amount: number) {
      this.expectedPension = Math.max(0, Math.round(amount || 0))
    },
    runSimulation(params: SimulationParams) {
      // ensure expectedPension flows into calc
      const merged: SimulationParams = { ...params, expectedPension: params.expectedPension ?? this.expectedPension }
      this.simulationParams = merged
      this.results = calculatePension(merged)
      this.saveToHistory()
      this.trackUsage()
    },
    saveToHistory() {
      if (this.simulationParams) {
        this.history.push(this.simulationParams)
        try {
          localStorage.setItem('zus_history', JSON.stringify(this.history))
        } catch (e) {
          console.warn('Failed to save history', e)
        }
      }
    },
    clearResults() {
      this.results = null
    },
    setPostalCode(code: string) {
      this.postalCode = code
    },
    trackUsage() {
      if (!this.simulationParams || !this.results) return
      const p = this.simulationParams
      const r = this.results
      const record: UsageRecord = {
        timestamp: new Date().toISOString(),
        expectedPension: p.expectedPension,
        age: p.age,
        gender: p.gender,
        grossSalary: p.grossSalary,
        includedSickLeave: p.includeSickLeave,
        accountBalance: p.accountBalance,
        subAccountBalance: p.subAccountBalance,
        nominalPension: r.nominalPension,
        realPension: r.realPension,
        postalCode: this.postalCode || undefined,
      }
      try {
        const existing = JSON.parse(localStorage.getItem('zus_usage') || '[]')
        existing.push(record)
        localStorage.setItem('zus_usage', JSON.stringify(existing))
      } catch (e) {
        console.warn('Failed to track usage', e)
      }
    },
  },
  getters: {
    hasResults: (state) => !!state.results,
  },
})
