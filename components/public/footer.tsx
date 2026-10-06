import { Phone } from "lucide-react"
import { FaSnapchat, FaInstagram } from "react-icons/fa6"

export default function Footer() {
  return (
    <footer id="contact" className="bg-foreground dark:bg-background text-background dark:text-foreground py-20 dark:border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
          <div>
            <img src="/logo.png" alt="سناب مطير" className="h-15 w-auto object-contain mb-4 drop-shadow-sm" />
            <p className="font-cairo text-muted-foreground text-sm max-w-xs">
              مرجعكم للتنسيق والتذكير بمناسبات مطير
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-cairo text-xs text-muted-foreground uppercase tracking-widest">تواصل معنا</p>

            {/* Phone */}
            <a
              href="tel:+96598040875"
              className="flex items-center gap-3 text-muted-foreground hover:text-ring transition-colors group"
            >
              <span className="w-9 h-9 rounded-md border border-footer-border dark:border-border flex items-center justify-center group-hover:border-ring/50 group-hover:bg-ring/10 transition-colors">
                <Phone className="w-4 h-4" />
              </span>
              <span className="font-cairo text-sm" dir="ltr">+965 9804 0875</span>
            </a>

            {/* Snapchat */}
            <a
              href="https://www.snapchat.com/add/snap_almutair"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-ring transition-colors group"
            >
              <span className="w-9 h-9 rounded-md border border-footer-border dark:border-border flex items-center justify-center group-hover:border-ring/50 group-hover:bg-ring/10 transition-colors">
                <FaSnapchat className="w-4 h-4" />
              </span>
              <span className="font-cairo text-sm" dir="ltr">snap_almutair</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/snap_almutair"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-muted-foreground hover:text-ring transition-colors group"
            >
              <span className="w-9 h-9 rounded-md border border-footer-border dark:border-border flex items-center justify-center group-hover:border-ring/50 group-hover:bg-ring/10 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </span>
              <span className="font-cairo text-sm" dir="ltr">snap_almutair</span>
            </a>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-footer-border-dark dark:border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-cairo text-xs text-muted-foreground">
            © {new Date().getFullYear()} سناب مطير. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            <div className="w-1 h-1 rounded-full bg-ring" />
            <div className="w-1 h-1 rounded-full bg-ring/50" />
          </div>
        </div>
      </div>
    </footer>
  )
}
