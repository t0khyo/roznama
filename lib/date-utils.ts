import { arabicMonths } from "./constants"

export function formatArabicDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()} ${arabicMonths[d.getMonth()]} ${d.getFullYear()}`
}
