"use client"

import { useState } from "react"
import { arSA } from "react-day-picker/locale"
import { UserIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { arabicMonths } from "@/lib/constants"
import { formatArabicDate, parseLocalDate } from "@/lib/date-utils"
import type { Event } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const customArSA = { ...arSA, code: "ar-SA-u-ca-gregory" }

export default function WeddingCalendar({ events }: { events: Event[] }) {
  const [month, setMonth] = useState<Date>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDay, setDialogDay] = useState<Date | undefined>(undefined)

  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  const weddingsThisMonth = events.filter((w) => {
    const d = parseLocalDate(w.eventDate)
    return d.getFullYear() === year && d.getMonth() === monthIndex
  })

  const weddingDays = events.map((w) => parseLocalDate(w.eventDate))

  const dialogWeddings = dialogDay
    ? events.filter(
      (w) => parseLocalDate(w.eventDate).toDateString() === dialogDay.toDateString()
    )
    : []

  return (
    <>
      <section id="calendar" className="py-24 bg-secondary">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section heading */}
          <div className="mb-12">
            <p className="text-primary font-cairo text-sm font-medium mb-2 tracking-wider">
              المواعيد
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
            >
              التقويم
            </h2>
          </div>

          {/* Calendar card */}
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={(day) => {
                if (!day) return
                const hasWedding = events.some(
                  (w) => parseLocalDate(w.eventDate).toDateString() === day.toDateString()
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
                  "font-bold text-foreground text-lg tracking-wide flex items-center gap-1 [&>svg]:hidden",
                month_caption:
                  "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                dropdowns: "flex h-(--cell-size) w-full items-center justify-center gap-2 font-bold text-foreground text-sm md:text-base",
                // Nav buttons — brand hover
                button_previous:
                  "size-(--cell-size) p-0 select-none rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
                button_next:
                  "size-(--cell-size) p-0 select-none rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
                // Weekday header
                weekday:
                  "font-cairo text-xs font-semibold text-muted-foreground py-3",
                weekdays: "border-b border-border",
                // Week rows
                week: "mt-0",
                // Day cell
                day: "border-b border-r border-border/50 rounded-none p-0 aspect-auto",
                today: "bg-border/70 font-bold text-foreground",
                // Grid
                month_grid: "w-full border-collapse",
              }}
            />

            {/* Legend */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 text-muted-foreground font-cairo text-xs">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span>يوم محجوز</span>
            </div>
            {/* Event list for selected/current month */}
            {weddingsThisMonth.length > 0 && (
              <div className="border-t border-border/60 p-4 md:p-6 space-y-3">
                <p className="font-cairo text-sm font-semibold text-muted-foreground mb-4">
                  {`مناسبات ${arabicMonths[monthIndex]}`}
                </p>
                {weddingsThisMonth.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center gap-4 px-2 py-4 border-b border-border/60 hover:bg-border/10 transition-colors last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/25">
                      <span className="font-cairo font-bold text-sm text-primary-foreground">
                        {parseLocalDate(w.eventDate).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cairo font-bold text-sm text-foreground">
                        {w.tribe}
                      </p>
                      <p className="font-cairo text-xs text-muted-foreground font-medium leading-snug mt-0.5">
                        {w.groomName}
                      </p>
                    </div>
                    <p className="font-cairo text-xs text-muted-foreground flex-shrink-0">
                      {formatArabicDate(w.eventDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {weddingsThisMonth.length === 0 && (
              <p className="text-center font-cairo text-muted-foreground text-sm py-6 border-t border-border/60">
                لا توجد مناسبات مسجلة في هذا الشهر
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Dialog for selected day's weddings */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="font-cairo w-[92vw] sm:w-full max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo text-foreground">
              {dialogDay
                ? `مناسبات يوم ${dialogDay.getDate()} ${arabicMonths[dialogDay.getMonth()]}`
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {dialogWeddings.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 px-2 py-4 border-b border-border/60 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/25">
                  <span className="font-cairo font-bold text-sm text-primary-foreground">
                    {parseLocalDate(w.eventDate).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cairo font-bold text-sm text-foreground">
                    {w.tribe}
                  </p>
                  <p className="font-cairo text-xs text-muted-foreground font-medium leading-snug mt-0.5">
                    {w.groomName}
                  </p>
                </div>
                <p className="font-cairo text-xs text-muted-foreground flex-shrink-0">
                  {formatArabicDate(w.eventDate)}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
