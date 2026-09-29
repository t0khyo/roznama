"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  HeartHandshakeIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  ClockIcon,
  PlusCircleIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { arSA } from "react-day-picker/locale"
import { arabicMonths } from "@/lib/constants"
import type { DashboardStats, DashboardData } from "@/lib/data/stats"
import type { Event, EventRequest } from "@/lib/data/stats"
import { getDashboardDataAction } from "@/app/admin/actions"
import { REQUEST_STATUS_LABELS, RequestStatus } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

const customArSA = { ...arSA, code: "ar-SA-u-ca-gregory" }

// ─── Stat card config ───────────────────────────────────────────────────────

const statConfig = [
  {
    key: "totalEvents" as keyof DashboardStats,
    label: "المناسبات",
    icon: HeartHandshakeIcon,
    color: "text-[#8B1A1A]",
    bg: "bg-[#8B1A1A]/10",
    border: "border-[#8B1A1A]/20",
  },
  {
    key: "upcomingEvents" as keyof DashboardStats,
    label: "مناسبات قادمة",
    icon: CalendarDaysIcon,
    color: "text-[#C9973A]",
    bg: "bg-[#C9973A]/10",
    border: "border-[#C9973A]/20",
  },
  {
    key: "totalBookings" as keyof DashboardStats,
    label: "طلبات التسجيل",
    icon: ClipboardListIcon,
    color: "text-[#6B5E52]",
    bg: "bg-[#6B5E52]/10",
    border: "border-[#6B5E52]/20",
  },
  {
    key: "pendingBookings" as keyof DashboardStats,
    label: "طلبات قيد الانتظار",
    icon: ClockIcon,
    color: "text-[#8B1A1A]",
    bg: "bg-[#8B1A1A]/8",
    border: "border-[#8B1A1A]/15",
  },
]

// ─── Quick actions config ────────────────────────────────────────────────────

const quickActions = [
  {
    label: "إضافة مناسبة",
    icon: PlusCircleIcon,
    href: "/admin/events",
    color: "text-[#8B1A1A]",
    bg: "bg-[#8B1A1A]/8 hover:bg-[#8B1A1A]/16",
    border: "border-[#8B1A1A]/20",
  },
  {
    label: "طلبات الانتظار",
    icon: ClockIcon,
    href: "/admin/bookings",
    color: "text-[#C9973A]",
    bg: "bg-[#C9973A]/8 hover:bg-[#C9973A]/16",
    border: "border-[#C9973A]/20",
  },
  {
    label: "إدارة المناسبات",
    icon: HeartHandshakeIcon,
    href: "/admin/events",
    color: "text-[#6B5E52]",
    bg: "bg-[#6B5E52]/8 hover:bg-[#6B5E52]/16",
    border: "border-[#6B5E52]/20",
  },
  {
    label: "عرض الموقع",
    icon: ExternalLinkIcon,
    href: "/",
    external: true,
    color: "text-[#4A4038]",
    bg: "bg-[#4A4038]/6 hover:bg-[#4A4038]/12",
    border: "border-[#4A4038]/15",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "صباح الخير"
  if (h < 18) return "مساء الخير"
  return "مساء النور"
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function relativeTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return "الآن"
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`
  if (diff < 7 * 86400) return `منذ ${Math.floor(diff / 86400)} يوم`
  return formatArabicDate(dateStr)
}

// ─── Stat card ───────────────────────────────────────────────────────────────

export function StatCard({
  stat,
  value,
}: {
  stat: (typeof statConfig)[number]
  value: number
}) {
  return (
    <Card
      className={cn(
        "border bg-[#FAF8F3] shadow-sm hover:shadow-md transition-shadow duration-200",
        stat.border
      )}
    >
      <CardHeader className="flex flex-row-reverse items-center justify-between pb-2 pt-4 px-4 md:px-5">
        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
          <stat.icon className={cn("size-4 md:size-5", stat.color)} />
        </div>
        <CardTitle className="font-cairo text-xs md:text-sm font-medium text-[#6B5E52] text-right">
          {stat.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-5 pb-4 md:pb-5">
        <p
          className={cn("text-3xl md:text-4xl font-bold", stat.color)}
          style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Stat card skeleton ──────────────────────────────────────────────────────

function StatCardSkeleton({ stat }: { stat: (typeof statConfig)[number] }) {
  return (
    <Card className={cn("border bg-[#FAF8F3] shadow-sm", stat.border)}>
      <CardHeader className="flex flex-row-reverse items-center justify-between pb-2 pt-4 px-4 md:px-5">
        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
          <Skeleton className="size-4 md:size-5 rounded" />
        </div>
        <Skeleton className="h-3.5 w-28 rounded" />
      </CardHeader>
      <CardContent className="px-4 md:px-5 pb-4 md:pb-5">
        <Skeleton className="h-9 w-16 rounded" />
      </CardContent>
    </Card>
  )
}

// ─── Recent requests panel ───────────────────────────────────────────────────

function RecentRequestsPanel({ requests }: { requests: EventRequest[] }) {
  const newRequests = requests.filter((r) => r.status === RequestStatus.NEW)

  return (
    <Card className="border border-[#E5DDD0] bg-[#FAF8F3] shadow-sm flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-[#E5DDD0]/60">
        <div className="flex items-center justify-between">
          <CardTitle className="font-cairo text-sm font-semibold text-[#1A1714] flex items-center gap-2">
            طلبات التسجيل الجديدة
            <ClipboardListIcon className="size-4 text-[#6B5E52]" />
          </CardTitle>
          <Link
            href="/admin/bookings"
            className="font-cairo text-xs text-[#8B1A1A] hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeftIcon className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0 flex-1">
        {newRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <ClipboardListIcon className="size-8 text-[#D0C4B0] mb-2" />
            <p className="font-cairo text-sm text-[#A09080]">لا توجد طلبات حجز جديدة حالياً</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5DDD0]/50">
            {newRequests.map((req) => {
              const isPending = req.status === RequestStatus.NEW
              const statusMeta = REQUEST_STATUS_LABELS[req.status]
              return (
                <div
                  key={req.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F3EDE3]/40",
                    isPending && "border-r-2 border-r-[#C9973A] bg-[#C9973A]/3"
                  )}
                >
                  {/* Avatar initial */}
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 font-cairo font-bold text-sm",
                    isPending ? "bg-[#C9973A]/15 text-[#9E6E1A]" : "bg-[#E5DDD0] text-[#6B5E52]"
                  )}>
                    {req.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-cairo text-sm font-medium text-[#1A1714] truncate">
                      {req.name}
                    </p>
                    <p className="font-cairo text-xs text-[#A09080] truncate">
                      {req.preferredDate ? formatArabicDate(req.preferredDate) : "بدون تاريخ"}
                      {req.venue ? ` • ${req.venue}` : ""}
                    </p>
                  </div>

                  {/* Right side: status + time */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge className={cn("text-[10px] h-4.5 px-1.5 rounded-md font-cairo border-0", statusMeta?.className)}>
                      {statusMeta?.label ?? req.status}
                    </Badge>
                    <span className="font-cairo text-[10px] text-[#B0A090]">
                      {relativeTime(req.createdAt)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function RecentRequestsSkeleton() {
  return (
    <Card className="border border-[#E5DDD0] bg-[#FAF8F3] shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-[#E5DDD0]/60">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-[#E5DDD0]/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5 text-right">
                <Skeleton className="h-3.5 w-32 rounded ml-auto" />
                <Skeleton className="h-3 w-48 rounded ml-auto" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-3 w-10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Upcoming events timeline ─────────────────────────────────────────────────

function UpcomingTimeline({ events }: { events: Event[] }) {
  return (
    <Card className="border border-[#E5DDD0] bg-[#FAF8F3] shadow-sm flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-[#E5DDD0]/60">
        <div className="flex items-center justify-between">
          <CardTitle className="font-cairo text-sm font-semibold text-[#1A1714] flex items-center gap-2">
            المناسبات القادمة
            <CalendarDaysIcon className="size-4 text-[#C9973A]" />
          </CardTitle>
          <Link
            href="/admin/events"
            className="font-cairo text-xs text-[#8B1A1A] hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeftIcon className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-5 py-3 flex-1">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDaysIcon className="size-8 text-[#D0C4B0] mb-2" />
            <p className="font-cairo text-sm text-[#A09080]">لا توجد مناسبات قادمة</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#C9973A]/30 via-[#E5DDD0] to-transparent" />
            <div className="space-y-1">
              {events.map((ev, idx) => {
                const days = daysUntil(ev.eventDate)
                const isToday = days === 0
                const isSoon = days <= 7 && days > 0
                return (
                  <div key={ev.id} className="flex items-start gap-3 py-2.5 relative">
                    {/* Date dot */}
                    <div className={cn(
                      "flex flex-col items-center justify-center size-10 rounded-xl shrink-0 text-center z-10",
                      isToday
                        ? "bg-[#8B1A1A] text-[#FAF8F3]"
                        : isSoon
                          ? "bg-[#C9973A]/15 text-[#9E6E1A] border border-[#C9973A]/30"
                          : "bg-[#F3EDE3] text-[#6B5E52] border border-[#E5DDD0]"
                    )}>
                      <span className="text-[11px] font-bold leading-none font-cairo">
                        {new Date(ev.eventDate).getDate()}
                      </span>
                      <span className="text-[9px] leading-none font-cairo mt-0.5">
                        {new Date(ev.eventDate).toLocaleString("ar", { month: "short" })}
                      </span>
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0 pt-0.5 text-right">
                      <p className="font-cairo text-sm font-medium text-[#1A1714] truncate">
                        {ev.groomName}
                      </p>
                      <p className="font-cairo text-xs text-[#A09080] truncate">
                        {ev.tribe}{ev.venue ? ` • ${ev.venue}` : ""}
                      </p>
                    </div>

                    {/* Days badge */}
                    <div className="shrink-0 pt-1">
                      {isToday ? (
                        <span className="font-cairo text-[10px] font-bold text-[#8B1A1A] bg-[#8B1A1A]/10 px-2 py-0.5 rounded-full">
                          اليوم
                        </span>
                      ) : (
                        <span className={cn(
                          "font-cairo text-[10px] px-2 py-0.5 rounded-full",
                          isSoon
                            ? "text-[#9E6E1A] bg-[#C9973A]/10"
                            : "text-[#A09080] bg-[#F3EDE3]"
                        )}>
                          {days === 1 ? "غداً" : `${days} يوم`}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TimelineSkeleton() {
  return (
    <Card className="border border-[#E5DDD0] bg-[#FAF8F3] shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-[#E5DDD0]/60">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>
      </CardHeader>
      <CardContent className="px-4 py-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-2">
            <Skeleton className="size-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5 text-right">
              <Skeleton className="h-3.5 w-40 rounded ml-auto" />
              <Skeleton className="h-3 w-28 rounded ml-auto" />
            </div>
            <Skeleton className="h-4 w-12 rounded-full mt-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendarPanel({ events }: { events: Event[] }) {
  const [month, setMonth] = useState<Date>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogDay, setDialogDay] = useState<Date | undefined>(undefined)

  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  const eventsThisMonth = events.filter((w) => {
    const d = new Date(w.eventDate)
    return d.getFullYear() === year && d.getMonth() === monthIndex
  })

  const weddingDays = events.map((w) => new Date(w.eventDate))

  const dialogWeddings = dialogDay
    ? events.filter(
        (w) => new Date(w.eventDate).toDateString() === dialogDay.toDateString()
      )
    : []

  return (
    <>
      <div className="bg-[#FAF8F3] rounded-2xl border border-[#E5DDD0] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="pb-3 pt-4 px-4 md:px-5 border-b border-[#E5DDD0]/60 flex items-center justify-between">
          <CardTitle className="font-cairo text-sm font-semibold text-[#1A1714] flex items-center gap-2">
            تقويم المناسبات
            <CalendarDaysIcon className="size-4 text-[#8B1A1A]" />
          </CardTitle>
          <Link
            href="/admin/events"
            className="font-cairo text-xs text-[#8B1A1A] hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeftIcon className="size-3" />
          </Link>
        </div>

        {/* Calendar matching public page */}
        <Calendar
          mode="single"
          selected={undefined}
          onSelect={(day) => {
            if (!day) return
            const hasWedding = events.some(
              (w) => new Date(w.eventDate).toDateString() === day.toDateString()
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
          className="w-full font-cairo [--cell-size:--spacing(10)] md:[--cell-size:--spacing(11)] p-4 md:p-6"
          classNames={{
            root: "w-full",
            months: "w-full relative",
            month: "w-full",
            caption_label:
              "font-bold text-[#1A1714] text-lg tracking-wide flex items-center gap-1 [&>svg]:size-4",
            month_caption:
              "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
            dropdowns:
              "flex h-(--cell-size) w-full items-center justify-center gap-2 font-bold text-[#1A1714] text-sm md:text-base",
            button_previous:
              "size-(--cell-size) p-0 select-none rounded-full border border-[#E5DDD0] text-[#6B5E52] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
            button_next:
              "size-(--cell-size) p-0 select-none rounded-full border border-[#E5DDD0] text-[#6B5E52] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
            weekday:
              "font-cairo text-xs font-semibold text-[#A09080] py-3",
            weekdays: "border-b border-[#E5DDD0]",
            week: "mt-0",
            day: "border-b border-r border-[#E5DDD0]/50 rounded-none p-0 aspect-auto",
            month_grid: "w-full border-collapse",
          }}
        />

        {/* Legend */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E5DDD0]/50 text-[#A09080] font-cairo text-xs">
          <span className="w-2 h-2 rounded-full bg-[#8B1A1A] inline-block" />
          <span>يوم به مناسبة</span>
        </div>

        {/* Event list for selected/current month */}
        {eventsThisMonth.length > 0 && (
          <div className="border-t border-[#E5DDD0]/60 p-4 md:p-6 space-y-3">
            <p className="font-cairo text-sm font-semibold text-[#6B5E52] text-right">
              {`مناسبات شهر ${arabicMonths[monthIndex]}`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eventsThisMonth.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-4 bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl px-4 py-3 hover:border-[#8B1A1A]/30 transition-colors"
                  style={{ boxShadow: "0 1px 8px rgba(26,23,20,0.04)" }}
                >
                  <div className="w-9 h-9 rounded-full bg-[#C9973A] flex items-center justify-center shrink-0 shadow-sm shadow-[#C9973A]/25">
                    <span className="font-cairo font-bold text-xs text-[#FAF8F3]">
                      {new Date(w.eventDate).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-cairo font-bold text-sm text-[#1A1714] truncate">
                      {w.groomName}
                    </p>
                    <p className="font-cairo text-xs text-[#C9973A] font-medium truncate">
                      {w.tribe}{w.venue ? ` • ${w.venue}` : ""}
                    </p>
                  </div>
                  <p className="font-cairo text-xs text-[#A09080] shrink-0">
                    {formatArabicDate(w.eventDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {eventsThisMonth.length === 0 && (
          <p className="text-center font-cairo text-[#A09080] text-sm py-6 border-t border-[#E5DDD0]/60">
            لا توجد مناسبات مسجلة في هذا الشهر
          </p>
        )}
      </div>

      {/* Dialog for selected day's events */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="font-cairo max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo text-[#1A1714]">
              {dialogDay
                ? `مناسبات يوم ${dialogDay.getDate()} ${arabicMonths[dialogDay.getMonth()]}`
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {dialogWeddings.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl px-5 py-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#C9973A] flex items-center justify-center shrink-0 shadow-sm shadow-[#C9973A]/25">
                  <span className="font-cairo font-bold text-sm text-[#FAF8F3]">
                    {new Date(w.eventDate).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-cairo font-bold text-sm text-[#1A1714]">
                    {w.groomName}
                  </p>
                  <p className="font-cairo text-xs text-[#C9973A] font-medium">
                    {w.tribe}{w.venue ? ` • ${w.venue}` : ""}
                  </p>
                </div>
                <p className="font-cairo text-xs text-[#A09080] shrink-0">
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

function CalendarSkeleton() {
  return (
    <Card className="border border-[#E5DDD0] bg-[#FAF8F3] shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-[#E5DDD0]/60">
        <Skeleton className="h-4 w-36 rounded ml-auto" />
      </CardHeader>
      <CardContent className="px-4 py-6">
        <Skeleton className="h-80 w-full rounded-xl" />
      </CardContent>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getDashboardDataAction()
      .then(setData)
      .finally(() => setIsLoading(false))
  }, [])

  const stats = data?.stats ?? null
  const recentRequests = data?.recentRequests ?? []
  const upcomingEventsList = data?.upcomingEventsList ?? []
  const allEvents = data?.allEvents ?? upcomingEventsList

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Page heading ── */}
      <div>
        <p className="text-[#8B1A1A] font-cairo text-xs font-semibold tracking-widest mb-1 uppercase">
          Dashboard
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1714]"
          style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
        >
          نظرة عامة
        </h1>
        <p className="font-cairo text-sm text-[#A09080] mt-1">
          {getGreeting()} — ملخص المناسبات وطلبات الحجز المسجلة
        </p>
      </div>

      {/* ── Stat cards grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {isLoading
          ? statConfig.map((stat) => (
            <StatCardSkeleton key={stat.key} stat={stat} />
          ))
          : statConfig.map((stat) => (
            <StatCard key={stat.key} stat={stat} value={stats![stat.key]} />
          ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="font-cairo text-xs font-semibold text-[#A09080] tracking-widest uppercase mb-3">
          إجراءات سريعة
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              className={cn(
                "group flex flex-col items-center justify-center gap-2.5 rounded-2xl border px-4 py-5",
                "transition-all duration-200 active:scale-95",
                action.bg,
                action.border
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-xl transition-transform duration-200 group-hover:scale-110",
                  action.bg.split(" ")[0]
                )}
              >
                <action.icon className={cn("size-5", action.color)} />
              </div>
              <span className={cn("font-cairo text-sm font-medium", action.color)}>
                {action.label}
              </span>
              <ArrowLeftIcon
                className={cn(
                  "size-3.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200",
                  action.color
                )}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent requests + Upcoming timeline (2-col on lg+) ── */}
      <div>
        <p className="font-cairo text-xs font-semibold text-[#A09080] tracking-widest uppercase mb-3">
          لمحة سريعة
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <RecentRequestsSkeleton />
              <TimelineSkeleton />
            </>
          ) : (
            <>
              <RecentRequestsPanel requests={recentRequests} />
              <UpcomingTimeline events={upcomingEventsList} />
            </>
          )}
        </div>
      </div>

      {/* ── Mini calendar (full-width) ── */}
      <div>
        <p className="font-cairo text-xs font-semibold text-[#A09080] tracking-widest uppercase mb-3">
          التقويم
        </p>
        {isLoading ? (
          <CalendarSkeleton />
        ) : (
          <MiniCalendarPanel events={allEvents} />
        )}
      </div>
    </div>
  )
}
