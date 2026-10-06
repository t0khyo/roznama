"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Event } from "@/types"

interface DeleteEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event | null
  onConfirm: () => Promise<void>
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  event,
  onConfirm,
}: DeleteEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-background" dir="rtl">
        <DialogHeader>
          <DialogTitle
            className="text-foreground font-bold text-xl"
            style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
          >
            حذف المناسبة
          </DialogTitle>
        </DialogHeader>

        <p className="font-cairo text-sm text-chart-4 leading-relaxed">
          هل أنت متأكد من حذف مناسبة{" "}
          <span className="font-bold text-foreground">{event?.tribe}</span>؟
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
            className="font-cairo h-9 border-border text-neutral-dark"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
