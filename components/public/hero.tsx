export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="hero-overlay absolute -inset-12 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #9F364712 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #A8823A10 0%, transparent 40%)`,
        }}
      />

      {/* Decorative line */}
      <div className="absolute top-1/3 right-0 w-px h-32 bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
      <div className="absolute top-1/3 left-0 w-px h-32 bg-gradient-to-b from-transparent via-primary/25 to-transparent" />

      <div className="relative text-center space-y-8 w-full max-w-5xl">
        <h1 className="sr-only">مناسبات مطير</h1>
        <div className="flex justify-center mb-6 md:mb-8 opacity-0 animate-fade-up [animation-delay:0ms]">
          <img
            src="/banner.png"
            alt="مناسبات مطير"
            className="w-[100%] mx-auto h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700"
          />
        </div>

        <p className="font-cairo text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto opacity-0 animate-fade-up [animation-delay:200ms]">
         تحديد زفاف مطير نقدمها لكم لتكون مرجعاً للتنسيق والتذكير بالمناسبات كافة
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-up [animation-delay:300ms]">
          <a
            href="#upcoming"
            className="inline-flex items-center justify-center border border-[#A8823A] text-[#A8823A] font-cairo font-medium px-8 py-3.5 h-auto rounded-md text-sm hover:bg-[#A8823A]/10 hover:scale-95 transition-all duration-300 w-full sm:w-56 bg-transparent active:scale-95"
          >
            المناسبات القادمة
          </a>
          <a
            href="#booking"
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-[#722230] text-primary-foreground font-cairo font-bold px-8 py-3.5 h-auto rounded-md text-sm hover:opacity-90 hover:scale-95 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-56 active:scale-95"
          >
            احجز مناسبتك معنا
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <span className="font-cairo text-xs text-muted-foreground">انزل للأسفل</span>
        <svg className="scroll-indicator-arrow text-primary" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
