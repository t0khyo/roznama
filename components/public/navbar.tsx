"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/constants"

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div
        className="w-full max-w-4xl"
        style={{ filter: "drop-shadow(0 8px 32px rgba(26,23,20,0.13))" }}
      >
        {/* Main capsule bar */}
        <div
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-full border border-[#E5DDD0]/80"
          style={{ background: "rgba(250,248,243,0.92)", backdropFilter: "blur(16px)" }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex-shrink-0 hover:opacity-75 transition-opacity"
            aria-label="سناب مطير"
          >
            <img src="/logo.png" alt="سناب مطير" className="h-9 w-auto" />
          </button>

          {/* Desktop nav links — center */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.filter((l) => l.id !== "booking").map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="nav-link font-cairo text-sm font-medium text-[#4A4038] hover:text-[#8B1A1A] transition-colors px-3 py-1.5 rounded-full hover:bg-[#8B1A1A]/6"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side: CTA + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* CTA — visible on all sizes */}
            <Button
              onClick={() => scrollTo("booking")}
              className="bg-[#8B1A1A] text-[#FAF8F3] font-cairo font-bold text-sm px-5 py-2 h-auto rounded-full hover:bg-[#6A1212] transition-colors duration-300 whitespace-nowrap"
            >
              سجل مناسبتك
            </Button>

            {/* Hamburger — mobile only, opens Drawer */}
            <Drawer swipeDirection="right">
              <DrawerTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden flex flex-col gap-1.5 size-9 items-center justify-center rounded-full border border-[#E5DDD0] hover:border-[#8B1A1A]/40 transition-colors bg-transparent hover:bg-transparent"
                    aria-label="القائمة"
                  />
                }
              >
                <span className="block w-4 h-px bg-[#1A1714]" />
                <span className="block w-4 h-px bg-[#1A1714]" />
                <span className="block w-4 h-px bg-[#1A1714]" />
              </DrawerTrigger>

              <DrawerContent
                className="md:hidden w-[80vw] max-w-xs border-l border-[#E5DDD0] !rounded-none"
                style={{
                  background: "rgba(250,248,243,0.97)",
                  backdropFilter: "blur(20px)",
                  "--drawer-bleed-background": "#FAF8F3",
                } as React.CSSProperties}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-[#E5DDD0]/60">
                  <img src="/logo.png" alt="سناب مطير" className="h-8 w-auto" />
                  <DrawerClose
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 flex items-center justify-center rounded-full border border-[#E5DDD0] text-[#6B5E52] hover:border-[#8B1A1A]/40 hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent"
                        aria-label="إغلاق"
                      />
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 1l12 12M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </DrawerClose>
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-3 overflow-y-auto">
                  {navLinks
                    .filter((l) => l.id !== "booking")
                    .map((link, idx, arr) => (
                      <DrawerClose
                        key={link.id}
                        render={
                          <button
                            onClick={() => scrollTo(link.id)}
                            className={`w-full text-right px-5 py-4 font-cairo text-base font-medium text-[#4A4038] hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/5 transition-colors ${
                              idx < arr.length - 1 ? "border-b border-[#E5DDD0]/40" : ""
                            }`}
                          />
                        }
                      >
                        {link.label}
                      </DrawerClose>
                    ))}
                </nav>

                {/* Bottom CTA */}
                <div className="p-5 border-t border-[#E5DDD0]/60">
                  <DrawerClose
                    render={
                      <Button
                        onClick={() => scrollTo("booking")}
                        className="w-full bg-[#8B1A1A] text-[#FAF8F3] font-cairo font-bold text-sm py-3.5 h-auto rounded-full hover:bg-[#6A1212] transition-colors duration-300"
                      />
                    }
                  >
                    سجل مناسبتك
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  )
}
