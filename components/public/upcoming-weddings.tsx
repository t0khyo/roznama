"use client"

import { weddingsData } from "@/lib/constants"
import WeddingCarousel from "./rotational-carousel"

export default function UpcomingWeddings() {
  return (
    <section id="upcoming" className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#8B1A1A] font-cairo text-sm font-medium mb-2 tracking-wider">المناسبات</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#1A1714]"
              style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
            >
              المناسبات القادمة
            </h2>
          </div>
          <div className="h-px flex-1 bg-[#E5DDD0] mr-8 mb-4 hidden md:block" />
        </div>
      </div>

      {/* Full-width carousel — overflow visible so adjacent slides peek in */}
      <div className="max-w-6xl mx-auto">
        <WeddingCarousel weddings={weddingsData} />
      </div>
    </section>
  )
}
