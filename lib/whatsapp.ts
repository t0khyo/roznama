/**
 * Formats a phone number into a direct WhatsApp wa.me URL
 * without any prefilled text as requested.
 */
export function formatWhatsAppUrl(phone: string): string {
  let cleaned = phone.trim().replace(/[^\d+]/g, "")
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1)
  } else if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2)
  } else if (cleaned.length === 8 && /^[569]/.test(cleaned)) {
    // Kuwait mobile numbers (8 digits starting with 5, 6, 9)
    cleaned = `965${cleaned}`
  }
  return `https://wa.me/${cleaned}`
}
