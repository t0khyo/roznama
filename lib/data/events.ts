import "server-only"
import { getDb } from "@/lib/db"
import type { Event } from "@prisma/client"

export type { Event }

// ── Slug generation ──────────────────────────────────────────────────────────

/** Strip URL-breaking ASCII chars; preserve Arabic Unicode letters and diacritics */
function toSlugSegment(str: string): string {
  return str
    .replace(/[?#[\]@!$&'()*+,;=%"<>{}|\\^`\s]+/g, "-") // break chars → hyphen
    .replace(/-{2,}/g, "-")                                // collapse consecutive hyphens
    .replace(/^-|-$/g, "")                                 // trim leading/trailing hyphens
    .slice(0, 120)
}

function buildSlug(groomName: string, eventDate: Date): string {
  const datePart = eventDate.toISOString().slice(0, 10) // YYYY-MM-DD
  return toSlugSegment(`${groomName}-${datePart}`)
}

async function generateSlug(groomName: string, eventDate: Date): Promise<string> {
  const base = buildSlug(groomName, eventDate)
  const existing = await getDb().event.findUnique({ where: { slug: base } })
  if (!existing) return base
  // Collision: append random 4-char suffix
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

// ── ShortCode generation ─────────────────────────────────────────────────────

// No O/0/I/1 to avoid visual confusion
const SHORT_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

async function generateShortCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = Array.from({ length: 5 }, () =>
      SHORT_CHARS[Math.floor(Math.random() * SHORT_CHARS.length)]
    ).join("")
    const existing = await getDb().event.findUnique({ where: { shortCode: code } })
    if (!existing) return code
  }
  throw new Error("Failed to generate unique shortCode after 10 attempts")
}

// ── Public read functions ────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  return getDb().event.findMany({ orderBy: { eventDate: "asc" } })
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return getDb().event.findUnique({ where: { slug } })
}

export async function getEventByShortCode(code: string): Promise<Event | null> {
  return getDb().event.findUnique({ where: { shortCode: code } })
}

// ── Admin write functions — call only from authed Server Actions ─────────────

export interface CreateEventInput {
  tribe: string
  groomName: string
  eventDate: Date
  venue?: string | null
  imageUrl: string
  galleryUrl?: string | null
}

export type UpdateEventInput = Partial<CreateEventInput>

export async function createEvent(data: CreateEventInput): Promise<Event> {
  const slug = await generateSlug(data.groomName, data.eventDate)
  const shortCode = await generateShortCode()
  return getDb().event.create({
    data: { ...data, slug, shortCode },
  })
}

export async function updateEvent(id: string, data: UpdateEventInput): Promise<Event> {
  return getDb().event.update({ where: { id }, data })
}

export async function deleteEvent(id: string): Promise<void> {
  await getDb().event.delete({ where: { id } })
}

// ── Short-link click tracking ────────────────────────────────────────────────

export async function incrementClickCount(id: string): Promise<void> {
  await getDb().event.update({
    where: { id },
    data: { clickCount: { increment: 1 } },
  })
}
