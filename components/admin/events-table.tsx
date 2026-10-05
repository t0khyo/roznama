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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Event } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"
import { Skeleton } from "@/components/ui/skeleton"

interface EventsTableProps {
  events: Event[]
  isLoading?: boolean
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
}

type SortKey = "tribe" | "groomName" | "eventDate" | "status"
type SortDirection = "asc" | "desc"

export function EventsTable({ events, isLoading, onEdit, onDelete }: EventsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFinished, setShowFinished] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "eventDate",
    direction: "asc",
  })

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const finishedCount = useMemo(
    () => events.filter((e) => new Date(e.eventDate) < today).length,
    [events, today]
  )

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
      <ArrowUpIcon className="size-3 text-[#9F3647] shrink-0" />
    ) : (
      <ArrowDownIcon className="size-3 text-[#9F3647] shrink-0" />
    )
  }

  // Filter and sort
  const filteredAndSortedEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = events.filter((e) => {
      if (!showFinished && new Date(e.eventDate) < today) {
        return false
      }
      if (!query) return true
      const tribe = (e.tribe || "").toLowerCase()
      const groom = (e.groomName || "").toLowerCase()
      const venue = (e.venue || "").toLowerCase()
      const dateFormatted = formatArabicDate(new Date(e.eventDate).toISOString()).toLowerCase()

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
  }, [events, searchQuery, sortConfig, today, showFinished])

  return (
    <div className="rounded-xl border border-[#E5DDD0] overflow-hidden bg-[#FAF8F3] shadow-sm">
      {/* ── Search & Filter Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 border-b border-[#E5DDD0] bg-[#F3EDE3]/40">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#A09080] pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالقبيلة، اسم المعرس، أو المكان..."
              className="font-cairo text-sm pr-9 pl-8 h-9 bg-[#FAF8F3] border-[#E5DDD0] focus:border-[#A8823A] placeholder:text-[#C0B4A8]"
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

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Switch
              id="show-finished"
              checked={showFinished}
              onCheckedChange={setShowFinished}
              className="data-checked:bg-[#9F3647] cursor-pointer"
            />
            <Label
              htmlFor="show-finished"
              className="font-cairo text-xs text-[#6B5E52] cursor-pointer select-none flex items-center gap-1.5"
            >
              <span>عرض المنتهي</span>
              {finishedCount > 0 && (
                <span className="text-[10px] bg-[#E5DDD0] text-[#6B5E52] px-1.5 py-0.5 rounded-full tabular-nums">
                  {finishedCount}
                </span>
              )}
            </Label>
          </div>
        </div>

        <div className="text-xs font-cairo text-[#7D6E63] shrink-0 self-end sm:self-center">
          {filteredAndSortedEvents.length} من {events.length} مناسبة
        </div>
      </div>

      {/* ── Mobile View: Cards Pattern (1 Column) ── */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`mobile-skeleton-${index}`}
                className="bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl p-3.5 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Skeleton className="size-16 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-14 rounded-full shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5DDD0]/60">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedEvents.length === 0 ? (
          <div className="p-8 text-center font-cairo text-[#A09080] text-sm">
            {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد مناسبات مسجلة"}
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {filteredAndSortedEvents.map((event) => {
              const isPast = new Date(event.eventDate) < today
              return (
                <div
                  key={`mobile-${event.id}`}
                  className="bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl p-3.5 space-y-3 shadow-2xs hover:border-[#A8823A]/60 transition-all"
                >
                  {/* Card Header: Thumbnail, Event details & Status badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Image Thumbnail */}
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={`دعوة ${event.tribe}`}
                          className="size-16 rounded-xl object-cover border border-[#E5DDD0] shrink-0"
                        />
                      ) : (
                        <div className="size-16 rounded-xl bg-[#F3EDE3] border border-[#E5DDD0] flex items-center justify-center font-cairo text-xs text-[#A09080] shrink-0">
                          بدون صورة
                        </div>
                      )}

                      {/* Text info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-cairo font-bold text-[#1A1714] text-sm truncate">
                          {event.tribe}
                        </h3>
                        <p
                          className="font-cairo text-[#4A4038] text-xs line-clamp-1 mt-0.5"
                          title={event.groomName}
                        >
                          {event.groomName}
                        </p>
                        <p className="font-cairo text-[#A09080] text-[11px] tabular-nums mt-0.5">
                          {formatArabicDate(new Date(event.eventDate).toISOString())}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={
                        isPast
                          ? "bg-[#E5DDD0] text-[#6B5E52] hover:bg-[#E5DDD0] font-cairo text-xs shrink-0"
                          : "bg-[#9F3647]/10 text-[#9F3647] hover:bg-[#9F3647]/10 border border-[#9F3647]/20 font-cairo text-xs shrink-0"
                      }
                    >
                      {isPast ? "انتهى" : "قادم"}
                    </Badge>
                  </div>

                  {/* Venue box if exists */}
                  {event.venue && (
                    <div className="bg-[#F3EDE3]/40 px-3 py-2 rounded-lg border border-[#E5DDD0]/60 text-xs font-cairo flex items-center justify-between">
                      <span className="text-[#7D6E63]">المكان:</span>
                      <span className="text-[#1A1714] font-medium truncate max-w-[220px]">
                        {event.venue}
                      </span>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5DDD0]/60">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(event)}
                      className="font-cairo text-xs h-8 px-3 gap-1.5 border-[#E5DDD0] text-[#6B5E52] hover:text-[#9F3647] hover:bg-[#9F3647]/10 hover:border-[#9F3647]/30 rounded-lg transition-all"
                    >
                      <PencilIcon className="size-3.5" />
                      <span>تعديل</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(event)}
                      className="font-cairo text-xs h-8 px-3 gap-1.5 border-[#E5DDD0] text-[#6B5E52] hover:text-red-700 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all"
                    >
                      <Trash2Icon className="size-3.5" />
                      <span>حذف</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Desktop View: Table ── */}
      <div className="hidden md:block">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="border-[#E5DDD0] bg-[#F3EDE3]/60 hover:bg-[#F3EDE3]/60">
              <TableHead
                onClick={() => handleSort("tribe")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#9F3647] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>القبيلة</span>
                  {renderSortIcon("tribe")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("groomName")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#9F3647] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>اسم المعرس</span>
                  {renderSortIcon("groomName")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("eventDate")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#9F3647] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>التاريخ</span>
                  {renderSortIcon("eventDate")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("status")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#9F3647] transition-colors"
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filteredAndSortedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center font-cairo text-[#A09080] text-sm">
                  {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد مناسبات مسجلة"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedEvents.map((event) => {
                const isPast = new Date(event.eventDate) < today
                return (
                  <TableRow
                    key={event.id}
                    className="border-[#E5DDD0] hover:bg-[#F3EDE3]/40 transition-colors"
                  >
                    <TableCell className="font-cairo font-semibold text-[#1A1714] text-sm">
                      {event.tribe}
                    </TableCell>
                    <TableCell className="font-cairo text-[#4A4038] text-sm">
                      {event.groomName}
                    </TableCell>
                    <TableCell className="font-cairo text-[#4A4038] text-sm tabular-nums">
                      {formatArabicDate(new Date(event.eventDate).toISOString())}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isPast
                            ? "bg-[#E5DDD0] text-[#6B5E52] hover:bg-[#E5DDD0] font-cairo text-xs"
                            : "bg-[#9F3647]/10 text-[#9F3647] hover:bg-[#9F3647]/10 border border-[#9F3647]/20 font-cairo text-xs"
                        }
                      >
                        {isPast ? "انتهى" : "قادم"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={`دعوة ${event.tribe}`}
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
                          onClick={() => onEdit(event)}
                          className="size-7 text-[#6B5E52] hover:text-[#9F3647] hover:bg-[#9F3647]/8 transition-colors"
                          aria-label="تعديل"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(event)}
                          className="size-7 text-[#6B5E52] hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="حذف"
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
