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
import { Calendar as CalendarIcon, UploadCloudIcon, XIcon, Loader2Icon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { arSA } from "react-day-picker/locale"
import { toast } from "sonner"
import type { Event } from "@/types"
import type { CreateEventInput } from "@/lib/data/events"
import { uploadEventImageAction } from "@/app/admin/events/actions"
import { cn } from "@/lib/utils"

const customArSA = { ...arSA, code: "ar-SA-u-ca-gregory" }

interface WeddingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If provided, we're editing; otherwise creating */
  wedding?: Event | null
  onSave: (data: CreateEventInput) => Promise<void>
}

interface FileMeta {
  name: string
  size: string
}

const EMPTY: CreateEventInput = {
  tribe: "",
  groomName: "",
  eventDate: new Date(),
  imageUrl: "",
  galleryUrl: null,
  venue: null,
}

export function WeddingFormDialog({
  open,
  onOpenChange,
  wedding,
  onSave,
}: WeddingFormDialogProps) {
  const [form, setForm] = useState<CreateEventInput>(EMPTY)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<FileMeta | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Populate form when editing or resetting
  useEffect(() => {
    if (wedding) {
      setForm({
        tribe: wedding.tribe,
        groomName: wedding.groomName,
        eventDate: new Date(wedding.eventDate),
        imageUrl: wedding.imageUrl,
        galleryUrl: wedding.galleryUrl ?? null,
        venue: wedding.venue ?? null,
      })
      setSelectedFile(null)
      setPreviewUrl(wedding.imageUrl)
      setFileInfo(
        wedding.imageUrl
          ? {
              name: `دعوة ${wedding.tribe || "المناسبة"}`,
              size: "الصورة المحفوظة للمناسبة",
            }
          : null
      )
    } else {
      setForm(EMPTY)
      setSelectedFile(null)
      setPreviewUrl(null)
      setFileInfo(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [wedding, open])

  // Cleanup object URLs on unmount/change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const set =
    (key: keyof CreateEventInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)")
      return
    }

    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      toast.error("حجم الصورة يتجاوز الحد المسموح به (10 ميجابايت)")
      return
    }

    setSelectedFile(file)
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

    setFileInfo({
      name: file.name,
      size: `${file.type.split("/")[1]?.toUpperCase() || "صورة"} · ${sizeFormatted}`,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleSelectedFile(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFileInfo(null)
    setForm((f) => ({ ...f, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.eventDate) {
      toast.error("يرجى تحديد تاريخ المناسبة")
      return
    }

    if (!selectedFile && !previewUrl && !form.imageUrl) {
      toast.error("يرجى اختيار صورة الدعوة للمناسبة")
      return
    }

    setSaving(true)
    try {
      let finalImageUrl = form.imageUrl

      // If user selected a new image file, upload it to Cloudflare R2
      if (selectedFile) {
        setUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)
        const { url } = await uploadEventImageAction(formData)
        finalImageUrl = url
        setUploading(false)
      }

      await onSave({ ...form, imageUrl: finalImageUrl })
      toast.success(isEdit ? "تم تحديث المناسبة بنجاح" : "تمت إضافة المناسبة بنجاح")
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المناسبة"
      toast.error(message)
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  const isEdit = !!wedding
  const hasImage = !!previewUrl || !!form.imageUrl

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
              value={form.groomName}
              onChange={set("groomName")}
              className="font-cairo bg-[#F3EDE3] border-[#E5DDD0] focus:border-[#C9973A] placeholder:text-[#C0B4A8]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">
              المكان <span className="text-[#A09080] font-normal">(اختياري)</span>
            </Label>
            <Input
              dir="rtl"
              placeholder="مثال: قاعة الأفراح — الجهراء"
              value={form.venue ?? ""}
              onChange={set("venue")}
              className="font-cairo bg-[#F3EDE3] border-[#E5DDD0] focus:border-[#C9973A] placeholder:text-[#C0B4A8]"
            />
          </div>

          {/* Gallery URL field hidden for now as requested, preserved in state and data model */}

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">تاريخ المناسبة</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start bg-[#F3EDE3] border-[#E5DDD0] rounded-lg px-3 py-2.5 h-auto font-cairo text-sm focus:border-[#C9973A] focus:bg-[#FAF8F3] transition-colors ${
                      !form.eventDate ? "text-[#C0B4A8]" : "text-[#1A1714]"
                    }`}
                    dir="rtl"
                  />
                }
              >
                <CalendarIcon className="ms-2 h-4 w-4 opacity-50" />
                {form.eventDate ? (
                  format(form.eventDate, "PPP", { locale: ar })
                ) : (
                  <span>اختر التاريخ</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[60]" align="start" dir="rtl">
                <Calendar
                  mode="single"
                  selected={form.eventDate}
                  onSelect={(d) => {
                    setForm((f) => ({ ...f, eventDate: d ?? new Date() }))
                    if (d) setIsCalendarOpen(false)
                  }}
                  autoFocus
                  dir="rtl"
                  locale={customArSA}
                  className="p-4 font-cairo [--cell-size:--spacing(10)] md:[--cell-size:--spacing(11)]"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Image Upload from Device */}
          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-[#4A4038]">صورة الدعوة</Label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {!hasImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleSelectedFile(file)
                }}
                className={cn(
                  "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 bg-[#F3EDE3]/50 hover:bg-[#F3EDE3]",
                  dragActive
                    ? "border-[#8B1A1A] bg-[#8B1A1A]/5"
                    : "border-[#E5DDD0] hover:border-[#C9973A]"
                )}
              >
                <div className="size-11 rounded-full bg-[#FAF8F3] border border-[#E5DDD0] flex items-center justify-center text-[#8B1A1A] shadow-xs">
                  <UploadCloudIcon className="size-5" />
                </div>
                <div>
                  <p className="font-cairo text-sm font-semibold text-[#1A1714]">
                    اضغط لاختيار صورة الدعوة من جهازك
                  </p>
                  <p className="font-cairo text-xs text-[#7D6E63] mt-0.5">
                    أو اسحب وأفلت الصورة هنا (PNG, JPG, WEBP حتى 10 ميجابايت)
                  </p>
                </div>
              </div>
            ) : (
              <Attachment className="w-full justify-between items-center bg-[#F3EDE3]/70 border-[#E5DDD0] p-2.5 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <AttachmentMedia
                    variant="image"
                    className="size-14 rounded-lg overflow-hidden border border-[#E5DDD0] shrink-0"
                  >
                    <img
                      src={previewUrl || form.imageUrl}
                      alt="معاينة الدعوة"
                      className="size-full object-cover"
                    />
                  </AttachmentMedia>
                  <AttachmentContent className="text-right min-w-0">
                    <AttachmentTitle className="font-cairo text-sm font-semibold text-[#1A1714] truncate block">
                      {fileInfo?.name || "صورة الدعوة"}
                    </AttachmentTitle>
                    <AttachmentDescription className="font-cairo text-xs text-[#7D6E63] mt-0.5">
                      {selectedFile
                        ? fileInfo?.size || "جاهز للرفع إلى Cloudflare R2"
                        : "الصورة الحالية للدعوة"}
                    </AttachmentDescription>
                  </AttachmentContent>
                </div>
                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-[#7D6E63] hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="إزالة الصورة"
                  >
                    <XIcon className="size-4" />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2 flex-row-reverse sm:flex-row-reverse">
            <Button
              type="submit"
              disabled={saving || uploading}
              className="font-cairo font-bold bg-[#8B1A1A] text-[#FAF8F3] hover:bg-[#6A1212] h-9 px-5"
            >
              {uploading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin ml-2" />
                  جارٍ رفع الصورة…
                </>
              ) : saving ? (
                <>
                  <Loader2Icon className="size-4 animate-spin ml-2" />
                  جارٍ الحفظ…
                </>
              ) : isEdit ? (
                "حفظ التعديلات"
              ) : (
                "إضافة المناسبة"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving || uploading}
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
