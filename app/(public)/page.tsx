import { Suspense } from "react"
import Navbar from "@/components/public/navbar"
import Hero from "@/components/public/hero"
import UpcomingEvents from "@/components/public/upcoming-events"
import WeddingCalendar from "@/components/public/wedding-calendar"
import BookingForm from "@/components/public/booking-form"
import WhatsappButton from "@/components/public/whatsapp-button"
import Footer from "@/components/public/footer"
import ScrollReveal from "@/components/public/scroll-reveal"

import { getEvents } from "@/lib/data/events"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic";

async function EventsSection() {
  const events = await getEvents()

  return (
    <ScrollReveal>
      <UpcomingEvents events={events} />
      <WeddingCalendar events={events} />
    </ScrollReveal>
  )
}

function EventsSkeleton() {
  return (
    <>
      <section className="py-24">
        <div className="max-w-xl mx-auto px-6 mb-14">
          <div className="flex items-end gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-3 bg-[#E5DDD0]" />
              <Skeleton className="h-12 w-64 bg-[#E5DDD0]" />
            </div>
            <div className="h-px flex-1 bg-[#E5DDD0] mb-4 hidden md:block" />
          </div>
        </div>
        {/* Stacked vertical card skeletons */}
        <div className="max-w-xl mx-auto px-6 flex flex-col gap-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-[3/4] rounded-2xl bg-[#E5DDD0]" />
              <div className="my-4 h-px bg-[#E5DDD0]" />
              <div className="flex justify-between items-center px-1">
                <div>
                  <Skeleton className="h-4 w-32 mb-2 bg-[#E5DDD0]" />
                  <Skeleton className="h-3 w-20 bg-[#E5DDD0]" />
                </div>
                <Skeleton className="h-4 w-24 bg-[#E5DDD0]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#F3EDE3]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <Skeleton className="h-4 w-24 mb-3 bg-[#E5DDD0]" />
            <Skeleton className="h-12 w-48 bg-[#E5DDD0]" />
          </div>
          <Skeleton className="w-full h-[500px] rounded-2xl bg-[#FAF8F3]" />
        </div>
      </section>
    </>
  )
}

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen text-[#1A1714]">
      <Navbar />
      <Hero />
      <Suspense fallback={<EventsSkeleton />}>
        <EventsSection />
      </Suspense>
      <ScrollReveal>
        <BookingForm />
        <Footer />
      </ScrollReveal>
      <WhatsappButton />
    </div>
  )
}
