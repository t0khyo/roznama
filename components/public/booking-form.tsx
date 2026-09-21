"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calendar as CalendarIcon, CircleCheckIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { arSA } from "react-day-picker/locale"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const customArSA = { ...arSA, code: "ar-SA-u-ca-gregory" }

const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "يرجى كتابة الاسم")
    .min(3, "يرجى كتابة الاسم كاملاً (3 أحرف على الأقل)")
    .max(100, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(1, "رقم الهاتف مطلوب")
    .refine(
      (val) => {
        const clean = val.replace(/[\s-]/g, "")
        return /^\+?\d{8,15}$/.test(clean)
      },
      { message: "يرجى إدخال رقم هاتف صحيح (مثال: +965 9804 0875)" }
    ),
  date: z.date({
    required_error: "يرجى اختيار تاريخ المناسبة",
    invalid_type_error: "يرجى اختيار تاريخ المناسبة",
  }),
  venue: z
    .string()
    .trim()
    .max(100, "اسم المكان طويل جداً")
    .optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookingForm() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      venue: "",
    },
  })

  const onSubmit = async (data: BookingFormData) => {
    const submitRequest = new Promise<{ name: string }>((resolve) => {
      setTimeout(() => {
        resolve({ name: data.name })
      }, 1200)
    })

    toast.promise(submitRequest, {
      loading: (
        <span className="block w-full text-center font-cairo text-sm text-[#4A4038]">
          جارٍ إرسال طلب الحجز...
        </span>
      ),
      success: () => {
        reset({
          name: "",
          phone: "",
          date: undefined,
          venue: "",
        })
        return {
          message: (
            <span className="block w-full text-center font-bold text-emerald-800 text-sm font-cairo">
              تم إرسال طلبك بنجاح!
            </span>
          ),
          description: (
            <span className="block w-full text-center text-emerald-700 text-xs font-cairo mt-1">
              سيتواصل معك فريقنا عبر الواتساب قريباً لتأكيد التفاصيل.
            </span>
          ),
          className:
            "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-md font-cairo",
          duration: 5000,
          classNames: {
            content: "flex-1 flex flex-col items-center text-center justify-center",
            title: "w-full text-center font-bold text-emerald-800",
            description: "w-full text-center text-emerald-700",
            icon: "text-emerald-600 self-center",
          },
          icon: <CircleCheckIcon className="size-5 text-emerald-600 shrink-0" />,
        }
      },
      error: () => ({
        message: (
          <span className="block w-full text-center font-bold text-red-800 text-sm font-cairo">
            تعذر إرسال الطلب
          </span>
        ),
        description: (
          <span className="block w-full text-center text-red-700 text-xs font-cairo mt-1">
            حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.
          </span>
        ),
        className:
          "border border-red-200 bg-red-50 text-red-800 shadow-md font-cairo",
        classNames: {
          content: "flex-1 flex flex-col items-center text-center justify-center",
          title: "w-full text-center font-bold text-red-800",
          description: "w-full text-center text-red-700",
          icon: "text-red-600 self-center",
        },
      }),
    })

    try {
      await submitRequest
    } catch {
      // Handled by toast.promise
    }
  }

  return (
    <section id="booking" className="py-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#8B1A1A] font-cairo text-sm font-medium mb-2 tracking-wider">التسجيل</p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1A1714]"
            style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
          >
            سجل مناسبتك
          </h2>
          <p className="font-cairo text-[#6B5E52] mt-3 text-base">
            سجّل مناسبتك لتظهر في الموقع ويطلع عليها الجميع
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field data-invalid={!!errors.name} className="space-y-2">
            <FieldLabel htmlFor="booking-name" className="font-cairo text-sm font-medium text-[#4A4038]">
              الاسم
            </FieldLabel>
            <Input
              id="booking-name"
              type="text"
              placeholder="محمد بن خالد بن سعد المطيري"
              aria-invalid={!!errors.name}
              className="w-full bg-[#F3EDE3] border border-[#E5DDD0] rounded-xl px-4 py-3.5 h-auto font-cairo text-sm text-[#1A1714] placeholder:text-[#C0B4A8] focus-visible:border-[#C9973A] focus-visible:bg-[#FAF8F3] focus-visible:ring-0 transition-colors shadow-none"
              dir="rtl"
              {...register("name")}
            />
            {errors.name && (
              <FieldError className="font-cairo text-xs text-red-600">
                {errors.name.message}
              </FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.phone} className="space-y-2">
            <FieldLabel htmlFor="booking-phone" className="font-cairo text-sm font-medium text-[#4A4038]">
              رقم الهاتف
            </FieldLabel>
            <Input
              id="booking-phone"
              type="tel"
              placeholder="+965 9804 0875"
              aria-invalid={!!errors.phone}
              className="w-full bg-[#F3EDE3] border border-[#E5DDD0] rounded-xl px-4 py-3.5 h-auto font-cairo text-sm text-[#1A1714] placeholder:text-[#C0B4A8] focus-visible:border-[#C9973A] focus-visible:bg-[#FAF8F3] focus-visible:ring-0 transition-colors shadow-none"
              dir="ltr"
              {...register("phone")}
            />
            {errors.phone && (
              <FieldError className="font-cairo text-xs text-red-600">
                {errors.phone.message}
              </FieldError>
            )}
          </Field>

          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Field data-invalid={!!errors.date} className="space-y-2">
                <FieldLabel htmlFor="booking-date" className="font-cairo text-sm font-medium text-[#4A4038]">
                  تاريخ المناسبة
                </FieldLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger
                    id="booking-date"
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-start bg-[#F3EDE3] border-[#E5DDD0] rounded-xl px-4 py-6 font-cairo text-sm focus:border-[#C9973A] focus:bg-[#FAF8F3] transition-colors ${!field.value ? "text-[#C0B4A8]" : "text-[#1A1714]"
                          } ${errors.date ? "!border-red-500" : ""}`}
                        dir="rtl"
                      />
                    }
                  >
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    {field.value ? (
                      format(field.value, "PPP", { locale: ar })
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" dir="rtl">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(d) => {
                        field.onChange(d)
                        if (d) {
                          setIsCalendarOpen(false)
                        }
                      }}
                      autoFocus
                      dir="rtl"
                      locale={customArSA}
                      className="p-4 font-cairo [--cell-size:--spacing(10)] md:[--cell-size:--spacing(11)]"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <FieldError className="font-cairo text-xs text-red-600">
                    {errors.date.message}
                  </FieldError>
                )}
              </Field>
            )}
          />

          <Field data-invalid={!!errors.venue} className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="booking-venue" className="font-cairo text-sm font-medium text-[#4A4038]">
                المكان
              </FieldLabel>
            </div>
            <Input
              id="booking-venue"
              type="text"
              placeholder="قاعة الملوك — الجهراء"
              aria-invalid={!!errors.venue}
              className="w-full bg-[#F3EDE3] border border-[#E5DDD0] rounded-xl px-4 py-3.5 h-auto font-cairo text-sm text-[#1A1714] placeholder:text-[#C0B4A8] focus-visible:border-[#C9973A] focus-visible:bg-[#FAF8F3] focus-visible:ring-0 transition-colors shadow-none"
              dir="rtl"
              {...register("venue")}
            />
            {errors.venue && (
              <FieldError className="font-cairo text-xs text-red-600">
                {errors.venue.message}
              </FieldError>
            )}
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8B1A1A] text-[#FAF8F3] font-cairo font-semibold py-4 h-auto rounded-xl text-base hover:bg-[#C9973A] transition-colors duration-300 mt-2"
          >
            {isSubmitting ? "جارٍ الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </div>
    </section>
  )
}
