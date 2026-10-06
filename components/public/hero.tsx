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
          تحديد زفاف مطير نقدمها لكم لتكون مرجعاً للتنسيق والتذكير بالمناسبات كافة.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-up [animation-delay:300ms]">
          <a
            href="#upcoming"
            className="inline-flex items-center justify-center border border-[#A8823A] text-[#A8823A] font-cairo font-medium px-8 py-3.5 h-auto rounded-md text-sm hover:bg-[#A8823A]/10 hover:scale-95 transition-all duration-300 w-full sm:w-56 bg-transparent active:scale-95"
          >
            المناسبات القادمة
          </a>
          <a
            href="https://wa.me/96598040875"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#722230] text-primary-foreground font-cairo font-bold px-8 py-3.5 h-auto rounded-md text-sm hover:opacity-90 hover:scale-95 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-56 active:scale-95"
          >
            <span>احجز مناسبتك معنا</span>
            <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
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
