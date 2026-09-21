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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import type { BookingRequest, BookingStatus } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "قيد الانتظار",
    className:
      "bg-[#C9973A]/10 text-[#C9973A] border border-[#C9973A]/25 hover:bg-[#C9973A]/10 font-cairo text-xs",
  },
  approved: {
    label: "مقبول",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-cairo text-xs",
  },
  rejected: {
    label: "مرفوض",
    className:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-50 font-cairo text-xs",
  },
}

interface BookingsTableProps {
  bookings: BookingRequest[]
  onStatusChange: (id: number, status: BookingStatus) => Promise<void>
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
            <TableHead className="w-[48px]" />
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
            const sc = statusConfig[b.status]
            return (
              <TableRow
                key={b.id}
                className="border-[#E5DDD0] hover:bg-[#F3EDE3]/40 transition-colors"
              >
                <TableCell className="font-cairo font-semibold text-[#1A1714] text-sm">
                  {b.name}
                </TableCell>
                <TableCell className="font-cairo text-[#4A4038] text-sm tabular-nums" dir="ltr">
                  {b.phone}
                </TableCell>
                <TableCell className="font-cairo text-[#4A4038] text-sm tabular-nums">
                  {formatArabicDate(b.date)}
                </TableCell>
                <TableCell className="font-cairo text-[#4A4038] text-sm max-w-[180px] truncate">
                  {b.venue}
                </TableCell>
                <TableCell className="font-cairo text-[#A09080] text-xs tabular-nums">
                  {new Date(b.submittedAt).toLocaleDateString("ar-KW", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge className={sc.className}>{sc.label}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-7 text-[#6B5E52] hover:text-[#1A1714] hover:bg-[#E5DDD0]/60"
                          aria-label="خيارات"
                        />
                      }
                    >
                      <MoreHorizontalIcon className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="font-cairo text-sm bg-[#FAF8F3] border-[#E5DDD0]"
                    >
                      <DropdownMenuItem
                        className="text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer"
                        onClick={() => onStatusChange(b.id, "approved")}
                        disabled={b.status === "approved"}
                      >
                        قبول الطلب
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        onClick={() => onStatusChange(b.id, "rejected")}
                        disabled={b.status === "rejected"}
                      >
                        رفض الطلب
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[#C9973A] focus:text-[#C9973A] focus:bg-[#C9973A]/10 cursor-pointer"
                        onClick={() => onStatusChange(b.id, "pending")}
                        disabled={b.status === "pending"}
                      >
                        إعادة للانتظار
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
