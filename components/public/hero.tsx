"use client"

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #8B1A1A12 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #C9973A10 0%, transparent 40%)`,
        }}
      />

      {/* Decorative line */}
      <div className="absolute top-1/3 right-0 w-px h-32 bg-gradient-to-b from-transparent via-[#8B1A1A]/25 to-transparent" />
      <div className="absolute top-1/3 left-0 w-px h-32 bg-gradient-to-b from-transparent via-[#8B1A1A]/25 to-transparent" />

      <div className="relative text-center space-y-8 max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-gradient-to-l from-[#8B1A1A] to-transparent" />
          <span className="text-[#8B1A1A] font-cairo text-sm font-medium tracking-widest">مناسبات</span>
          <div className="h-px w-16 bg-gradient-to-r from-[#8B1A1A] to-transparent" />
        </div>

        <h1
          className="text-5xl md:text-7xl font-bold leading-tight text-[#1A1714]"
          style={{ fontFamily: "'ThmanyahSerifDisplay', serif", lineHeight: "1.4" }}
        >
          سناب مطير
        </h1>

        <p className="font-cairo text-lg md:text-xl text-[#6B5E52] font-light leading-relaxed max-w-xl mx-auto">
          نقدمها لكم لتكون مرجعاً للتنسيق والتذكير بالمناسبات كافة
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => scrollTo("booking")}
            className="bg-[#8B1A1A] text-[#FAF8F3] font-cairo font-bold px-8 py-3.5 rounded-full text-sm hover:bg-[#6A1212] transition-all duration-300 w-full sm:w-auto shadow-sm"
          >
            سجل مناسبتك
          </button>
          <button
            onClick={() => scrollTo("upcoming")}
            className="border border-[#8B1A1A] text-[#8B1A1A] font-cairo font-medium px-8 py-3.5 rounded-full text-sm hover:bg-[#8B1A1A]/10 transition-colors duration-300 w-full sm:w-auto"
          >
            المناسبات القادمة
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-cairo text-xs text-[#A09080]">انزل للأسفل</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 9l5 5 5-5" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
