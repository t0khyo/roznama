import Navbar from "@/components/public/navbar"
import Hero from "@/components/public/hero"
import UpcomingWeddings from "@/components/public/upcoming-weddings"
import WeddingCalendar from "@/components/public/wedding-calendar"
import BookingForm from "@/components/public/booking-form"
import WhatsappButton from "@/components/public/whatsapp-button"
import Footer from "@/components/public/footer"

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF8F3] text-[#1A1714]">
      <Navbar />
      <Hero />
      <UpcomingWeddings />
      <WeddingCalendar />
      <BookingForm />
      <WhatsappButton />
      <Footer />
    </div>
  )
}
