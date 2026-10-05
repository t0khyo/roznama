import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "الصفحة غير موجودة — سناب مطير",
  description: "تعذر العثور على الصفحة المطلوبة.",
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Ambient background gradients — same as hero */}
      <div
        className="absolute -inset-12 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #9F364712 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #A8823A10 0%, transparent 40%)
          `,
        }}
      />

      {/* Side decorative rules */}
      <div className="absolute top-1/3 right-0 w-px h-32 bg-gradient-to-b from-transparent via-[#9F3647]/25 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-px h-32 bg-gradient-to-b from-transparent via-[#9F3647]/25 to-transparent pointer-events-none" />

      <div className="relative text-center space-y-8 max-w-2xl animate-fade-up">

        {/* Category label */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-l from-[#9F3647] to-transparent" />
          <span className="text-[#9F3647] font-cairo text-sm font-medium tracking-widest">
            خطأ ٤٠٤
          </span>
          <div className="h-px w-12 bg-gradient-to-r from-[#9F3647] to-transparent" />
        </div>

        {/* Large ornamental 404 */}
        <div className="relative select-none">
          <p
            className="text-[9rem] md:text-[12rem] font-bold leading-none text-[#1A1714]/[0.05]"
            style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
            aria-hidden="true"
          >
            ٤٠٤
          </p>
          {/* Overlaid readable heading */}
          <h1
            className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-[#1A1714]"
            style={{ fontFamily: "var(--font-thmanyah-serif), serif", lineHeight: "1.4" }}
          >
            لم نجد الصفحة
          </h1>
        </div>

        {/* Decorative gold divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#A8823A]/60 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#A8823A]" />
          <div className="w-1 h-1 rounded-full bg-[#A8823A]/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#A8823A]" />
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#A8823A]/60 to-transparent" />
        </div>

        {/* Description */}
        <p className="font-cairo text-lg text-[#6B5E52] font-light leading-relaxed max-w-md mx-auto">
          الصفحة التي تبحث عنها غير موجودة أو ربما تمت إزالتها.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/#upcoming"
            className="inline-flex items-center justify-center border border-[#9F3647] text-[#9F3647] font-cairo font-medium px-8 py-3.5 rounded-full text-sm hover:bg-[#9F3647]/10 transition-colors duration-300 w-full sm:w-auto bg-transparent"
          >
            المناسبات القادمة
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#9F3647] text-[#FAF8F3] font-cairo font-bold px-8 py-3.5 rounded-full text-sm hover:bg-[#722230] transition-all duration-300 w-full sm:w-auto shadow-sm"
          >
            العودة للرئيسية
          </Link>
        </div>

        {/* Bottom logo watermark */}
        <div className="pt-8 flex flex-col items-center gap-2 opacity-40">
          <img src="/logo.png" alt="سناب مطير" className="h-10 w-auto object-contain" />
          <span className="font-cairo text-xs text-[#A09080]">سناب مطير</span>
        </div>
      </div>
    </main>
  )
}
