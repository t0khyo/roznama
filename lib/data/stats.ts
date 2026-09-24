import { getEvents } from "@/lib/data/events"
import { getEventRequests } from "@/lib/data/event-requests"

export interface DashboardStats {
  totalWeddings: number
  upcomingWeddings: number  // eventDate >= today
  totalBookings: number
  pendingBookings: number   // status === NEW
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [events, requests] = await Promise.all([
    getEvents(),
    getEventRequests(),
  ])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    totalWeddings: events.length,
    upcomingWeddings: events.filter((e) => new Date(e.eventDate) >= today).length,
    totalBookings: requests.length,
    pendingBookings: requests.filter((r) => r.status === "NEW").length,
  }
}
