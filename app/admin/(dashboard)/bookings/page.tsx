"use client"

import { useEffect, useState } from "react"
import { BookingsTable } from "@/components/admin/bookings-table"
import {
  getEventRequestsAction,
  updateRequestStatusAction,
} from "@/app/admin/bookings/actions"
import { RequestStatus, type EventRequest } from "@/types"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<EventRequest[]>([])

  const refresh = () => getEventRequestsAction().then(setBookings)

  useEffect(() => { refresh() }, [])

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    await updateRequestStatusAction(id, status)
    await refresh()
  }

  const newCount = bookings.filter((b) => b.status === "NEW").length
  const contactedCount = bookings.filter((b) => b.status === "CONTACTED").length
  const publishedCount = bookings.filter((b) => b.status === "PUBLISHED").length
  const closedCount = bookings.filter((b) => b.status === "CLOSED").length

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Heading */}
      <div>
        <p className="text-[#8B1A1A] font-cairo text-xs font-semibold tracking-widest mb-1 uppercase">
          Bookings
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1714]"
          style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
        >
          طلبات التسجيل
        </h1>
        <p className="font-cairo text-sm text-[#A09080] mt-1">
          {bookings.length} طلب —{" "}
          {newCount} جديد · {publishedCount} منشور · {closedCount} مرفوض
        </p>
      </div>

      {/* Table */}
      <BookingsTable
        bookings={bookings}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
