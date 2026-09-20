export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1A1714] text-[#FAF8F3] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <img src="/logo.png" alt="سناب مطير" className="h-16 w-auto mb-3 brightness-0 invert opacity-90" />
            <p className="font-cairo text-[#A09080] text-sm max-w-xs">
              مرجعكم للتنسيق والتذكير بالمناسبات في الكويت
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-cairo text-xs text-[#6B5E52] uppercase tracking-widest">تواصل معنا</p>

            {/* Phone */}
            <a
              href="tel:+96598040875"
              className="flex items-center gap-3 text-[#E5DDD0] hover:text-[#8B1A1A] transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-[#3A3530] flex items-center justify-center group-hover:border-[#8B1A1A]/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 11.5c0 .3-.07.58-.2.85-.14.26-.32.5-.56.7-.39.35-.82.52-1.26.52-.32 0-.67-.08-1.04-.24a10.1 10.1 0 01-1.04-.56 16.6 16.6 0 01-1-.74 16.3 16.3 0 01-.96-.96 16.6 16.6 0 01-.74-1c-.22-.35-.4-.7-.56-1.04-.15-.37-.23-.72-.23-1.04 0-.31.07-.61.2-.88.13-.27.33-.52.6-.73.31-.23.65-.35 1-.35.14 0 .28.03.4.09.13.06.25.15.34.28l1.2 1.7c.1.13.17.25.22.37.05.11.08.21.08.3 0 .12-.03.23-.1.34-.06.1-.14.21-.25.31l-.34.35a.23.23 0 00-.07.17c0 .04 0 .07.02.1l.07.19c.14.25.38.57.7.95.32.38.65.7 1 .97.38.31.7.54.95.68l.18.07c.04.02.07.02.1.02.07 0 .13-.03.18-.08l.34-.35c.1-.11.2-.19.31-.25.11-.06.21-.09.33-.09.1 0 .19.02.3.07.12.05.25.12.38.21l1.72 1.22c.13.1.22.21.28.34.05.13.08.26.08.41z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" />
                </svg>
              </span>
              <span className="font-cairo text-sm" dir="ltr">+965 9804 0875</span>
            </a>

            {/* Snapchat */}
            <a
              href="#"
              className="flex items-center gap-3 text-[#E5DDD0] hover:text-[#8B1A1A] transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-[#3A3530] flex items-center justify-center group-hover:border-[#8B1A1A]/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C5.2 2 3 4.1 3 6.7c0 1 .3 1.9.8 2.6L3 11l2.3-.4c.8.4 1.7.7 2.7.7 2.8 0 5-2.1 5-4.7C13 4.1 10.8 2 8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-cairo text-sm">mnasabat_kw</span>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="flex items-center gap-3 text-[#E5DDD0] hover:text-[#8B1A1A] transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-[#3A3530] flex items-center justify-center group-hover:border-[#8B1A1A]/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="11.3" cy="4.7" r="0.6" fill="currentColor" />
                </svg>
              </span>
              <span className="font-cairo text-sm">mnasabat.kw</span>
            </a>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[#2E2925] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-cairo text-xs text-[#4A4038]">
            © {new Date().getFullYear()} سناب مطير. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#8B1A1A]" />
            <div className="w-1 h-1 rounded-full bg-[#C9973A]" />
            <div className="w-1 h-1 rounded-full bg-[#C9973A]/50" />
          </div>
        </div>
      </div>
    </footer>
  )
}
