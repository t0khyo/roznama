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
      return <ArrowUpDownIcon className="size-3 text-[#A09080]/60 shrink-0" />
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="size-3 text-[#8B1A1A] shrink-0" />
    ) : (
      <ArrowDownIcon className="size-3 text-[#8B1A1A] shrink-0" />
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
              placeholder="بحث بالاسم، رقم الهاتف، أو المكان..."
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

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Switch
              id="show-rejected"
              checked={showRejected}
              onCheckedChange={setShowRejected}
              className="data-checked:bg-[#8B1A1A] cursor-pointer"
            />
            <Label
              htmlFor="show-rejected"
              className="font-cairo text-xs text-[#6B5E52] cursor-pointer select-none flex items-center gap-1.5"
            >
              <span>عرض المرفوض</span>
              {rejectedCount > 0 && (
                <span className="text-[10px] bg-[#E5DDD0] text-[#6B5E52] px-1.5 py-0.5 rounded-full tabular-nums">
                  {rejectedCount}
                </span>
              )}
            </Label>
          </div>
        </div>

        <div className="text-xs font-cairo text-[#7D6E63] shrink-0 self-end sm:self-center">
          {filteredAndSortedBookings.length} من {bookings.length} طلب
        </div>
      </div>

      {/* ── Mobile View: Cards Pattern ── */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`mobile-booking-skeleton-${index}`}
                className="bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl p-3.5 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 w-1/2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="p-2.5 rounded-lg border border-[#E5DDD0]/60 space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <Skeleton className="h-7 w-16 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedBookings.length === 0 ? (
          <div className="p-8 text-center font-cairo text-[#A09080] text-sm">
            {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد طلبات حجز"}
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {filteredAndSortedBookings.map((b) => {
              const sc = REQUEST_STATUS_LABELS[b.status] ?? REQUEST_STATUS_LABELS.NEW
              return (
                <div
                  key={`mobile-${b.id}`}
                  className="bg-[#FAF8F3] border border-[#E5DDD0] rounded-xl p-3.5 space-y-3 shadow-2xs hover:border-[#C9973A]/60 transition-all"
                >
                  {/* Card Header: Name, date & status badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-cairo font-bold text-[#1A1714] text-sm">
                        {b.name}
                      </h3>
                      <p className="font-cairo text-[11px] text-[#A09080] tabular-nums mt-0.5">
                        طُلب في {new Date(b.createdAt).toLocaleDateString("ar-KW", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={sc.className}>{sc.label}</Badge>
                  </div>

                  {/* Card Info Box */}
                  <div className="bg-[#F3EDE3]/40 p-2.5 rounded-lg border border-[#E5DDD0]/60 space-y-2 text-xs font-cairo">
                    {/* Phone + WhatsApp button */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#7D6E63]">الهاتف:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#1A1714] font-medium tabular-nums" dir="ltr">
                          {b.phone}
                        </span>
                        <a
                          href={formatWhatsAppUrl(b.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all shadow-2xs hover:scale-105 shrink-0"
                          title="مراسلة عبر واتساب"
                          aria-label={`مراسلة ${b.name} عبر واتساب`}
                        >
                          <FaWhatsapp className="size-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Preferred Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#7D6E63]">التاريخ المطلوب:</span>
                      <span className="text-[#1A1714] font-medium tabular-nums">
                        {b.preferredDate
                          ? formatArabicDate(new Date(b.preferredDate).toISOString())
                          : "—"}
                      </span>
                    </div>

                    {/* Venue */}
                    {b.venue && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#7D6E63]">المكان:</span>
                        <span className="text-[#1A1714] font-medium truncate max-w-[200px]">
                          {b.venue}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions: Status change */}
                  <div className="pt-2 border-t border-[#E5DDD0]/60">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {/* جديد */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(b.id, RequestStatus.NEW)}
                        disabled={b.status === RequestStatus.NEW}
                        title="تعيين كـ جديد"
                        className={cn(
                          "font-cairo text-xs h-7 px-2.5 gap-1 rounded-lg transition-all",
                          b.status === RequestStatus.NEW
                            ? "bg-[#C9973A]/20 text-[#9E6E1A] border-[#C9973A]/40 cursor-default opacity-100 font-semibold"
                            : "border-[#E5DDD0] text-[#6B5E52] hover:text-[#C9973A] hover:bg-[#C9973A]/10 hover:border-[#C9973A]/30"
                        )}
                      >
                        <ClockIcon className="size-3.5" />
                        <span>جديد</span>
                      </Button>

                      {/* منشور */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(b.id, RequestStatus.PUBLISHED)}
                        disabled={b.status === RequestStatus.PUBLISHED}
                        title="تعيين كـ منشور"
                        className={cn(
                          "font-cairo text-xs h-7 px-2.5 gap-1 rounded-lg transition-all",
                          b.status === RequestStatus.PUBLISHED
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 cursor-default opacity-100 font-semibold"
                            : "border-[#E5DDD0] text-[#6B5E52] hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200"
                        )}
                      >
                        <CheckCircle2Icon className="size-3.5" />
                        <span>نشر</span>
                      </Button>

                      {/* مرفوض */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onStatusChange(b.id, RequestStatus.CLOSED)}
                        disabled={b.status === RequestStatus.CLOSED}
                        title="تعيين كـ مرفوض"
                        className={cn(
                          "font-cairo text-xs h-7 px-2.5 gap-1 rounded-lg transition-all",
                          b.status === RequestStatus.CLOSED
                            ? "bg-red-100 text-red-800 border-red-300 cursor-default opacity-100 font-semibold"
                            : "border-[#E5DDD0] text-[#6B5E52] hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                        )}
                      >
                        <XCircleIcon className="size-3.5" />
                        <span>رفض</span>
                      </Button>
                    </div>
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
                onClick={() => handleSort("name")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>الاسم</span>
                  {renderSortIcon("name")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("phone")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>الهاتف</span>
                  {renderSortIcon("phone")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("preferredDate")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>تاريخ المناسبة</span>
                  {renderSortIcon("preferredDate")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("venue")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>المكان</span>
                  {renderSortIcon("venue")}
                </div>
              </TableHead>

              <TableHead
                onClick={() => handleSort("createdAt")}
                className="font-cairo font-semibold text-[#6B5E52] text-sm text-right cursor-pointer select-none hover:text-[#8B1A1A] transition-colors"
              >
                <div className="flex items-center gap-1.5 justify-start">
                  <span>تاريخ الطلب</span>
                  {renderSortIcon("createdAt")}
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

              <TableHead className="w-[120px] font-cairo font-semibold text-[#6B5E52] text-sm text-center">
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
                <TableCell colSpan={7} className="h-32 text-center font-cairo text-[#A09080] text-sm">
                  {searchQuery ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد طلبات حجز"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedBookings.map((b) => {
                const sc = REQUEST_STATUS_LABELS[b.status] ?? REQUEST_STATUS_LABELS.NEW
                return (
                  <TableRow
                    key={b.id}
                    className="border-[#E5DDD0] hover:bg-[#F3EDE3]/40 transition-colors"
                  >
                    <TableCell className="font-cairo font-semibold text-[#1A1714] text-sm">
                      {b.name}
                    </TableCell>
                    <TableCell className="font-cairo text-sm text-right">
                      <div className="flex items-center gap-2 justify-start">
                        <span className="text-[#1A1714] font-medium tabular-nums" dir="ltr">
                          {b.phone}
                        </span>
                        <a
                          href={formatWhatsAppUrl(b.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all shadow-2xs hover:scale-105 shrink-0"
                          title="مراسلة عبر واتساب"
                          aria-label={`مراسلة ${b.name} عبر واتساب`}
                        >
                          <FaWhatsapp className="size-3.5" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="font-cairo text-[#4A4038] text-sm tabular-nums">
                      {b.preferredDate
                        ? formatArabicDate(new Date(b.preferredDate).toISOString())
                        : "—"}
                    </TableCell>
                    <TableCell className="font-cairo text-[#4A4038] text-sm max-w-[180px] truncate">
                      {b.venue ?? "—"}
                    </TableCell>
                    <TableCell className="font-cairo text-[#A09080] text-xs tabular-nums">
                      {new Date(b.createdAt).toLocaleDateString("ar-KW", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={sc.className}>{sc.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 justify-center">
                        {/* جديد (New) */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onStatusChange(b.id, RequestStatus.NEW)}
                          disabled={b.status === RequestStatus.NEW}
                          title="تعيين كـ جديد"
                          aria-label="جديد"
                          className={cn(
                            "size-7 rounded-lg transition-all",
                            b.status === RequestStatus.NEW
                              ? "bg-[#C9973A]/20 text-[#9E6E1A] border border-[#C9973A]/40 cursor-default opacity-100 shadow-2xs"
                              : "text-[#A09080] hover:text-[#C9973A] hover:bg-[#C9973A]/10 border border-transparent hover:border-[#C9973A]/25"
                          )}
                        >
                          <ClockIcon className="size-3.5" />
                        </Button>

                        {/* منشور (Published) */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onStatusChange(b.id, RequestStatus.PUBLISHED)}
                          disabled={b.status === RequestStatus.PUBLISHED}
                          title="تعيين كـ منشور"
                          aria-label="منشور"
                          className={cn(
                            "size-7 rounded-lg transition-all",
                            b.status === RequestStatus.PUBLISHED
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default opacity-100 shadow-2xs"
                              : "text-[#A09080] hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
                          )}
                        >
                          <CheckCircle2Icon className="size-3.5" />
                        </Button>

                        {/* مرفوض (Rejected) */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onStatusChange(b.id, RequestStatus.CLOSED)}
                          disabled={b.status === RequestStatus.CLOSED}
                          title="تعيين كـ مرفوض"
                          aria-label="مرفوض"
                          className={cn(
                            "size-7 rounded-lg transition-all",
                            b.status === RequestStatus.CLOSED
                              ? "bg-red-100 text-red-800 border border-red-300 cursor-default opacity-100 shadow-2xs"
                              : "text-[#A09080] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
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
