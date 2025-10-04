export interface SimulationParams {
  age: number
  gender: 'M' | 'K'
  grossSalary: number
  startYear: number
  endYear: number
  accountBalance?: number
  subAccountBalance?: number
  includeSickLeave: boolean
  expectedPension: number
}

export interface DelayBenefit {
  years: number
  pension: number
  increase: number
  increasePercent: number
}

export interface PensionResult {
  nominalPension: number
  realPension: number
  averagePensionInRetirementYear: number
  replacementRate: number
  pensionWithoutSickLeave?: number
  pensionWithSickLeave?: number
  delayBenefits: DelayBenefit[]
  yearsNeededForExpected?: number
}

export interface UsageRecord {
  timestamp: string // ISO 8601
  expectedPension: number
  age: number
  gender: 'M' | 'K'
  grossSalary: number
  includedSickLeave: boolean
  accountBalance?: number
  subAccountBalance?: number
  nominalPension: number
  realPension: number
  postalCode?: string
}
