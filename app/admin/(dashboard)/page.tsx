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
import type { DashboardStats } from "@/lib/data/stats"
import { getDashboardStatsAction } from "@/app/admin/actions"
import { cn } from "@/lib/utils"

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
    label: "طلبات الحجز",
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

// ─── Helper: Arabic greeting ─────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "صباح الخير"
  if (h < 18) return "مساء الخير"
  return "مساء النور"
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
          style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
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
        {/* icon shimmer */}
        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
          <Skeleton className="size-4 md:size-5 rounded" />
        </div>
        {/* label shimmer */}
        <Skeleton className="h-3.5 w-28 rounded" />
      </CardHeader>
      <CardContent className="px-4 md:px-5 pb-4 md:pb-5">
        {/* number shimmer */}
        <Skeleton className="h-9 w-16 rounded" />
      </CardContent>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getDashboardStatsAction()
      .then(setStats)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-8 max-w-4xl">
      {/* ── Page heading ── */}
      <div>
        <p className="text-[#8B1A1A] font-cairo text-xs font-semibold tracking-widest mb-1 uppercase">
          Dashboard
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1714]"
          style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
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
                  action.bg.split(" ")[0]  // use the base bg without hover
                )}
              >
                <action.icon className={cn("size-5", action.color)} />
              </div>
              <span
                className={cn("font-cairo text-sm font-medium", action.color)}
              >
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
    </div>
  )
}
