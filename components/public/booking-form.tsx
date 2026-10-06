"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarDays, CircleCheckIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { arSA } from "react-day-picker/locale"
import { toast } from "sonner"
import { submitBookingAction } from "@/app/(public)/actions"

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
      { message: "يرجى إدخال رقم هاتف صحيح (مثال: 98040875)" }
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
    const submitRequest = submitBookingAction({
      name: data.name,
      phone: data.phone,
      preferredDate: data.date,
      venue: data.venue || undefined,
    })

    toast.promise(submitRequest, {
      loading: (
        <span className="block w-full text-center text-sm text-[#4A4038]">
          جارٍ إرسال طلب التسجيل...
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
            <span className="block w-full text-center font-bold text-emerald-800 text-sm">
              تم إرسال طلبك بنجاح!
            </span>
          ),
          description: (
            <span className="block w-full text-center text-emerald-700 text-xs mt-1">
              سيتواصل معك فريقنا عبر الواتساب قريباً لتأكيد التفاصيل.
            </span>
          ),
          className:
            "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-md",
          duration: 5000,
          classNames: {
            content: "flex-1 flex flex-col items-center text-center justify-center",
            title: "w-full text-center font-bold text-emerald-800",
            description: "w-full text-center text-emerald-700",
            icon: "text-emerald-600 self-center order-last shrink-0",
          },
          icon: <CircleCheckIcon className="size-5 text-emerald-600 shrink-0" />,
        }
      },
      error: () => ({
        message: (
          <span className="block w-full text-center font-bold text-red-800 text-sm">
            تعذر إرسال الطلب
          </span>
        ),
        description: (
          <span className="block w-full text-center text-red-700 text-xs mt-1">
            حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة عبر الواتساب.
          </span>
        ),
        className:
          "border border-red-200 bg-red-50 text-red-800 shadow-md",
        classNames: {
          content: "flex-1 flex flex-col items-center text-center justify-center",
          title: "w-full text-center font-bold text-red-800",
          description: "w-full text-center text-red-700",
          icon: "text-red-600 self-center order-last shrink-0",
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
          <p className="text-primary font-cairo text-sm font-medium mb-2 tracking-wider">التسجيل</p>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
          >
            سجل مناسبتك
          </h2>
          <p className="font-cairo text-muted-foreground mt-3 text-base">
            سجّل مناسبتك لتظهر في الموقع ويطلع عليها الجميع
          </p>
        </div>

        <div className="bg-white dark:bg-card border border-border/50 rounded-xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field data-invalid={!!errors.name} className="space-y-2">
            <Input
              id="booking-name"
              type="text"
              placeholder="الاسم"
              aria-invalid={!!errors.name}
              className="w-full bg-secondary/30 border-transparent rounded-md px-4 py-3.5 h-auto font-cairo text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-none"
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
            <Input
              id="booking-phone"
              type="tel"
              placeholder="رقم الهاتف"
              aria-invalid={!!errors.phone}
              className="w-full bg-secondary/30 border-transparent rounded-md px-4 py-3.5 h-auto font-cairo text-sm text-foreground placeholder:text-muted-foreground ltr:text-left rtl:text-right focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-none"
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
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger
                    id="booking-date"
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-start bg-secondary/30 border-transparent rounded-md px-4 py-6 font-cairo text-sm focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 transition-all ${!field.value ? "text-muted-foreground" : "text-foreground"
                          } ${errors.date ? "!border-red-500" : ""}`}
                        dir="rtl"
                      />
                    }
                  >
                    <CalendarDays className="ml-2 h-4 w-4 opacity-60" />
                    {field.value ? (
                      format(field.value, "PPP", { locale: ar })
                    ) : (
                      <span>تاريخ المناسبة</span>
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
            <Input
              id="booking-venue"
              type="text"
              placeholder="المكان"
              aria-invalid={!!errors.venue}
              className="w-full bg-secondary/30 border-transparent rounded-md px-4 py-3.5 h-auto font-cairo text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-none"
              dir="rtl"
              {...register("venue")}
            />
            {errors.venue && (
              <FieldError className="font-cairo text-xs text-red-600">
                {errors.venue.message}
              </FieldError>
            )}
          </Field>

          <div className="flex justify-center md:justify-start pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-auto px-8 bg-gradient-to-r from-primary to-[#722230] text-primary-foreground font-cairo font-semibold py-3 h-auto rounded-md text-sm hover:opacity-90 hover:scale-95 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-95"
            >
              {isSubmitting ? "جاري الإرسال..." : "أرسل الطلب"}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </section>
  )
}
