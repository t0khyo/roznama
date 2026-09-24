import "server-only"
import { db } from "@/lib/db"
import { RequestStatus, type EventRequest } from "@prisma/client"

export { RequestStatus }
export type { EventRequest }

export interface CreateEventRequestInput {
  name: string
  phone: string
  preferredDate?: Date
  venue?: string
}

/** No auth check — called from the public booking form Server Action */
export async function createEventRequest(
  data: CreateEventRequestInput
): Promise<EventRequest> {
  return db.eventRequest.create({ data })
}

/** Admin only — call only from authed Server Actions */
export async function getEventRequests(): Promise<EventRequest[]> {
  return db.eventRequest.findMany({ orderBy: { createdAt: "desc" } })
}

/** Admin only — call only from authed Server Actions */
export async function updateRequestStatus(
  id: string,
  status: RequestStatus
): Promise<EventRequest> {
  return db.eventRequest.update({ where: { id }, data: { status } })
}
