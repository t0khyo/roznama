"use client"

import { useEffect, useState } from "react"
import { BookingsTable } from "@/components/admin/bookings-table"
import { getBookingRequests, updateBookingStatus } from "@/lib/data/bookings"
import type { BookingRequest, BookingStatus } from "@/types"

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])

  const refresh = () => getBookingRequests().then(setBookings)

  useEffect(() => { refresh() }, [])

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    await updateBookingStatus(id, status)
    await refresh()
  }

  const pending = bookings.filter((b) => b.status === "pending").length
  const approved = bookings.filter((b) => b.status === "approved").length
  const rejected = bookings.filter((b) => b.status === "rejected").length

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
          طلبات الحجز
        </h1>
        <p className="font-cairo text-sm text-[#A09080] mt-1">
          {bookings.length} طلب — {pending} قيد الانتظار · {approved} مقبول · {rejected} مرفوض
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
