"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Wedding } from "@/types"

interface DeleteWeddingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wedding: Wedding | null
  onConfirm: () => Promise<void>
}

export function DeleteWeddingDialog({
  open,
  onOpenChange,
  wedding,
  onConfirm,
}: DeleteWeddingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-[#FAF8F3]" dir="rtl">
        <DialogHeader>
          <DialogTitle
            className="text-[#1A1714] font-bold text-xl"
            style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
          >
            حذف المناسبة
          </DialogTitle>
        </DialogHeader>

        <p className="font-cairo text-sm text-[#6B5E52] leading-relaxed">
          هل أنت متأكد من حذف مناسبة{" "}
          <span className="font-bold text-[#1A1714]">{wedding?.tribe}</span>؟
          <br />
          لا يمكن التراجع عن هذا الإجراء.
        </p>

        <DialogFooter className="gap-2 flex-row-reverse sm:flex-row-reverse">
          <Button
            variant="destructive"
            onClick={async () => {
              await onConfirm()
              onOpenChange(false)
            }}
            className="font-cairo font-bold h-9 px-5"
          >
            حذف
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-cairo h-9 border-[#E5DDD0] text-[#4A4038]"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
