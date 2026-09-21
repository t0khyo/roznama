import { getWeddings } from "@/lib/data/weddings"
import { getBookingRequests } from "@/lib/data/bookings"

export interface DashboardStats {
  totalWeddings: number
  upcomingWeddings: number   // date >= today
  totalBookings: number
  pendingBookings: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [weddings, bookings] = await Promise.all([
    getWeddings(),
    getBookingRequests(),
  ])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    totalWeddings: weddings.length,
    upcomingWeddings: weddings.filter((w) => new Date(w.date) >= today).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
  }
}
