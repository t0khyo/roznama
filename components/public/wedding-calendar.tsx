"use client"

import { useState } from "react"
import { arSA } from "react-day-picker/locale"
import { Calendar } from "@/components/ui/calendar"
import { weddingsData, arabicMonths } from "@/lib/constants"
import { formatArabicDate } from "@/lib/date-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const customArSA = { ...arSA, code: "ar-SA-u-ca-gregory" }

export default function WeddingCalendar() {
  const [month, setMonth] = useState<Date>(new Date(2026, 8, 1))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDay, setDialogDay] = useState<Date | undefined>(undefined)

  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  const weddingsThisMonth = weddingsData.filter((w) => {
    const d = new Date(w.date)
    return d.getFullYear() === year && d.getMonth() === monthIndex
  })

  const weddingDays = weddingsData.map((w) => new Date(w.date))

  const dialogWeddings = dialogDay
    ? weddingsData.filter(
        (w) => new Date(w.date).toDateString() === dialogDay.toDateString()
      )
    : []

  return (
    <>
      <section id="calendar" className="py-24 bg-[#F3EDE3]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section heading */}
        <div className="mb-12">
          <p className="text-[#8B1A1A] font-cairo text-sm font-medium mb-2 tracking-wider">
            المواعيد
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1A1714]"
            style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
          >
            التقويم
          </h2>
        </div>

        {/* Calendar card */}
        <div className="bg-[#FAF8F3] rounded-2xl border border-[#E5DDD0] overflow-hidden">
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={(day) => {
              if (!day) return
              const hasWedding = weddingsData.some(
                (w) => new Date(w.date).toDateString() === day.toDateString()
              )
              if (hasWedding) {
                setDialogDay(day)
                setDialogOpen(true)
              }
            }}
            month={month}
            onMonthChange={(m) => {
              setMonth(m)
              setDialogDay(undefined)
            }}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
            locale={customArSA}
            dir="rtl"
            modifiers={{ hasEvent: weddingDays }}
            modifiersClassNames={{
              hasEvent: "has-event",
            }}
            className="w-full font-cairo [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] p-4 md:p-6"
            classNames={{
              // Remove default bg so our card bg shows through
              root: "w-full",
              months: "w-full relative",
              month: "w-full",
              // Month caption — Amiri font, brand colours
              caption_label:
                "font-bold text-[#1A1714] text-lg tracking-wide flex items-center gap-1 [&>svg]:size-4",
              month_caption:
                "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
              dropdowns: "flex h-(--cell-size) w-full items-center justify-center gap-2 font-bold text-[#1A1714] text-sm md:text-base",
              // Nav buttons — brand hover
              button_previous:
                "size-(--cell-size) p-0 select-none rounded-full border border-[#E5DDD0] text-[#6B5E52] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
              button_next:
                "size-(--cell-size) p-0 select-none rounded-full border border-[#E5DDD0] text-[#6B5E52] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
              // Weekday header
              weekday:
                "font-cairo text-xs font-semibold text-[#A09080] py-3",
              weekdays: "border-b border-[#E5DDD0]",
              // Week rows
              week: "mt-0",
              // Day cell
              day: "border-b border-r border-[#E5DDD0]/50 rounded-none p-0 aspect-auto",
              // Grid
              month_grid: "w-full border-collapse",
            }}
          />

          {/* Legend */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E5DDD0]/50 text-[#A09080] font-cairo text-xs">
            <span className="w-2 h-2 rounded-full bg-[#8B1A1A] inline-block" />
            <span>يوم به فرح</span>
          </div>
        </div>

        {/* Event list for selected/current month */}
        {weddingsThisMonth.length > 0 && (
          <div className="mt-8 space-y-3">
            <p className="font-cairo text-sm font-medium text-[#6B5E52] mb-4">
              {`أفراح ${arabicMonths[monthIndex]}`}
            </p>
            {weddingsThisMonth.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl px-5 py-4 hover:border-[#8B1A1A]/30 transition-colors"
                style={{ boxShadow: "0 1px 8px rgba(26,23,20,0.04)" }}
              >
                <div className="w-10 h-10 rounded-full bg-[#C9973A] flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#C9973A]/25">
                  <span className="font-cairo font-bold text-sm text-[#FAF8F3]">
                    {new Date(w.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cairo font-bold text-sm text-[#1A1714]">
                    {w.groom}
                  </p>
                  <p className="font-cairo text-xs text-[#C9973A] font-medium">
                    {w.tribe}
                  </p>
                </div>
                <p className="font-cairo text-xs text-[#A09080] flex-shrink-0">
                  {formatArabicDate(w.date)}
                </p>
              </div>
            ))}
          </div>
        )}

        {weddingsThisMonth.length === 0 && (
          <p className="text-center font-cairo text-[#A09080] text-sm mt-8 py-8">
            لا توجد أفراح مسجلة في هذا الشهر
          </p>
        )}
      </div>
    </section>

      {/* Dialog for selected day's weddings */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="font-cairo max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo text-[#1A1714]">
              {dialogDay
                ? `أفراح يوم ${dialogDay.getDate()} ${arabicMonths[dialogDay.getMonth()]}`
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {dialogWeddings.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl px-5 py-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#C9973A] flex items-center justify-center flex-shrink-0">
                  <span className="font-cairo font-bold text-sm text-[#FAF8F3]">
                    {new Date(w.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cairo font-bold text-sm text-[#1A1714]">
                    {w.groom}
                  </p>
                  <p className="font-cairo text-xs text-[#C9973A] font-medium">
                    {w.tribe}
                  </p>
                </div>
                <p className="font-cairo text-xs text-[#A09080] flex-shrink-0">
                  {formatArabicDate(w.date)}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
