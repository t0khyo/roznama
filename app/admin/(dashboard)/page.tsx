"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarIcon, // Replaced HeartHandshakeIcon
  CalendarDaysIcon,
  ClipboardListIcon,
  CalendarClockIcon,
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
    icon: CalendarDaysIcon,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    key: "upcomingEvents" as keyof DashboardStats,
    label: "مناسبات قادمة",
    icon: CalendarDaysIcon,
    color: "text-ring",
    bg: "bg-ring/10",
    border: "border-ring/20",
  },
  {
    key: "totalBookings" as keyof DashboardStats,
    label: "طلبات التسجيل",
    icon: ClipboardListIcon,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    border: "border-chart-4/20",
  },
  {
    key: "pendingBookings" as keyof DashboardStats,
    label: "طلبات قيد الانتظار",
    icon: CalendarClockIcon,
    color: "text-primary",
    bg: "bg-primary/8",
    border: "border-primary/15",
  },
]

// ─── Quick actions config ────────────────────────────────────────────────────

const quickActions = [
  {
    label: "إضافة مناسبة",
    icon: PlusCircleIcon,
    href: "/admin/events",
    color: "text-primary",
    bg: "bg-primary/8 hover:bg-primary/16",
    border: "border-primary/20",
  },
  {
    label: "عرض الطلبات",
    icon: CalendarClockIcon,
    href: "/admin/bookings",
    color: "text-ring",
    bg: "bg-ring/8 hover:bg-ring/16",
    border: "border-ring/20",
  },
  {
    label: "إدارة المناسبات",
    icon: CalendarDaysIcon,
    href: "/admin/events",
    color: "text-chart-4",
    bg: "bg-chart-4/8 hover:bg-chart-4/16",
    border: "border-chart-4/20",
  },
  {
    label: "عرض الموقع",
    icon: ExternalLinkIcon,
    href: "/",
    external: true,
    color: "text-neutral-dark",
    bg: "bg-neutral-dark/6 hover:bg-neutral-dark/12",
    border: "border-neutral-dark/15",
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
        "border bg-background shadow-sm hover:shadow-md transition-shadow duration-200",
        stat.border
      )}
    >
      <CardHeader className="flex flex-row-reverse items-center justify-between p-2 pb-1 md:pb-2 md:pt-4 md:px-5 border-none">
        <div className={cn("p-1.5 md:p-2.5 rounded-md md:rounded-xl", stat.bg)}>
          <stat.icon className={cn("size-3 md:size-5", stat.color)} />
        </div>
        <CardTitle className="font-cairo text-[10px] md:text-sm font-medium text-chart-4 text-right leading-tight truncate px-1">
          {stat.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2 pt-0 md:px-5 md:pb-5">
        <p
          className={cn("text-xl md:text-4xl font-bold px-1", stat.color)}
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
    <Card className={cn("border bg-background shadow-sm", stat.border)}>
      <CardHeader className="flex flex-row-reverse items-center justify-between p-2 pb-1 md:pb-2 md:pt-4 md:px-5">
        <div className={cn("p-1.5 md:p-2.5 rounded-md md:rounded-xl", stat.bg)}>
          <Skeleton className="size-3 md:size-5 rounded" />
        </div>
        <Skeleton className="h-2.5 w-12 md:h-3.5 md:w-28 rounded mx-1" />
      </CardHeader>
      <CardContent className="px-2 pb-2 pt-0 md:px-5 md:pb-5">
        <Skeleton className="h-5 w-8 md:h-9 md:w-16 rounded mx-1" />
      </CardContent>
    </Card>
  )
}

// ─── Recent requests panel ───────────────────────────────────────────────────

function RecentRequestsPanel({ requests }: { requests: EventRequest[] }) {
  const newRequests = requests.filter((r) => r.status === RequestStatus.NEW)

  return (
    <Card className="border border-border bg-background shadow-sm flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="font-cairo text-sm font-semibold text-foreground flex items-center gap-2">
            طلبات التسجيل الجديدة
            <ClipboardListIcon className="size-4 text-chart-4" />
          </CardTitle>
          <Link
            href="/admin/bookings"
            className="font-cairo text-xs text-primary hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeftIcon className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0 flex-1">
        {newRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <ClipboardListIcon className="size-8 text-muted-icon mb-2" />
            <p className="font-cairo text-sm text-muted-foreground">لا توجد طلبات حجز جديدة حالياً</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {newRequests.map((req) => {
              const isPending = req.status === RequestStatus.NEW
              const statusMeta = REQUEST_STATUS_LABELS[req.status]
              return (
                <div
                  key={req.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40",
                    isPending && "border-r-2 border-r-ring bg-ring/3"
                  )}
                >
                  {/* Avatar initial */}
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0 font-cairo font-bold text-sm",
                    isPending ? "bg-ring/15 text-warning" : "bg-border text-chart-4"
                  )}>
                    {req.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-cairo text-sm font-medium text-foreground truncate">
                      {req.name}
                    </p>
                    <p className="font-cairo text-xs text-muted-foreground truncate">
                      {req.preferredDate ? formatArabicDate(req.preferredDate) : "بدون تاريخ"}
                      {req.venue ? ` • ${req.venue}` : ""}
                    </p>
                  </div>

                  {/* Right side: status + time */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge className={cn("text-[10px] h-4.5 px-1.5 rounded-md font-cairo border-0", statusMeta?.className)}>
                      {statusMeta?.label ?? req.status}
                    </Badge>
                    <span className="font-cairo text-[10px] text-muted-text-light">
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
    <Card className="border border-border bg-background shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-border/60">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-border/50">
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
    <Card className="border border-border bg-background shadow-sm flex flex-col">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="font-cairo text-sm font-semibold text-foreground flex items-center gap-2">
            المناسبات القادمة
            <CalendarDaysIcon className="size-4 text-ring" />
          </CardTitle>
          <Link
            href="/admin/events"
            className="font-cairo text-xs text-primary hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeftIcon className="size-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-5 py-3 flex-1">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDaysIcon className="size-8 text-muted-icon mb-2" />
            <p className="font-cairo text-sm text-muted-foreground">لا توجد مناسبات قادمة</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-[19px] top-[30px] bottom-[30px] w-px bg-gradient-to-b from-ring/30 via-border to-transparent z-0" />
            <div className="space-y-1 relative z-10">
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
                        ? "bg-primary text-background"
                        : isSoon
                          ? "bg-muted-surface text-warning border border-ring/30"
                          : "bg-secondary text-chart-4 border border-border"
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
                      <p className="font-cairo text-sm font-medium text-foreground truncate">
                        {ev.groomName}
                      </p>
                      <p className="font-cairo text-xs text-muted-foreground truncate">
                        {ev.tribe}{ev.venue ? ` • ${ev.venue}` : ""}
                      </p>
                    </div>

                    {/* Days badge */}
                    <div className="shrink-0 pt-1">
                      {isToday ? (
                        <span className="font-cairo text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          اليوم
                        </span>
                      ) : (
                        <span className={cn(
                          "font-cairo text-[10px] px-2 py-0.5 rounded-full",
                          isSoon
                            ? "text-warning bg-ring/10"
                            : "text-muted-foreground bg-secondary"
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
    <Card className="border border-border bg-background shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-border/60">
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
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="pb-3 pt-4 px-4 md:px-5 border-b border-border/60 flex items-center justify-between">
          <CardTitle className="font-cairo text-sm font-semibold text-foreground flex items-center gap-2">
            تقويم المناسبات
            <CalendarDaysIcon className="size-4 text-primary" />
          </CardTitle>
          <Link
            href="/admin/events"
            className="font-cairo text-xs text-primary hover:underline flex items-center gap-1"
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
              "font-bold text-foreground text-lg tracking-wide flex items-center gap-1 [&>svg]:size-4",
            month_caption:
              "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
            dropdowns:
              "flex h-(--cell-size) w-full items-center justify-center gap-2 font-bold text-foreground text-sm md:text-base",
            button_previous:
              "size-(--cell-size) p-0 select-none rounded-full border border-border text-chart-4 hover:border-primary hover:text-primary transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
            button_next:
              "size-(--cell-size) p-0 select-none rounded-full border border-border text-chart-4 hover:border-primary hover:text-primary transition-colors bg-transparent hover:bg-transparent inline-flex items-center justify-center z-10 [&>svg]:-scale-x-100",
            weekday:
              "font-cairo text-xs font-semibold text-muted-foreground py-3",
            weekdays: "border-b border-border",
            week: "mt-0",
            day: "border-b border-r border-border/50 rounded-none p-0 aspect-auto",
            month_grid: "w-full border-collapse",
          }}
        />

        {/* Legend */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 text-muted-foreground font-cairo text-xs">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          <span>يوم به مناسبة</span>
        </div>

        {/* Event list for selected/current month */}
        {eventsThisMonth.length > 0 && (
          <div className="border-t border-border/60 p-4 md:p-6 space-y-3">
            <p className="font-cairo text-sm font-semibold text-chart-4 text-right mb-4">
              {`مناسبات ${arabicMonths[monthIndex]}`}
            </p>
            <div className="space-y-0">
              {eventsThisMonth.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-4 px-2 py-4 border-b border-border hover:bg-border/10 transition-colors last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-md bg-ring flex items-center justify-center flex-shrink-0 shadow-sm shadow-ring/25">
                    <span className="font-cairo font-bold text-sm text-background">
                      {new Date(w.eventDate).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-cairo font-bold text-sm text-ring">
                      {w.tribe}
                    </p>
                    <p className="font-cairo text-xs text-muted-foreground font-medium leading-snug">
                      {w.groomName}{w.venue ? ` • ${w.venue}` : ""}
                    </p>
                  </div>
                  <p className="font-cairo text-xs text-muted-foreground flex-shrink-0">
                    {formatArabicDate(w.eventDate)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {eventsThisMonth.length === 0 && (
          <p className="text-center font-cairo text-muted-foreground text-sm py-6 border-t border-border/60">
            لا توجد مناسبات مسجلة في هذا الشهر
          </p>
        )}
      </div>

      {/* Dialog for selected day's events */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="font-cairo max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo text-foreground">
              {dialogDay
                ? `مناسبات يوم ${dialogDay.getDate()} ${arabicMonths[dialogDay.getMonth()]}`
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-0 mt-2">
            {dialogWeddings.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-4 px-2 py-4 border-b border-border hover:bg-border/10 transition-colors last:border-b-0"
              >
                <div className="w-10 h-10 rounded-md bg-ring flex items-center justify-center flex-shrink-0 shadow-sm shadow-ring/25">
                  <span className="font-cairo font-bold text-sm text-background">
                    {new Date(w.eventDate).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-cairo font-bold text-sm text-ring">
                    {w.tribe}
                  </p>
                  <p className="font-cairo text-xs text-muted-foreground font-medium leading-snug">
                    {w.groomName}{w.venue ? ` • ${w.venue}` : ""}
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

function CalendarSkeleton() {
  return (
    <Card className="border border-border bg-background shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 md:px-5 border-b border-border/60">
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
        <p className="text-primary font-cairo text-xs font-semibold tracking-widest mb-1 uppercase">
          Dashboard
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
        >
          نظرة عامة
        </h1>
        <p className="font-cairo text-sm text-muted-foreground mt-1">
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
        <p className="font-cairo text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
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
                "group flex flex-col items-center justify-center gap-1 md:gap-2.5 rounded-lg md:rounded-2xl border px-1 py-2 md:px-4 md:py-5",
                "transition-all duration-200 active:scale-95",
                action.bg,
                action.border
              )}
            >
              <div
                className={cn(
                  "p-1.5 md:p-3 rounded-md md:rounded-xl transition-transform duration-200 group-hover:scale-110",
                  action.bg.split(" ")[0]
                )}
              >
                <action.icon className={cn("size-3.5 md:size-5", action.color)} />
              </div>
              <span className={cn("font-cairo text-[10px] md:text-sm font-medium text-center leading-tight mt-0.5", action.color)}>
                {action.label}
              </span>
              <ArrowLeftIcon
                className={cn(
                  "hidden md:block size-3.5 opacity-0 group-hover:opacity-60 transition-opacity duration-200",
                  action.color
                )}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent requests + Upcoming timeline (2-col on lg+) ── */}
      <div>
        <p className="font-cairo text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
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
        <p className="font-cairo text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
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
