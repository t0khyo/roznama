import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getEventByShortCode, incrementClickCount } from "@/lib/data/events"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const event = await getEventByShortCode(code)

  if (!event) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Fire-and-forget: don't await so redirect is immediate
  incrementClickCount(event.id).catch(() => {})

  return NextResponse.redirect(new URL(`/events/${event.slug}`, request.url))
}
