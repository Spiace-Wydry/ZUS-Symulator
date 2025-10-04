import { defineStore } from 'pinia'
import type { UsageRecord } from '@/types/pension.types'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    usageData: [] as UsageRecord[],
    filters: {
      dateFrom: null as string | null,
      dateTo: null as string | null,
      gender: null as ('M' | 'K') | null,
      ageRange: null as [number, number] | null,
      search: '' as string,
      pageSize: 10 as 10 | 25 | 50 | 100,
      page: 1,
    },
  }),
  actions: {
    fetchUsageData() {
      try {
        const data = JSON.parse(localStorage.getItem('zus_usage') || '[]') as UsageRecord[]
        this.usageData = Array.isArray(data) ? data : []
      } catch (e) {
        this.usageData = []
      }
    },
    applyFilters() {
      // no-op here; filtering will be done in getters for simplicity
    },
    exportToExcel() {
      // Placeholder; implemented in component using xlsx to avoid bundling here
    },
  },
  getters: {
    filtered(state): UsageRecord[] {
      let rows = state.usageData
      const f = state.filters
      if (f.dateFrom) rows = rows.filter((r) => r.timestamp >= f.dateFrom!)
      if (f.dateTo) rows = rows.filter((r) => r.timestamp <= f.dateTo!)
      if (f.gender) rows = rows.filter((r) => r.gender === f.gender)
      if (f.ageRange) rows = rows.filter((r) => r.age >= f.ageRange![0] && r.age <= f.ageRange![1])
      if (f.search) {
        const s = f.search.toLowerCase()
        rows = rows.filter((r) =>
          [r.postalCode, r.gender, r.nominalPension, r.realPension, r.grossSalary, r.expectedPension]
            .map((v) => String(v || ''))
            .some((x) => x.toLowerCase().includes(s))
        )
      }
      return rows
    },
    paginated(): UsageRecord[] {
      const rows = (this as any).filtered as UsageRecord[]
      const f = (this as any).filters
      const start = (f.page - 1) * f.pageSize
      return rows.slice(start, start + f.pageSize)
    },
    totalRows(): number {
      const rows = (this as any).filtered as UsageRecord[]
      return rows.length
    },
  },
})
