"use client"

import * as React from "react"
import Image from "next/image"
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
    <div ref={ref} className="w-full flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-500">
      {/* Top Component: Image */}
      <div
        className="relative w-full cursor-pointer"
        onClick={() => onImageClick(event)}
      >
        <Image
          src={event.imageUrl}
          alt={`مناسبة ${event.tribe}`}
          width={800}
          height={1200}
          className="w-full h-auto rounded-md object-contain shadow-sm"
          draggable={false}
          unoptimized
        />
      </div>

      {/* Bottom Component: Event Details Card */}
      <div className="rounded-none border-t-4 border-[#B59410] shadow-sm bg-white p-6 md:p-8 flex flex-col gap-6 group-hover:shadow-xl transition-shadow duration-500">
        {/* Title */}
        <h3 className="text-center font-bold text-[#315F79] text-xl md:text-3xl font-tajawal">
          {event.tribe}
        </h3>

        {/* Details List */}
        <div className="flex flex-col gap-2 font-tajawal">
          {/* Row 1 */}
          <div className="flex justify-between items-start gap-4 pb-3 border-b border-border/50">
            <span className="text-muted-foreground text-sm whitespace-nowrap pt-1">اسم المعرس:</span>
            <span className="font-bold text-[#315F79] text-lg text-left leading-snug">{event.groomName}</span>
          </div>

          {/* Row 2 */}
          <div className="flex justify-between items-center pb-1">
            <span className="text-muted-foreground text-sm">التاريخ:</span>
            <span className="font-bold text-[#315F79] text-lg">{formatArabicDate(event.eventDate)}</span>
          </div>
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
