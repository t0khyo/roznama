"use client"

import { useEffect, useState } from "react"
import {
  HeartHandshakeIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  ClockIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStats } from "@/lib/data/stats"
import { getDashboardStatsAction } from "@/app/admin/actions"
import { cn } from "@/lib/utils"

const statConfig = [
  {
    key: "totalWeddings" as keyof DashboardStats,
    label: "إجمالي المناسبات",
    icon: HeartHandshakeIcon,
    color: "text-[#8B1A1A]",
    bg: "bg-[#8B1A1A]/10",
    border: "border-[#8B1A1A]/20",
  },
  {
    key: "upcomingWeddings" as keyof DashboardStats,
    label: "مناسبات قادمة",
    icon: CalendarDaysIcon,
    color: "text-[#C9973A]",
    bg: "bg-[#C9973A]/10",
    border: "border-[#C9973A]/20",
  },
  {
    key: "totalBookings" as keyof DashboardStats,
    label: "إجمالي طلبات الحجز",
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
      <CardHeader className="flex flex-row-reverse items-center justify-between pb-2 pt-4 px-5">
        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
          <stat.icon className={cn("size-5", stat.color)} />
        </div>
        <CardTitle className="font-cairo text-sm font-medium text-[#6B5E52]">
          {stat.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p
          className={cn("text-4xl font-bold", stat.color)}
          style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStatsAction().then(setStats)
  }, [])

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page heading */}
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
          ملخص المناسبات وطلبات الحجز المسجلة
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statConfig.map((stat) => (
          <StatCard
            key={stat.key}
            stat={stat}
            value={stats ? stats[stat.key] : 0}
          />
        ))}
      </div>
    </div>
  )
}
