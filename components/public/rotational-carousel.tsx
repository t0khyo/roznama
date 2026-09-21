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
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { DownloadIcon } from "lucide-react"

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
        }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-3 py-8">
          {weddings.map((w, i) => {
            const isActive = i === current
            return (
              <CarouselItem
                key={w.id}
                className="pl-3 basis-[78%] sm:basis-[52%] md:basis-[36%] lg:basis-[30%]"
                style={{
                  opacity: isActive ? 1 : 0.6,
                  transform: isActive ? "scale(1)" : "scale(0.88)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  zIndex: isActive ? 10 : 1,
                }}
              >
                {/* Hero card */}
                <div
                  className="relative rounded-2xl overflow-hidden select-none"
                  style={{
                    background: "#F3EDE3",
                    border: "1px solid #E5DDD0",
                    boxShadow: isActive
                      ? "0 28px 72px rgba(26,23,20,0.22), 0 4px 20px rgba(139,26,26,0.14)"
                      : "0 6px 20px rgba(26,23,20,0.08)",
                    transition: "box-shadow 0.5s ease",
                  }}
                >
                  {/* Image */}
                  <div 
                    className="relative aspect-[4/3] overflow-hidden bg-[#1A1714] cursor-pointer group"
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
                        قبيلة {w.tribe}
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
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-[#1A1714]/95 border-none shadow-2xl [&_[data-slot=dialog-close]_button]:text-white/80 [&_[data-slot=dialog-close]_button]:hover:text-white [&_[data-slot=dialog-close]_button]:hover:bg-white/10" showCloseButton={true}>
          {lightboxImage && (
            <div className="relative flex flex-col items-center justify-center w-full min-h-[50vh]">
              <img 
                src={lightboxImage.image} 
                alt={`مناسبة ${lightboxImage.tribe}`}
                className="w-full max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <a 
                  href={lightboxImage.image} 
                  download={`invitation-${lightboxImage.id}.jpg`}
                  target="_blank" 
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "flex items-center gap-2 bg-[#8B1A1A] hover:bg-[#6A1212] text-[#FAF8F3] font-cairo font-bold px-6 py-3 h-auto rounded-full transition-colors shadow-lg"
                  )}
                >
                  <DownloadIcon className="w-5 h-5" />
                  <span>تنزيل الصورة</span>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
