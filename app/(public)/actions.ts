"use server"

import { createEventRequest } from "@/lib/data/event-requests"

export interface BookingFormInput {
  name: string
  phone: string
  preferredDate?: Date
  venue?: string
}

/** No auth check — called from the public booking form */
export async function submitBookingAction(data: BookingFormInput) {
  await createEventRequest(data)
}
