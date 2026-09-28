import "server-only"
import { withDb } from "@/lib/db"
import { RequestStatus, type EventRequest } from "@/types"

export { RequestStatus }
export type { EventRequest }

export interface CreateEventRequestInput {
  name: string
  phone: string
  preferredDate?: Date | string | null
  venue?: string | null
}

/** No auth check — called from the public booking form Server Action */
export async function createEventRequest(
  data: CreateEventRequestInput
): Promise<EventRequest> {
  const preferredDateStr = data.preferredDate
    ? typeof (data.preferredDate as any).toISOString === "function"
      ? (data.preferredDate as Date).toISOString().slice(0, 10)
      : String(data.preferredDate)
    : null

  return withDb(async (db) =>
    await db.orm.public.EventRequest.create({
      name: data.name,
      phone: data.phone,
      preferredDate: preferredDateStr,
      venue: data.venue ?? null,
      status: RequestStatus.NEW,
    })
  )
}

/** Admin only — call only from authed Server Actions */
export async function getEventRequests(): Promise<EventRequest[]> {
  return withDb(async (db) =>
    await db.orm.public.EventRequest.orderBy((r) => r.createdAt.desc()).all()
  )
}

/** Admin only — call only from authed Server Actions */
export async function updateRequestStatus(
  id: string,
  status: RequestStatus
): Promise<EventRequest> {
  const result = await withDb(async (db) =>
    await db.orm.public.EventRequest.where({ id }).update({ status })
  )
  if (!result) throw new Error(`EventRequest ${id} not found`)
  return result
}
