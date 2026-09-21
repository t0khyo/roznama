export interface Wedding {
  id: number
  tribe: string
  groom: string
  date: string   // ISO date string "YYYY-MM-DD"
  image: string  // URL
}

export type BookingStatus = "pending" | "approved" | "rejected"

export interface BookingRequest {
  id: number
  name: string        // الاسم
  phone: string       // رقم الهاتف
  date: string        // ISO date string
  venue: string       // المكان
  status: BookingStatus
  submittedAt: string // ISO datetime
}
