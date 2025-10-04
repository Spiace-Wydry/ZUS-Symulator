import type { DelayBenefit, PensionResult, SimulationParams } from '@/types/pension.types'

// Constants and assumptions
const AVG_WAGE_GROWTH = 0.035 // 3.5% yearly
const INFLATION_RATE = 0.025 // 2.5% yearly
const CONTRIBUTION_RATE = 0.1952 // 19.52% of gross
const FUS_RATE = 0.1222 // informational split
const SUB_RATE = 0.073

const LIFE_EXPECTANCY = {
  K: 82,
  M: 75,
} as const

const BASE_AVG_PENSION = 3500 // PLN in base year
const BASE_YEAR_FOR_AVG = new Date().getFullYear()

export function indexWages(initialSalary: number, years: number[]): number[] {
  return years.map((y, idx) => initialSalary * Math.pow(1 + AVG_WAGE_GROWTH, idx))
}

export function estimateAccountBalance(salary: number, startYear: number, currentYear: number): number {
  const years: number[] = []
  for (let y = startYear; y <= currentYear; y++) years.push(y)
  const wages = indexWages(salary, years)
  const total = wages.reduce((sum, w) => sum + w * CONTRIBUTION_RATE, 0)
  return Math.round(total)
}

export function calculateReplacementRate(pension: number, indexedSalary: number): number {
  if (indexedSalary <= 0) return 0
  return +(pension / indexedSalary * 100).toFixed(2)
}

export function calculateRealPension(nominalPension: number, retirementYear: number, baseYear: number): number {
  const yearsDiff = retirementYear - baseYear
  // deflate by inflation from retirement year back to base year
  const factor = Math.pow(1 + INFLATION_RATE, yearsDiff)
  return Math.round(nominalPension / factor)
}

export function applySickLeaveReduction(pension: number, gender: 'M' | 'K', yearsWorked: number): number {
  // Approximate reduction proportional to average sick days per year
  const days = gender === 'K' ? 15 : 10
  const reductionFraction = days / 365 // ~4.1% K, ~2.7% M
  const adjusted = pension * (1 - reductionFraction)
  return Math.round(adjusted)
}

function averagePensionForYear(year: number): number {
  const yearsDiff = year - BASE_YEAR_FOR_AVG
  return Math.round(BASE_AVG_PENSION * Math.pow(1 + AVG_WAGE_GROWTH, yearsDiff))
}

export function calculateDelayBenefits(params: SimulationParams, delayYears: number[]): DelayBenefit[] {
  return delayYears.map((dy) => {
    const delayedParams: SimulationParams = { ...params, endYear: params.endYear + dy }
    // Use skipDelay to avoid recursive delayBenefits calculation
    const base = calculatePension({ ...params }, { skipDelay: true })
    const delayed = calculatePension(delayedParams, { skipDelay: true })
    const increase = delayed.nominalPension - base.nominalPension
    const increasePercent = base.nominalPension > 0 ? (increase / base.nominalPension) * 100 : 0
    return {
      years: dy,
      pension: delayed.nominalPension,
      increase: Math.round(increase),
      increasePercent: +increasePercent.toFixed(2),
    }
  })
}

export function calculateYearsForExpectedPension(params: SimulationParams, expectedPension: number): number {
  if (!expectedPension || expectedPension <= 0) return 0
  const maxExtra = 15
  const base = calculatePension(params, { skipDelay: true }).nominalPension
  if (base >= expectedPension) return 0
  for (let extra = 1; extra <= maxExtra; extra++) {
    const next = calculatePension({ ...params, endYear: params.endYear + extra }, { skipDelay: true }).nominalPension
    if (next >= expectedPension) return extra
  }
  return maxExtra
}

export function calculatePension(
  params: SimulationParams,
  options?: { skipDelay?: boolean }
): PensionResult {
  try {
    const currentYear = new Date().getFullYear()
    const yearsWorked = Math.max(0, params.endYear - params.startYear + 1)
    const years: number[] = []
    for (let y = params.startYear; y <= params.endYear; y++) years.push(y)

    // Wage path and contributions
    const wages = indexWages(params.grossSalary, years)
    const contributions = wages.map((w) => w * CONTRIBUTION_RATE)
    let totalBalance = contributions.reduce((s, c) => s + c, 0)

    // Optionally add provided balances
    if (params.accountBalance && params.accountBalance > 0) totalBalance += params.accountBalance
    if (params.subAccountBalance && params.subAccountBalance > 0) totalBalance += params.subAccountBalance

    // Life expectancy at retirement in months
    const retirementAge = params.gender === 'K' ? 60 : 65
    const retirementYear = params.endYear
    const expectedLifeYears = LIFE_EXPECTANCY[params.gender]
    const yearsAfterRetirement = Math.max(1, expectedLifeYears - retirementAge)
    const divisionMonths = yearsAfterRetirement * 12

    // Baseline nominal monthly pension
    const nominalPensionRaw = totalBalance / divisionMonths
    let nominalPension = Math.round(nominalPensionRaw)

    let pensionWithoutSickLeave: number | undefined
    let pensionWithSickLeave: number | undefined
    if (params.includeSickLeave) {
      pensionWithoutSickLeave = nominalPension
      pensionWithSickLeave = applySickLeaveReduction(nominalPension, params.gender, yearsWorked)
      nominalPension = pensionWithSickLeave
    }

    const realPension = calculateRealPension(nominalPension, retirementYear, currentYear)

    const finalSalary = wages[wages.length - 1] || params.grossSalary
    const replacementRate = calculateReplacementRate(nominalPension, finalSalary)

    const averagePensionInRetirementYear = averagePensionForYear(retirementYear)

    const delayBenefits = options?.skipDelay ? [] : calculateDelayBenefits(params, [1, 2, 5])

    const yearsNeededForExpected = params.expectedPension
      ? calculateYearsForExpectedPension(params, params.expectedPension)
      : undefined

    return {
      nominalPension,
      realPension,
      averagePensionInRetirementYear,
      replacementRate,
      pensionWithoutSickLeave,
      pensionWithSickLeave,
      delayBenefits,
      yearsNeededForExpected,
    }
  } catch (e) {
    console.error('calculatePension error', e)
    return {
      nominalPension: 0,
      realPension: 0,
      averagePensionInRetirementYear: 0,
      replacementRate: 0,
      delayBenefits: [],
    }
  }
}
