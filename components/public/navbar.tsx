"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/constants"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center bg-background/95 backdrop-blur-md border-b border-border/80 transition-all duration-300">
      <div className="w-full">
        {/* Main capsule bar */}
        <div className="flex items-center justify-between gap-3 px-6 md:px-12 py-3">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex-shrink-0 hover:opacity-85 transition-opacity"
            aria-label="رزنامة مطير"
          >
            <img src="/logo.png" alt="رزنامة مطير" className="size-10 object-contain drop-shadow-sm" />
          </button>

          {/* Desktop nav links — center */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.filter((l) => l.id !== "booking").map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="font-cairo text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-primary/5"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side: CTA + Mode Toggle + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ModeToggle />
            {/* CTA — visible on all sizes */}
            <Button
              onClick={() => window.open("https://wa.me/96598040875", "_blank")}
              className="bg-gradient-to-tr from-primary via-primary-dark to-primary animate-gradient-shift text-primary-foreground font-cairo font-bold text-sm px-5 py-2 h-auto rounded-md hover:opacity-90 hover:scale-95 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 whitespace-nowrap active:scale-95"
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
                    className="md:hidden flex size-9 items-center justify-center rounded-md border border-border text-foreground hover:border-primary/40 hover:text-primary transition-colors bg-transparent hover:bg-transparent"
                    aria-label="القائمة"
                  />
                }
              >
                <Menu className="w-5 h-5" />
              </DrawerTrigger>

              <DrawerContent
                className="md:hidden w-[80vw] max-w-xs border-l border-border !rounded-none bg-background/95 backdrop-blur-md"
                style={{
                  "--drawer-bleed-background": "var(--background)",
                } as React.CSSProperties}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-border/60">
                  <img src="/logo.png" alt="رزنامة مطير" className="size-10 object-contain drop-shadow-sm" />
                  <DrawerClose
                    render={
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 flex items-center justify-center rounded-md border border-border text-foreground/70 hover:border-primary/40 hover:text-primary transition-colors bg-transparent hover:bg-transparent"
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
                            className={`w-full text-right px-5 py-4 font-cairo text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors ${
                              idx < arr.length - 1 ? "border-b border-border/40" : ""
                            }`}
                          />
                        }
                      >
                        {link.label}
                      </DrawerClose>
                    ))}
                </nav>

                {/* Bottom CTA */}
                <div className="p-5 border-t border-border/60">
                  <DrawerClose
                    render={
                      <Button
                        onClick={() => window.open("https://wa.me/96598040875", "_blank")}
                        className="w-full bg-gradient-to-tr from-primary via-primary-dark to-primary animate-gradient-shift text-primary-foreground font-cairo font-bold text-sm py-3.5 h-auto rounded-md hover:opacity-90 hover:scale-95 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-95"
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
