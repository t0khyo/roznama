"use client"

import Image from "next/image"
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
      return <ArrowUpDownIcon className="size-3 text-muted-foreground/60 shrink-0" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="size-3 text-primary shrink-0" />
    ) : (
      <ArrowDownIcon className="size-3 text-primary shrink-0" />
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
    <div className="rounded-xl border border-border overflow-hidden bg-background shadow-sm">
      {/* ── Search & Filter Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 border-b border-border bg-secondary/40">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالقبيلة، اسم المعرس، أو المكان..."
              className="font-cairo text-sm pr-9 pl-8 h-9 bg-background border-border focus:border-ring placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
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
              className="data-checked:bg-primary cursor-pointer"
            />
            <Label
              htmlFor="show-finished"
              className="font-cairo text-xs text-muted-foreground cursor-pointer select-none flex items-center gap-1.5"
            >
              <span>عرض المنتهي</span>
              {finishedCount > 0 && (
                <span className="text-[10px] bg-border text-muted-foreground px-1.5 py-0.5 rounded-full tabular-nums">
                  {finishedCount}
                </span>
              )}
            </Label>
          </div>
        </div>

        <div className="text-xs font-cairo text-muted-foreground shrink-0 self-end sm:self-center">
          {filteredAndSortedEvents.length} من {events.length} مناسبة
        </div>
      </div>

      {/* ── Table View ── */}
      <div className="overflow-x-auto">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="border-border bg-secondary/60 hover:bg-secondary/60">
              <TableHead
                onClick={() => handleSort("tribe")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>القبيلة</span>
                  {renderSortIcon("tribe")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("groomName")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>اسم المعرس</span>
                  {renderSortIcon("groomName")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("eventDate")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>التاريخ</span>
                  {renderSortIcon("eventDate")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("status")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>الحالة</span>
                  {renderSortIcon("status")}
                </div>
              </TableHead>

              <TableHead className="font-cairo font-semibold text-muted-foreground text-sm text-right">
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
                <TableCell colSpan={6} className="h-32 text-center font-cairo text-muted-foreground text-sm">
                  {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد مناسبات مسجلة"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedEvents.map((event) => {
                const isPast = new Date(event.eventDate) < today
                return (
                  <TableRow
                    key={event.id}
                    className="border-border hover:bg-secondary/40 transition-colors"
                  >
                    <TableCell className="font-cairo font-semibold text-foreground text-sm min-w-[120px] max-w-[200px] break-words whitespace-normal leading-snug">
                      {event.tribe}
                    </TableCell>
                    <TableCell className="font-cairo text-foreground/90 text-sm min-w-[150px] max-w-[250px] break-words whitespace-normal leading-snug">
                      {event.groomName}
                    </TableCell>
                    <TableCell className="font-cairo text-foreground/90 text-sm tabular-nums">
                      {formatArabicDate(new Date(event.eventDate).toISOString())}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isPast
                            ? "bg-border text-chart-4 hover:bg-border font-cairo text-xs"
                            : "bg-primary/10 text-primary hover:bg-primary/10 border border-primary/20 font-cairo text-xs"
                        }
                      >
                        {isPast ? "انتهى" : "قادم"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={`دعوة ${event.tribe}`}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <span className="text-muted-foreground font-cairo text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(event)}
                          className="size-7 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          aria-label="تعديل"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(event)}
                          className="size-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
