"use client"

import type { Event } from "@/types"
import VerticalEventsList from "./vertical-events-list"

export default function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section id="upcoming" className="py-24">
      {/* Section header */}
      <div className="max-w-xl mx-auto px-6 mb-14">
        <div className="flex items-end gap-4">
          <div>
            <p className="text-[#9F3647] font-cairo text-sm font-medium mb-2 tracking-wider">المناسبات</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#1A1714]"
              style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
            >
              المناسبات القادمة
            </h2>
          </div>
          <div className="flex-1 h-px bg-[#E5DDD0] mb-4 hidden md:block" />
        </div>
      </div>

      {/* Vertical column of events */}
      <div className="max-w-xl mx-auto px-6">
        <VerticalEventsList events={events} />
      </div>
    </section>
  )
}
