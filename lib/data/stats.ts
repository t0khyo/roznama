import { getEvents } from "@/lib/data/events"
import { getEventRequests } from "@/lib/data/event-requests"
import type { Event } from "@/lib/data/events"
import type { EventRequest } from "@/lib/data/event-requests"

export type { Event, EventRequest }

export interface DashboardStats {
  totalEvents: number
  upcomingEvents: number  // eventDate >= today
  totalBookings: number
  pendingBookings: number   // status === NEW
}

export interface DashboardData {
  stats: DashboardStats
  recentRequests: EventRequest[]   // latest 8, by createdAt desc
  upcomingEventsList: Event[]      // next 6, by eventDate asc
  allEvents: Event[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [events, requests] = await Promise.all([
    getEvents(),
    getEventRequests(),
  ])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => new Date(e.eventDate) >= today).length,
    totalBookings: requests.length,
    pendingBookings: requests.filter((r) => r.status === "NEW").length,
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const [events, requests] = await Promise.all([
    getEvents(),
    getEventRequests(),
  ])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const stats: DashboardStats = {
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => new Date(e.eventDate) >= today).length,
    totalBookings: requests.length,
    pendingBookings: requests.filter((r) => r.status === "NEW").length,
  }

  const recentRequests = requests
    .filter((r) => r.status === "NEW")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  const upcomingEventsList = events
    .filter((e) => new Date(e.eventDate) >= today)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 6)

  return { stats, recentRequests, upcomingEventsList, allEvents: events }
}
