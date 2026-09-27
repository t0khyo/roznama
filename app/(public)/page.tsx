import Navbar from "@/components/public/navbar"
import Hero from "@/components/public/hero"
import UpcomingEvents from "@/components/public/upcoming-events"
import WeddingCalendar from "@/components/public/wedding-calendar"
import BookingForm from "@/components/public/booking-form"
import WhatsappButton from "@/components/public/whatsapp-button"
import Footer from "@/components/public/footer"

import { getDb } from "@/lib/db"

export const revalidate = 60 // ISR cache for 60 seconds

export default async function HomePage() {
  const events = await getDb().event.findMany({
    orderBy: { eventDate: "asc" },
  })

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF8F3] text-[#1A1714]">
      <Navbar />
      <Hero />
      <UpcomingEvents events={events} />
      <WeddingCalendar events={events} />
      <BookingForm />
      <WhatsappButton />
      <Footer />
    </div>
  )
}
