"use client"

import { useMemo, useState } from "react"
import {
  PencilIcon,
  Trash2Icon,
  SearchIcon,
  XIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Event } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"

interface WeddingsTableProps {
  weddings: Event[]
  onEdit: (wedding: Event) => void
  onDelete: (wedding: Event) => void
}

type SortKey = "tribe" | "groomName" | "eventDate" | "status"
type SortDirection = "asc" | "desc"

export function WeddingsTable({ weddings, onEdit, onDelete }: WeddingsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "eventDate",
    direction: "asc",
  })

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDownIcon className="size-3 text-[#A09080]/60 shrink-0" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="size-3 text-[#8B1A1A] shrink-0" />
    ) : (
      <ArrowDownIcon className="size-3 text-[#8B1A1A] shrink-0" />
    )
  }

  // Filter and sort
  const filteredAndSortedWeddings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = weddings.filter((w) => {
      if (!query) return true
      const tribe = (w.tribe || "").toLowerCase()
      const groom = (w.groomName || "").toLowerCase()
      const venue = (w.venue || "").toLowerCase()
      const dateFormatted = formatArabicDate(new Date(w.eventDate).toISOString()).toLowerCase()

      return (
        tribe.includes(query) ||
        groom.includes(query) ||
        venue.includes(query) ||
        dateFormatted.includes(query)
      )
    })

    return filtered.sort((a, b) => {
      const { key, direction } = sortConfig
      let comparison = 0

      if (key === "tribe") {
        comparison = (a.tribe || "").localeCompare(b.tribe || "", "ar")
      } else if (key === "groomName") {
        comparison = (a.groomName || "").localeCompare(b.groomName || "", "ar")
      } else if (key === "eventDate") {
        comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      } else if (key === "status") {
        const aIsPast = new Date(a.eventDate) < today
        const bIsPast = new Date(b.eventDate) < today
        comparison = Number(aIsPast) - Number(bIsPast)
      }

      return direction === "asc" ? comparison : -comparison
    })
  }, [weddings, searchQuery, sortConfig, today])

  return (
    <div className="rounded-xl border border-[#E5DDD0] overflow-hidden bg-[#FAF8F3] shadow-sm">
      {/* ── Search & Filter Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 border-b border-[#E5DDD0] bg-[#F3EDE3]/40">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#A09080] pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالقبيلة، اسم المعرس، أو المكان..."
            className="font-cairo text-sm pr-9 pl-8 h-9 bg-[#FAF8F3] border-[#E5DDD0] focus:border-[#C9973A] placeholder:text-[#C0B4A8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A09080] hover:text-[#1A1714] p-0.5 rounded-full"
              title="مسح البحث"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs font-cairo text-[#7D6E63] shrink-0 self-end sm:self-center">
          {filteredAndSortedWeddings.length} من {weddings.length} مناسبة
        </div>
      </div>

      {/* ── Table ── */}
      <Table dir="rtl">
        <TableHeader>
          <TableRow className="border-[#E5DDD0] bg-[#F3EDE3]/60 hover:bg-[#F3EDE3]/60">
            <TableHead
              onClick={() => handleSort("tribe")}
              className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
            >
              <div className="flex items-center gap-1.5 justify-start">
                <span>القبيلة</span>
                {renderSortIcon("tribe")}
              </div>
            </TableHead>

            <TableHead
              onClick={() => handleSort("groomName")}
              className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
            >
              <div className="flex items-center gap-1.5 justify-start">
                <span>اسم المعرس</span>
                {renderSortIcon("groomName")}
              </div>
            </TableHead>

            <TableHead
              onClick={() => handleSort("eventDate")}
              className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
            >
              <div className="flex items-center gap-1.5 justify-start">
                <span>التاريخ</span>
                {renderSortIcon("eventDate")}
              </div>
            </TableHead>

            <TableHead
              onClick={() => handleSort("status")}
              className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
            >
              <div className="flex items-center gap-1.5 justify-start">
                <span>الحالة</span>
                {renderSortIcon("status")}
              </div>
            </TableHead>

            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">
              صورة الدعوة
            </TableHead>
            <TableHead className="w-[90px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedWeddings.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center font-cairo text-[#A09080] text-sm">
                {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد مناسبات مسجلة"}
              </TableCell>
            </TableRow>
          )}
          {filteredAndSortedWeddings.map((w) => {
            const isPast = new Date(w.eventDate) < today
            return (
              <TableRow
                key={w.id}
                className="border-[#E5DDD0] hover:bg-[#F3EDE3]/40 transition-colors"
              >
                <TableCell className="font-cairo font-semibold text-[#1A1714] text-sm">
                  {w.tribe}
                </TableCell>
                <TableCell className="font-cairo text-[#4A4038] text-sm">
                  {w.groomName}
                </TableCell>
                <TableCell className="font-cairo text-[#4A4038] text-sm tabular-nums">
                  {formatArabicDate(new Date(w.eventDate).toISOString())}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      isPast
                        ? "bg-[#E5DDD0] text-[#6B5E52] hover:bg-[#E5DDD0] font-cairo text-xs"
                        : "bg-[#8B1A1A]/10 text-[#8B1A1A] hover:bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 font-cairo text-xs"
                    }
                  >
                    {isPast ? "انتهى" : "قادم"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {w.imageUrl ? (
                    <img
                      src={w.imageUrl}
                      alt={`دعوة ${w.tribe}`}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E5DDD0]"
                    />
                  ) : (
                    <span className="text-[#A09080] font-cairo text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(w)}
                      className="size-7 text-[#6B5E52] hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/8 transition-colors"
                      aria-label="تعديل"
                    >
                      <PencilIcon className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(w)}
                      className="size-7 text-[#6B5E52] hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
