"use client"

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
import { ClockIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa6"
import { RequestStatus, type EventRequest, REQUEST_STATUS_LABELS } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"
import { formatWhatsAppUrl } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

interface BookingsTableProps {
  bookings: EventRequest[]
  onStatusChange: (id: string, status: RequestStatus) => Promise<void>
}

export function BookingsTable({ bookings, onStatusChange }: BookingsTableProps) {
  return (
    <div className="rounded-xl border border-[#E5DDD0] overflow-hidden bg-[#FAF8F3] shadow-sm">
      <Table dir="rtl">
        <TableHeader>
          <TableRow className="border-[#E5DDD0] bg-[#F3EDE3]/60 hover:bg-[#F3EDE3]/60">
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">الاسم</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">الهاتف</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">التاريخ المطلوب</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">المكان</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">تاريخ الطلب</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">الحالة</TableHead>
            <TableHead className="w-[120px] font-cairo font-semibold text-[#6B5E52] text-sm text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center font-cairo text-[#A09080] text-sm">
                لا توجد طلبات حجز
              </TableCell>
            </TableRow>
          )}
          {bookings.map((b) => {
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
          })}
        </TableBody>
      </Table>
    </div>
  )
}
