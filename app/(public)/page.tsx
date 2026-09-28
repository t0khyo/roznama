import { Suspense } from "react"
import Navbar from "@/components/public/navbar"
import Hero from "@/components/public/hero"
import UpcomingEvents from "@/components/public/upcoming-events"
import WeddingCalendar from "@/components/public/wedding-calendar"
import BookingForm from "@/components/public/booking-form"
import WhatsappButton from "@/components/public/whatsapp-button"
import Footer from "@/components/public/footer"

import { getEvents } from "@/lib/data/events"
import { Skeleton } from "@/components/ui/skeleton"

export const revalidate = 60 // ISR cache for 60 seconds

async function EventsSection() {
  const events = await getEvents()

  return (
    <>
      <UpcomingEvents events={events} />
      <WeddingCalendar events={events} />
    </>
  )
}

function EventsSkeleton() {
  return (
    <>
      <section className="py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex items-end justify-between">
            <div>
              <Skeleton className="h-4 w-24 mb-3 bg-[#E5DDD0]" />
              <Skeleton className="h-12 w-64 bg-[#E5DDD0]" />
            </div>
            <div className="h-px flex-1 bg-[#E5DDD0] mr-8 mb-4 hidden md:block" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex gap-4 overflow-hidden px-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full max-w-[300px] shrink-0 rounded-2xl bg-[#E5DDD0]" />
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
    <div dir="rtl" className="min-h-screen bg-[#FAF8F3] text-[#1A1714]">
      <Navbar />
      <Hero />
      <Suspense fallback={<EventsSkeleton />}>
        <EventsSection />
      </Suspense>
      <BookingForm />
      <WhatsappButton />
      <Footer />
    </div>
  )
}
