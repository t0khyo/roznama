"use server"

import { redirect } from "next/navigation"
import { RequestStatus } from "@prisma/client"
import { verifySession } from "@/lib/session"
import {
  getEventRequests,
  updateRequestStatus,
} from "@/lib/data/event-requests"

async function requireAdmin() {
  const session = await verifySession()
  if (!session) redirect("/admin/login")
}

export async function getEventRequestsAction() {
  await requireAdmin()
  return getEventRequests()
}

export async function updateRequestStatusAction(id: string, status: RequestStatus) {
  await requireAdmin()
  return updateRequestStatus(id, status)
}
