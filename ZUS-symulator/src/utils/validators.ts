export function isValidAge(age: number): boolean {
  return Number.isFinite(age) && age >= 18 && age <= 67
}

export function isValidSalary(salary: number): boolean {
  return Number.isFinite(salary) && salary >= 100 && salary <= 1_000_000
}

export function isValidYear(year: number): boolean {
  const now = new Date().getFullYear()
  return Number.isInteger(year) && year >= 1970 && year <= now + 50 // allow a bit into future for endYear
}

export function isValidPostalCode(postal: string): boolean {
  return /^\d{2}-\d{3}$/.test(postal)
}
