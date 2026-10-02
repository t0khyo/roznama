import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatArabicDate } from "@/lib/date-utils";
import { ArrowRightIcon, ImageIcon, MapPinIcon } from "lucide-react";
import { getEventBySlug } from "@/lib/data/events";
import { ShareButton } from "./share-button";
import { ViewCounter } from "./view-counter";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "المناسبة غير موجودة",
    };
  }

  const dateStr = formatArabicDate(event.eventDate);
  const title = `دعوة: حفل زفاف ${event.groomName}`;
  const description = `نتشرف بدعوتكم لحضور حفل زفاف ${event.groomName} من قبيلة ${event.tribe} يوم ${dateStr}${event.venue ? ` في ${event.venue}` : ""}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [event.imageUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [event.imageUrl],
    },
  };
}

export default async function EventPage(props: Props) {
  const params = await props.params;
  const slug = params.slug;

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const dateStr = formatArabicDate(event.eventDate);

  return (
    <main className="min-h-screen bg-[#FAF8F3] flex flex-col px-4 py-8 md:py-12 items-center relative overflow-x-hidden">
      {/* Background accents */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#8B1A1A]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-32 top-1/4 size-96 rounded-full bg-[#8B1A1A]/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-1/4 size-96 rounded-full bg-[#C9973A]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-6 animate-fade-up">
        {/* Nav / Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-cairo text-[#A09080] hover:text-[#8B1A1A] transition-colors"
          >
            <ArrowRightIcon className="size-4" />
            <span>العودة للروزنامة</span>
          </Link>
          <div className="h-8">
            <img src="/logo.png" alt="سناب مطير" className="h-full object-contain opacity-50" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#FCFEFB] border border-[#E5DDD0] rounded-2xl overflow-hidden shadow-sm">
          {/* Image */}
          <div className="relative w-full aspect-[3/4] bg-[#F5F2EA]">
            <Image
              src={event.imageUrl}
              alt={`دعوة زفاف ${event.groomName}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 36rem"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="space-y-2">
              <span className="inline-block text-[#C9973A] font-cairo text-sm font-medium tracking-widest border border-[#C9973A]/30 bg-[#C9973A]/5 px-3 py-1 rounded-full">
                {event.tribe}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1714] leading-tight mt-2" style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}>
                حفل زفاف<br />{event.groomName}
              </h1>
            </div>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#E5DDD0] to-transparent mx-auto" />

            <div className="space-y-3 font-cairo text-[#4A4038]">
              <p className="flex items-center justify-center gap-2 text-lg">
                <span className="w-2 h-2 rounded-full bg-[#8B1A1A]/20 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#8B1A1A]" />
                </span>
                {dateStr}
              </p>
              {event.venue && (
                <p className="flex items-center justify-center gap-2 text-sm text-[#7D6E63]">
                  <MapPinIcon className="size-4 text-[#C9973A]" />
                  {event.venue}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {event.galleryUrl && (
                <a
                  href={event.galleryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#6A1212] text-white font-cairo font-bold h-12 rounded-xl transition-all shadow-sm"
                >
                  <ImageIcon className="size-4" />
                  <span>تغطية الحفل (الصور)</span>
                </a>
              )}
              
              <ShareButton 
                title={`دعوة: حفل زفاف ${event.groomName}`}
                text={`نتشرف بدعوتكم لحضور حفل زفاف ${event.groomName} يوم ${dateStr}`}
              />
              <ViewCounter eventId={event.id} count={event.clickCount} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center font-cairo text-[#A09080] text-xs">
          روزنامة مناسبات سناب مطير
        </p>
      </div>
    </main>
  );
}
