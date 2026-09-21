import { Phone } from "lucide-react"
import { FaSnapchat, FaInstagram } from "react-icons/fa6"

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
                <Phone className="w-4 h-4" />
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
                <FaSnapchat className="w-4 h-4" />
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
                <FaInstagram className="w-4 h-4" />
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
