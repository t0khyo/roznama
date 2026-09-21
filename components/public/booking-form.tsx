"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { arSA } from "react-day-picker/locale"

const customArSA = { ...arSA, code: "ar-SA-u-ca-gregory" }

export default function BookingForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", venue: "" })
  const [date, setDate] = useState<Date>()
  const [formSent, setFormSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
    setFormData({ name: "", phone: "", date: "", venue: "" })
    setDate(undefined)
    setTimeout(() => setFormSent(false), 4000)
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { key: "name", label: "الاسم", type: "text", placeholder: "محمد بن خالد بن سعد المطيري" },
            { key: "phone", label: "رقم الهاتف", type: "tel", placeholder: "+965 9804 0875" },
            { key: "date", label: "تاريخ المناسبة", type: "date", placeholder: "" },
            { key: "venue", label: "المكان", type: "text", placeholder: "قاعة الملوك — الجهراء" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="group">
              <label className="block font-cairo text-sm font-medium text-[#4A4038] mb-2">{label}</label>
              {key === "date" ? (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className={`w-full justify-start bg-[#F3EDE3] border-[#E5DDD0] rounded-xl px-4 py-6 font-cairo text-sm focus:border-[#C9973A] focus:bg-[#FAF8F3] transition-colors ${
                          !date ? "text-[#C0B4A8]" : "text-[#1A1714]"
                        }`}
                        dir="rtl"
                      />
                    }
                  >
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    {date ? (
                      format(date, "PPP", { locale: ar })
                    ) : (
                      <span>اختر التاريخ</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" dir="rtl">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d)
                        if (d) setFormData({ ...formData, date: d.toISOString() })
                      }}
                      autoFocus
                      dir="rtl"
                      locale={customArSA}
                      className="p-4 font-cairo [--cell-size:--spacing(10)] md:[--cell-size:--spacing(11)]"
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full bg-[#F3EDE3] border border-[#E5DDD0] rounded-xl px-4 py-3.5 font-cairo text-sm text-[#1A1714] placeholder-[#C0B4A8] focus:border-[#C9973A] focus:bg-[#FAF8F3] transition-colors"
                  dir={key === "phone" ? "ltr" : "rtl"}
                />
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full bg-[#8B1A1A] text-[#FAF8F3] font-cairo font-semibold py-4 h-auto rounded-xl text-base hover:bg-[#C9973A] transition-colors duration-300 mt-2"
          >
            إرسال الطلب
          </Button>
        </form>

        {/* Success toast */}
        {formSent && (
          <div className="mt-6 bg-[#F5EFE6] border border-[#8B1A1A]/25 rounded-xl px-5 py-4 flex items-center gap-3 menu-open">
            <div className="w-8 h-8 rounded-full bg-[#8B1A1A]/10 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-cairo text-sm text-[#4A4038]">
              تم إرسال طلبك بنجاح، سنتواصل معك قريباً
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
