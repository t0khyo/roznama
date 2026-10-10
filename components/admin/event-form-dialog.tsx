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

/** Compress an image file in the browser using a canvas element.
 *  - Resizes to at most `maxDim` pixels on the longest side.
 *  - Re-encodes as JPEG at the given quality (0–1).
 *  - Falls back to the original file if anything fails.
 */
async function compressImage(
  file: File,
  maxDim = 1920,
  quality = 0.85,
): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height / width) * maxDim)
          width = maxDim
        } else {
          width = Math.round((width / height) * maxDim)
          height = maxDim
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return resolve(file)

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file)
          // Keep original filename but signal it's been compressed
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          })
          resolve(compressed)
        },
        "image/jpeg",
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file) // fallback to original
    }

    img.src = objectUrl
  })
}

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If provided, we're editing; otherwise creating */
  event?: Event | null
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

export function EventFormDialog({
  open,
  onOpenChange,
  event,
  onSave,
}: EventFormDialogProps) {
  const [form, setForm] = useState<CreateEventInput>(EMPTY)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<FileMeta | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Populate form when editing or resetting
  useEffect(() => {
    if (event) {
      setForm({
        tribe: event.tribe,
        groomName: event.groomName,
        eventDate: new Date(event.eventDate),
        imageUrl: event.imageUrl,
        galleryUrl: event.galleryUrl ?? null,
        venue: event.venue ?? null,
      })
      setSelectedFile(null)
      setPreviewUrl(event.imageUrl)
      setFileInfo(
        event.imageUrl
          ? {
            name: `دعوة ${event.tribe || "المناسبة"}`,
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
  }, [event, open])

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

      // If user selected a new image file, compress then upload to Cloudflare R2
      if (selectedFile) {
        setCompressing(true)
        const compressed = await compressImage(selectedFile)
        setCompressing(false)

        setUploading(true)
        const formData = new FormData()
        formData.append("file", compressed)
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
      setCompressing(false)
      setUploading(false)
      setSaving(false)
    }
  }

  const isBusy = saving || compressing || uploading
  const isEdit = !!event
  const hasImage = !!previewUrl || !!form.imageUrl

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background" dir="rtl">
        <DialogHeader>
          <DialogTitle
            className="text-foreground font-bold text-xl"
            style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
          >
            {isEdit ? "تعديل المناسبة" : "إضافة مناسبة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-foreground">القبيلة</Label>
            <Input
              required
              dir="rtl"
              placeholder=""
              value={form.tribe}
              onChange={set("tribe")}
              className="font-cairo bg-secondary border-border focus:border-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-foreground">اسم المعرس</Label>
            <Input
              required
              dir="rtl"
              placeholder="الاسم"
              value={form.groomName}
              onChange={set("groomName")}
              className="font-cairo bg-secondary border-border focus:border-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-foreground">
              المكان <span className="text-muted-foreground font-normal">(اختياري)</span>
            </Label>
            <Input
              dir="rtl"
              placeholder=""
              value={form.venue ?? ""}
              onChange={set("venue")}
              className="font-cairo bg-secondary border-border focus:border-ring placeholder:text-muted-foreground"
            />
          </div>

          {/* Gallery URL field hidden for now as requested, preserved in state and data model */}

          <div className="space-y-1.5">
            <Label className="font-cairo text-sm text-foreground">تاريخ المناسبة</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start bg-secondary border-border rounded-lg px-3 py-2.5 h-auto font-cairo text-sm focus:border-ring focus:bg-background transition-colors ${!form.eventDate ? "text-muted-foreground" : "text-foreground"
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
            <Label className="font-cairo text-sm text-foreground">صورة الدعوة</Label>

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
                  "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 bg-secondary/50 hover:bg-secondary",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-ring"
                )}
              >
                <div className="size-11 rounded-full bg-background border border-border flex items-center justify-center text-primary shadow-xs">
                  <UploadCloudIcon className="size-5" />
                </div>
                <div>
                  <p className="font-cairo text-sm font-semibold text-foreground">
                    اضغط لاختيار صورة الدعوة من جهازك
                  </p>
                  <p className="font-cairo text-xs text-muted-foreground mt-0.5">
                    أو اسحب وأفلت الصورة هنا (PNG, JPG, WEBP حتى 10 ميجابايت)
                  </p>
                </div>
              </div>
            ) : (
              <Attachment className="w-full grid grid-cols-[auto_1fr_auto] gap-3 items-center bg-secondary/70 border-border p-2.5 rounded-xl overflow-hidden">
                <AttachmentMedia
                  variant="image"
                  className="size-14 rounded-lg overflow-hidden border border-border shrink-0"
                >
                  <img
                    src={previewUrl || form.imageUrl}
                    alt="معاينة الدعوة"
                    className="size-full object-cover"
                  />
                </AttachmentMedia>
                <div className="flex flex-col min-w-0 overflow-hidden text-right">
                  <AttachmentTitle
                    className="font-cairo text-sm font-semibold text-foreground truncate block w-full"
                    title={fileInfo?.name || "صورة الدعوة"}
                  >
                    {fileInfo?.name || "صورة الدعوة"}
                  </AttachmentTitle>
                  <AttachmentDescription className="font-cairo text-xs text-muted-foreground mt-0.5 truncate block w-full">
                    {selectedFile
                      ? fileInfo?.size || "جاهز للرفع إلى Cloudflare R2"
                      : "الصورة الحالية للدعوة"}
                  </AttachmentDescription>
                </div>
                <AttachmentActions className="shrink-0 relative static self-center">
                  <AttachmentAction
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 p-1.5 rounded-lg transition-colors"
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
              disabled={isBusy}
              className="font-cairo font-bold bg-primary text-background hover:bg-primary-dark h-9 px-5"
            >
              {compressing ? (
                <>
                  جارٍ ضغط الصورة…
                  <Loader2Icon className="size-4 animate-spin ml-2" />
                </>
              ) : uploading ? (
                <>
                  جارٍ رفع الصورة…
                  <Loader2Icon className="size-4 animate-spin ml-2" />
                </>
              ) : saving ? (
                <>
                  جاري الحفظ...
                  <Loader2Icon className="size-4 animate-spin ml-2" />
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
              disabled={isBusy}
              className="font-cairo h-9 border-border text-foreground"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
