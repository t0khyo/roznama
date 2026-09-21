"use client"

import { useEffect, useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { UploadCloudIcon, XIcon } from "lucide-react"
import type { Wedding } from "@/types"

interface WeddingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If provided, we're editing; otherwise creating */
  wedding?: Wedding | null
  onSave: (data: Omit<Wedding, "id">) => Promise<void>
}

interface FileMeta {
  name: string
  size: string
}

const EMPTY: Omit<Wedding, "id"> = {
  tribe: "",
  groom: "",
  date: "",
  image: "",
}

export function WeddingFormDialog({
  open,
  onOpenChange,
  wedding,
  onSave,
}: WeddingFormDialogProps) {
  const [form, setForm] = useState<Omit<Wedding, "id">>(EMPTY)
  const [fileInfo, setFileInfo] = useState<FileMeta | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Populate form when editing
  useEffect(() => {
    if (wedding) {
      setForm({
        tribe: wedding.tribe,
        groom: wedding.groom,
        date: wedding.date,
        image: wedding.image,
      })
      setFileInfo(
        wedding.image
          ? {
            name: `دعوة ${wedding.tribe || "المناسبة"}`,
            size: "الصورة الحالية للمناسبة",
          }
          : null
      )
    } else {
      setForm(EMPTY)
      setFileInfo(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [wedding, open])

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    setFileInfo({
      name: file.name,
      size: `${file.type.split("/")[1]?.toUpperCase() || "صورة"} · ${sizeFormatted}`,
    })

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((f) => ({ ...f, image: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setForm((f) => ({ ...f, image: "" }))
    setFileInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const isEdit = !!wedding

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#FAF8F3]" dir="rtl">
        <DialogHeader>
          <DialogTitle
            className="text-[#1A1714] font-bold text-xl"
            style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
          >
            {isEdit ? "تعديل المناسبة" : "إضافة مناسبة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">القبيلة</Label>
            <Input
              required
              dir="rtl"
              placeholder="مثال: المطيري"
              value={form.tribe}
              onChange={set("tribe")}
              className="font-cairo bg-[#F3EDE3] border-[#E5DDD0] focus:border-[#C9973A] placeholder:text-[#C0B4A8]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">اسم المعرس</Label>
            <Input
              required
              dir="rtl"
              placeholder="مثال: محمد بن خالد بن سعد المطيري"
              value={form.groom}
              onChange={set("groom")}
              className="font-cairo bg-[#F3EDE3] border-[#E5DDD0] focus:border-[#C9973A] placeholder:text-[#C0B4A8]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">تاريخ المناسبة</Label>
            <Input
              required
              type="date"
              dir="ltr"
              value={form.date}
              onChange={set("date")}
              className="font-cairo bg-[#F3EDE3] border-[#E5DDD0] focus:border-[#C9973A]"
            />
          </div>

          {/* Single Image Attachment Slot */}
          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">صورة الدعوة</Label>

            {form.image ? (
              /* Attached Image Card with Preview */
              <Attachment className="w-full bg-[#F3EDE3] border-[#E5DDD0] p-2.5 items-center gap-3 rounded-xl shadow-xs">
                <AttachmentMedia
                  variant="image"
                  className="size-14 rounded-lg border border-[#E5DDD0] shrink-0 bg-white"
                >
                  <img
                    src={form.image}
                    alt="معاينة الدعوة"
                    className="size-full object-cover rounded-lg"
                  />
                </AttachmentMedia>

                <AttachmentContent className="min-w-0 flex-1">
                  <AttachmentTitle className="font-cairo text-sm font-semibold text-[#1A1714] truncate">
                    {fileInfo?.name || "صورة الدعوة"}
                  </AttachmentTitle>
                  <AttachmentDescription className="font-cairo text-xs text-[#A09080] truncate">
                    {fileInfo?.size || (isEdit ? "الصورة الحالية" : "تم إرفاق الصورة")}
                  </AttachmentDescription>
                </AttachmentContent>

                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="حذف الصورة"
                    onClick={handleRemoveImage}
                    className="text-[#6B5E52] hover:text-red-600 hover:bg-red-50 size-8 rounded-lg transition-colors"
                    title="حذف الصورة واستبدالها"
                  >
                    <XIcon className="size-4" />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ) : (
              /* Upload Area (only shown when no image attached) */
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E5DDD0] hover:border-[#C9973A] rounded-xl bg-[#F3EDE3]/40 hover:bg-[#F3EDE3]/80 cursor-pointer transition-all p-4 text-center group">
                <UploadCloudIcon className="size-7 text-[#C9973A] group-hover:scale-110 transition-transform mb-1.5" />
                <span className="font-cairo text-xs font-semibold text-[#4A4038]">
                  انقر لاختيار صورة الدعوة أو اسحب الملف هنا
                </span>
                <span className="font-cairo text-[11px] text-[#A09080] mt-0.5">
                  PNG، JPG، أو WebP (مرفق واحد فقط)
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2 flex-row-reverse sm:flex-row-reverse">
            <Button
              type="submit"
              disabled={saving}
              className="font-cairo font-bold bg-[#8B1A1A] text-[#FAF8F3] hover:bg-[#6A1212] h-9 px-5"
            >
              {saving ? "جارٍ الحفظ…" : isEdit ? "حفظ التعديلات" : "إضافة المناسبة"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-cairo h-9 border-[#E5DDD0] text-[#4A4038]"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
