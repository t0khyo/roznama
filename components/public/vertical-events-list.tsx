"use client"

import * as React from "react"
import type { Event } from "@/types"
import { formatArabicDate } from "@/lib/date-utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/* ─── Per-card fade-in-up hook ─────────────────────────────────────────── */
function useRevealRef(delay: number) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    el.style.opacity = "0"
    el.style.transform = "translateY(40px)"
    el.style.transition = `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`
    el.style.willChange = "opacity, transform"

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
        el.style.willChange = "auto"
        observer.disconnect()
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}

/* ─── Single event card ─────────────────────────────────────────────────── */
function EventCard({
  event,
  delay,
  onImageClick,
}: {
  event: Event
  delay: number
  onImageClick: (e: Event) => void
}) {
  const ref = useRevealRef(delay)

  return (
    <div ref={ref} className="w-full">
      {/* Full-size image */}
      <div
        className="relative w-full overflow-hidden rounded-2xl cursor-pointer group bg-[#1A1714]"
        onClick={() => onImageClick(event)}
      >
        {/* Blurred backdrop */}
        <img
          src={event.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50 pointer-events-none"
          draggable={false}
        />

        {/* Primary image */}
        <img
          src={event.imageUrl}
          alt={`مناسبة ${event.tribe}`}
          className="relative w-full object-contain z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ maxHeight: "90vh" }}
          draggable={false}
        />

        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 via-[#1A1714]/10 to-transparent z-20 pointer-events-none" />

        {/* Tribe overlay */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-30 pointer-events-none">
          <p className="font-amiri text-[#E8CC88] text-2xl font-bold drop-shadow-lg">
            {event.tribe}
          </p>
        </div>

        {/* Expand hint */}
        <div className="absolute top-4 end-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="size-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 5V2h3M9 2h3v3M12 9v3H9M5 12H2V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4 px-1">
        <div className="flex-1 h-px bg-[#E5DDD0]" />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-40">
          <circle cx="8" cy="8" r="2" fill="#8B1A1A" />
          <circle cx="2" cy="8" r="1.2" fill="#8B1A1A" />
          <circle cx="14" cy="8" r="1.2" fill="#8B1A1A" />
        </svg>
        <div className="flex-1 h-px bg-[#E5DDD0]" />
      </div>

      {/* Data row */}
      <div className="flex items-center justify-between px-1 pb-2">
        <div>
          <p className="font-cairo font-bold text-base text-[#1A1714] leading-snug">
            {event.groomName}
          </p>
          <p className="font-cairo text-sm text-[#6B5E52] mt-0.5">
            {event.tribe}
          </p>
        </div>
        <div className="text-end">
          <p className="font-cairo text-sm font-semibold text-[#8B1A1A]">
            {formatArabicDate(event.eventDate)}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Main export ───────────────────────────────────────────────────────── */
export default function VerticalEventsList({ events }: { events: Event[] }) {
  const [lightboxEvent, setLightboxEvent] = React.useState<Event | null>(null)

  return (
    <>
      <div className="flex flex-col gap-16">
        {events.map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            delay={i === 0 ? 0 : 80}
            onImageClick={setLightboxEvent}
          />
        ))}
      </div>

      {/* Lightbox */}
      <Dialog
        open={!!lightboxEvent}
        onOpenChange={(open) => !open && setLightboxEvent(null)}
      >
        <DialogContent
          className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-[#1A1714]/95 border-none shadow-2xl"
          showCloseButton={false}
        >
          {lightboxEvent && (
            <div className="relative flex flex-col items-center justify-center w-full min-h-[50vh]">
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 end-3 z-10 size-10 rounded-full bg-white/10 text-zinc-200 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                    aria-label="إغلاق الصورة"
                  />
                }
              >
                <XIcon className="size-5" />
                <span className="sr-only">إغلاق الصورة</span>
              </DialogClose>
              <img
                src={lightboxEvent.imageUrl}
                alt={`مناسبة ${lightboxEvent.tribe}`}
                className="w-full max-h-[85vh] object-contain select-none"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
