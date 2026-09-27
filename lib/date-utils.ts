import { arabicMonths } from "./constants"

export function formatArabicDate(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  return `${d.getDate()} ${arabicMonths[d.getMonth()]} ${d.getFullYear()}`
}
