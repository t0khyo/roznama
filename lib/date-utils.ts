import { arabicMonths } from "./constants"

export function parseLocalDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  const parts = dateInput.split('T')[0].split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(dateInput);
}

export function formatArabicDate(dateInput: string | Date): string {
  const d = parseLocalDate(dateInput);
  return `${d.getDate()} ${arabicMonths[d.getMonth()]} ${d.getFullYear()}`
}
