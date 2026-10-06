"use client"

import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  XIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Loader2Icon,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa6"
import { RequestStatus, type EventRequest, REQUEST_STATUS_LABELS } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"
import { formatWhatsAppUrl } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface BookingsTableProps {
  bookings: EventRequest[]
  isLoading?: boolean
  onStatusChange: (id: string, status: RequestStatus) => Promise<void>
}

type SortKey = "name" | "phone" | "preferredDate" | "venue" | "createdAt" | "status"
type SortDirection = "asc" | "desc"

export function BookingsTable({ bookings, isLoading, onStatusChange }: BookingsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showRejected, setShowRejected] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "createdAt",
    direction: "desc",
  })
  const [updatingState, setUpdatingState] = useState<{ id: string; status: RequestStatus } | null>(null)

  const rejectedCount = useMemo(
    () => bookings.filter((b) => b.status === RequestStatus.CLOSED).length,
    [bookings]
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

  const filteredAndSortedBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = bookings.filter((b) => {
      if (!showRejected && b.status === RequestStatus.CLOSED) {
        return false
      }
      if (!query) return true
      const name = (b.name || "").toLowerCase()
      const phone = (b.phone || "").toLowerCase()
      const venue = (b.venue || "").toLowerCase()
      const statusLabel = (REQUEST_STATUS_LABELS[b.status]?.label || "").toLowerCase()

      return (
        name.includes(query) ||
        phone.includes(query) ||
        venue.includes(query) ||
        statusLabel.includes(query)
      )
    })

    return filtered.sort((a, b) => {
      const { key, direction } = sortConfig
      let comparison = 0

      if (key === "name") {
        comparison = (a.name || "").localeCompare(b.name || "", "ar")
      } else if (key === "phone") {
        comparison = (a.phone || "").localeCompare(b.phone || "")
      } else if (key === "preferredDate") {
        const timeA = a.preferredDate ? new Date(a.preferredDate).getTime() : 0
        const timeB = b.preferredDate ? new Date(b.preferredDate).getTime() : 0
        comparison = timeA - timeB
      } else if (key === "venue") {
        comparison = (a.venue || "").localeCompare(b.venue || "", "ar")
      } else if (key === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (key === "status") {
        comparison = (a.status || "").localeCompare(b.status || "")
      }

      return direction === "asc" ? comparison : -comparison
    })
  }, [bookings, searchQuery, sortConfig, showRejected])

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
              placeholder="بحث بالاسم، رقم الهاتف، أو المكان..."
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
              id="show-rejected"
              checked={showRejected}
              onCheckedChange={setShowRejected}
              className="data-checked:bg-primary cursor-pointer"
            />
            <Label
              htmlFor="show-rejected"
              className="font-cairo text-xs text-muted-foreground cursor-pointer select-none flex items-center gap-1.5"
            >
              <span>عرض المرفوض</span>
              {rejectedCount > 0 && (
                <span className="text-[10px] bg-border text-muted-foreground px-1.5 py-0.5 rounded-full tabular-nums">
                  {rejectedCount}
                </span>
              )}
            </Label>
          </div>
        </div>

        <div className="text-xs font-cairo text-muted-foreground shrink-0 self-end sm:self-center">
          {filteredAndSortedBookings.length} من {bookings.length} طلب
        </div>
      </div>

      {/* ── Table View ── */}
      <div className="overflow-x-auto">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="border-border bg-secondary/60 hover:bg-secondary/60">
              <TableHead
                onClick={() => handleSort("name")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>الاسم</span>
                  {renderSortIcon("name")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("phone")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>الهاتف</span>
                  {renderSortIcon("phone")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("preferredDate")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>تاريخ المناسبة</span>
                  {renderSortIcon("preferredDate")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("venue")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>المكان</span>
                  {renderSortIcon("venue")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("createdAt")}
                className="font-cairo font-semibold text-muted-foreground text-sm text-right cursor-pointer select-none hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>تاريخ الطلب</span>
                  {renderSortIcon("createdAt")}
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

              <TableHead className="w-[120px] font-cairo font-semibold text-muted-foreground text-sm text-center">
                الإجراءات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-full rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filteredAndSortedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center font-cairo text-muted-foreground text-sm">
                  {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد طلبات حجز"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedBookings.map((b) => {
                const effectiveStatus = updatingState?.id === b.id ? updatingState.status : b.status
                const sc = REQUEST_STATUS_LABELS[effectiveStatus] ?? REQUEST_STATUS_LABELS.NEW
                return (
                  <TableRow
                    key={b.id}
                    className="border-border hover:bg-secondary/40 transition-colors"
                  >
                    <TableCell className="font-cairo font-semibold text-foreground text-sm min-w-[150px] max-w-[250px] break-words whitespace-normal leading-snug">
                      {b.name}
                    </TableCell>
                    <TableCell className="font-cairo text-sm text-right">
                      <div className="flex items-center gap-2 justify-start">
                        <span className="text-foreground font-medium tabular-nums" dir="ltr">
                          {b.phone}
                        </span>
                        <a
                          href={formatWhatsAppUrl(b.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white dark:border-emerald-500/30 transition-all shadow-2xs hover:scale-105 shrink-0"
                          title="مراسلة عبر واتساب"
                          aria-label={`مراسلة ${b.name} عبر واتساب`}
                        >
                          <FaWhatsapp className="size-3.5" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="font-cairo text-foreground/90 text-sm tabular-nums">
                      {b.preferredDate
                        ? formatArabicDate(new Date(b.preferredDate).toISOString())
                        : "—"}
                    </TableCell>
                    <TableCell className="font-cairo text-foreground/90 text-sm min-w-[150px] max-w-[250px] break-words whitespace-normal leading-snug">
                      {b.venue ?? "—"}
                    </TableCell>
                    <TableCell className="font-cairo text-muted-foreground text-xs tabular-nums">
                      {new Date(b.createdAt).toLocaleDateString("ar-KW", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {updatingState?.id === b.id ? (
                        <div className="flex h-[22px] items-center justify-center">
                          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <Badge className={sc.className}>{sc.label}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 justify-center">
                        {/* جديد (New) */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={async () => {
                            if (effectiveStatus === RequestStatus.NEW) return
                            setUpdatingState({ id: b.id, status: RequestStatus.NEW })
                            try {
                              await onStatusChange(b.id, RequestStatus.NEW)
                            } finally {
                              setUpdatingState(null)
                            }
                          }}
                          disabled={effectiveStatus === RequestStatus.NEW || !!updatingState}
                          title="تعيين كـ جديد"
                          aria-label="جديد"
                          className={cn(
                            "size-7 rounded-lg transition-all",
                            effectiveStatus === RequestStatus.NEW
                              ? "bg-ring/20 text-warning border border-ring/40 dark:bg-ring/15 dark:text-ring dark:border-ring/30 cursor-default opacity-100 shadow-2xs"
                              : "text-muted-foreground hover:text-ring hover:bg-ring/10 border border-transparent hover:border-ring/25"
                          )}
                        >
                          <ClockIcon className="size-3.5" />
                        </Button>

                        {/* منشور (Published) */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={async () => {
                            if (effectiveStatus === RequestStatus.PUBLISHED) return
                            setUpdatingState({ id: b.id, status: RequestStatus.PUBLISHED })
                            try {
                              await onStatusChange(b.id, RequestStatus.PUBLISHED)
                            } finally {
                              setUpdatingState(null)
                            }
                          }}
                          disabled={effectiveStatus === RequestStatus.PUBLISHED || !!updatingState}
                          title="تعيين كـ منشور"
                          aria-label="منشور"
                          className={cn(
                            "size-7 rounded-lg transition-all",
                            effectiveStatus === RequestStatus.PUBLISHED
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 cursor-default opacity-100 shadow-2xs"
                              : "text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 dark:hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:border-emerald-500/20"
                          )}
                        >
                          <CheckCircle2Icon className="size-3.5" />
                        </Button>

                        {/* مرفوض (Rejected) */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={async () => {
                            if (effectiveStatus === RequestStatus.CLOSED) return
                            setUpdatingState({ id: b.id, status: RequestStatus.CLOSED })
                            try {
                              await onStatusChange(b.id, RequestStatus.CLOSED)
                            } finally {
                              setUpdatingState(null)
                            }
                          }}
                          disabled={effectiveStatus === RequestStatus.CLOSED || !!updatingState}
                          title="تعيين كـ مرفوض"
                          aria-label="مرفوض"
                          className={cn(
                            "size-7 rounded-lg transition-all",
                            effectiveStatus === RequestStatus.CLOSED
                              ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 cursor-default opacity-100 shadow-2xs"
                              : "text-muted-foreground hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 dark:hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:border-red-500/20"
                          )}
                        >
                          <XCircleIcon className="size-3.5" />
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
