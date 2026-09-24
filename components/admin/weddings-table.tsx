"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"
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
import type { Event } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"

interface WeddingsTableProps {
  weddings: Event[]
  onEdit: (wedding: Event) => void
  onDelete: (wedding: Event) => void
}

export function WeddingsTable({ weddings, onEdit, onDelete }: WeddingsTableProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="rounded-xl border border-[#E5DDD0] overflow-hidden bg-[#FAF8F3] shadow-sm">
      <Table dir="rtl">
        <TableHeader>
          <TableRow className="border-[#E5DDD0] bg-[#F3EDE3]/60 hover:bg-[#F3EDE3]/60">
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">القبيلة</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">اسم المعرس</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">التاريخ</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">الحالة</TableHead>
            <TableHead className="font-cairo font-semibold text-[#6B5E52] text-sm text-right">صورة الدعوة</TableHead>
            <TableHead className="w-[90px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {weddings.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center font-cairo text-[#A09080] text-sm">
                لا توجد مناسبات مسجلة
              </TableCell>
            </TableRow>
          )}
          {weddings.map((w) => {
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
