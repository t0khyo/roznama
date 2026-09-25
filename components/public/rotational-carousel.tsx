"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { Wedding } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "cn"

export default function WeddingCarousel({ weddings }: { weddings: Wedding[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const count = weddings.length
  const [lightboxImage, setLightboxImage] = React.useState<Wedding | null>(null)

  const autoplay = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        dir="rtl"
        opts={{
          align: "center",
          loop: true,
          direction: "rtl",
          dragFree: false,
          duration: 30,
        }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent className="-ms-3 py-8">
          {weddings.map((w, i) => {
            const isActive = i === current
            return (
              <CarouselItem
                key={w.id}
                className="ps-3 basis-[78%] sm:basis-[52%] md:basis-[36%] lg:basis-[30%]"
              >
                {/* Hero card */}
                <div
                  className="relative rounded-2xl overflow-hidden select-none transition-all duration-500 ease-out"
                  style={{
                    background: "#F3EDE3",
                    border: "1px solid #E5DDD0",
                    opacity: isActive ? 1 : 0.65,
                    transform: isActive ? "scale(1)" : "scale(0.88)",
                    zIndex: isActive ? 10 : 1,
                    boxShadow: isActive
                      ? "0 28px 72px rgba(26,23,20,0.22), 0 4px 20px rgba(139,26,26,0.14)"
                      : "0 6px 20px rgba(26,23,20,0.08)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative aspect-[3/4] overflow-hidden bg-[#1A1714] cursor-pointer group"
                    onClick={() => setLightboxImage(w)}
                  >
                    {/* Blurred background layer */}
                    <img
                      src={w.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60 transition-transform duration-500 group-hover:scale-125"
                      draggable={false}
                    />
                    {/* Foreground contained image */}
                    <img
                      src={w.image}
                      alt={`مناسبة ${w.tribe}`}
                      className="relative w-full h-full object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/80 via-[#1A1714]/15 to-transparent z-10 pointer-events-none" />

                    {/* Bottom text overlay — Tribe name */}
                    <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-20 pointer-events-none">
                      <p className="font-amiri text-[#E8CC88] text-lg sm:text-xl font-bold leading-snug drop-shadow-md">
                        {w.tribe}
                      </p>
                    </div>
                  </div>

                  {/* Card footer — always visible */}
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-cairo font-bold text-sm text-[#1A1714] leading-snug">
                        {w.groom}
                      </p>
                      <p className="font-cairo text-xs text-[#8B1A1A] font-medium mt-0.5">
                        {formatArabicDate(w.date)}
                      </p>
                    </div>
                    {/* Active indicator ring */}
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8B1A1A] flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-5 mt-4">
        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => { api?.scrollPrev(); autoplay.current.reset() }}
          className="size-10 rounded-full border border-[#E5DDD0] flex items-center justify-center text-[#6B5E52] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent"
          aria-label="السابق"
        >
          {/* RTL: prev = scroll right, so arrow points right → */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {weddings.map((_, i) => (
            <button
              key={i}
              onClick={() => { api?.scrollTo(i); autoplay.current.reset() }}
              aria-label={`الانتقال إلى البطاقة ${i + 1}`}
              style={{
                width: i === current ? "22px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === current ? "#8B1A1A" : "#D0C4B0",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => { api?.scrollNext(); autoplay.current.reset() }}
          className="size-10 rounded-full border border-[#E5DDD0] flex items-center justify-center text-[#6B5E52] hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors bg-transparent hover:bg-transparent"
          aria-label="التالي"
        >
          {/* RTL: next = scroll left, so arrow points left ← */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent
          className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-[#1A1714]/95 border-none shadow-2xl [&_[data-slot=dialog-close]]:bg-white/40 [&_[data-slot=dialog-close]]:hover:bg-white/70 [&_[data-slot=dialog-close]]:text-[#1A1714] [&_[data-slot=dialog-close]]:hover:text-[#8B1A1A] [&_[data-slot=dialog-close]]:border-2 [&_[data-slot=dialog-close]]:border-white/60 [&_[data-slot=dialog-close]]:hover:border-white [&_[data-slot=dialog-close]]:backdrop-blur-sm [&_[data-slot=dialog-close]]:shadow-lg [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:size-10 [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:rtl:left-4 [&_[data-slot=dialog-close]]:ltr:right-4 [&_[data-slot=dialog-close]]:z-50 [&_[data-slot=dialog-close]]:transition-all [&_[data-slot=dialog-close]]:duration-200 [&_[data-slot=dialog-close]]:hover:scale-110 [&_[data-slot=dialog-close]]:active:scale-95 [&_[data-slot=dialog-close]_svg]:size-5 [&_[data-slot=dialog-close]_svg]:stroke-[2.5]"
          showCloseButton={true}
        >
          {lightboxImage && (
            <div className="relative flex flex-col items-center justify-center w-full min-h-[50vh]">
              <img
                src={lightboxImage.image}
                alt={`مناسبة ${lightboxImage.tribe}`}
                className="w-full max-h-[85vh] object-contain select-none"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
