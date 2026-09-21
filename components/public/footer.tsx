export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1A1714] text-[#FAF8F3] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-[#FAF8F3] rounded-2xl mb-4 shadow-lg border border-[#3A3530]/40">
              <img src="/logo.png" alt="سناب مطير" className="h-12 w-auto object-contain rounded-lg" />
            </div>
            <p className="font-cairo text-[#A09080] text-sm max-w-xs">
              مرجعكم للتنسيق والتذكير بالمناسبات في الكويت
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-cairo text-xs text-[#6B5E52] uppercase tracking-widest">تواصل معنا</p>

            {/* Phone */}
            <a
              href="tel:+96598040875"
              className="flex items-center gap-3 text-[#E5DDD0] hover:text-[#C9973A] transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-[#3A3530] flex items-center justify-center group-hover:border-[#C9973A]/50 group-hover:bg-[#C9973A]/10 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.5 11.5c0 .3-.07.58-.2.85-.14.26-.32.5-.56.7-.39.35-.82.52-1.26.52-.32 0-.67-.08-1.04-.24a10.1 10.1 0 01-1.04-.56 16.6 16.6 0 01-1-.74 16.3 16.3 0 01-.96-.96 16.6 16.6 0 01-.74-1c-.22-.35-.4-.7-.56-1.04-.15-.37-.23-.72-.23-1.04 0-.31.07-.61.2-.88.13-.27.33-.52.6-.73.31-.23.65-.35 1-.35.14 0 .28.03.4.09.13.06.25.15.34.28l1.2 1.7c.1.13.17.25.22.37.05.11.08.21.08.3 0 .12-.03.23-.1.34-.06.1-.14.21-.25.31l-.34.35a.23.23 0 00-.07.17c0 .04 0 .07.02.1l.07.19c.14.25.38.57.7.95.32.38.65.7 1 .97.38.31.7.54.95.68l.18.07c.04.02.07.02.1.02.07 0 .13-.03.18-.08l.34-.35c.1-.11.2-.19.31-.25.11-.06.21-.09.33-.09.1 0 .19.02.3.07.12.05.25.12.38.21l1.72 1.22c.13.1.22.21.28.34.05.13.08.26.08.41z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" />
                </svg>
              </span>
              <span className="font-cairo text-sm" dir="ltr">+965 9804 0875</span>
            </a>

            {/* Snapchat */}
            <a
              href="https://www.snapchat.com/add/snap_almutair"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-[#E5DDD0] hover:text-[#C9973A] transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-[#3A3530] flex items-center justify-center group-hover:border-[#C9973A]/50 group-hover:bg-[#C9973A]/10 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.004 2c-3.642 0-6.19 2.766-6.19 6.275 0 1.15.342 2.457.777 3.513.14.34-.012.637-.293.818-.62.4-1.378.784-2.008 1.455-.414.44-.316.97.234 1.26.83.438 1.765.412 2.62.593.424.09.605.378.502.82-.193.826-.745 1.464-1.636 1.725-.457.134-.596.536-.376.924.364.64 1.19.86 2.052.793.682-.053 1.238-.344 1.834-.647.41-.21.782-.24 1.18-.04 1.077.545 2.197.55 3.284-.002.39-.198.756-.168 1.156.04.59.308 1.144.598 1.83.65.867.066 1.696-.153 2.06-.795.22-.387.082-.788-.374-.922-.894-.263-1.444-.9-1.638-1.727-.103-.44.078-.73.502-.82.855-.18 1.79-.155 2.62-.593.55-.29.648-.82.234-1.26-.63-.67-1.388-1.055-2.008-1.455-.28-.18-.433-.478-.293-.818.435-1.056.777-2.363.777-3.513C18.194 4.766 15.646 2 12.004 2z" />
                </svg>
              </span>
              <span className="font-cairo text-sm" dir="ltr">snap_almutair</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/snap_almutair"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-[#E5DDD0] hover:text-[#C9973A] transition-colors group"
            >
              <span className="w-9 h-9 rounded-full border border-[#3A3530] flex items-center justify-center group-hover:border-[#C9973A]/50 group-hover:bg-[#C9973A]/10 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="11.3" cy="4.7" r="0.6" fill="currentColor" />
                </svg>
              </span>
              <span className="font-cairo text-sm" dir="ltr">snap_almutair</span>
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
