import "server-only"
import { withDb } from "@/lib/db"
import type { Event } from "@/types"

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

function buildSlug(groomName: string, eventDate: Date | string): string {
  const datePart =
    typeof (eventDate as any)?.toISOString === "function"
      ? (eventDate as Date).toISOString().slice(0, 10)
      : String(eventDate).slice(0, 10)
  return toSlugSegment(`${groomName}-${datePart}`)
}

async function generateSlug(groomName: string, eventDate: Date | string): Promise<string> {
  const base = buildSlug(groomName, eventDate)
  const existing = await withDb(async (db) =>
    await db.orm.public.Event.where({ slug: base }).first()
  )
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
    const existing = await withDb(async (db) =>
      await db.orm.public.Event.where({ shortCode: code }).first()
    )
    if (!existing) return code
  }
  throw new Error("Failed to generate unique shortCode after 10 attempts")
}

// ── Public read functions ────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  return withDb(async (db) =>
    await db.orm.public.Event.orderBy((e) => e.eventDate.asc()).all()
  )
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return withDb(async (db) => await db.orm.public.Event.where({ slug }).first())
}

export async function getEventByShortCode(code: string): Promise<Event | null> {
  return withDb(async (db) => await db.orm.public.Event.where({ shortCode: code }).first())
}

// ── Admin write functions — call only from authed Server Actions ─────────────

export interface CreateEventInput {
  tribe: string
  groomName: string
  eventDate: any
  venue?: string | null
  imageUrl: string
  galleryUrl?: string | null
}

export type UpdateEventInput = Partial<CreateEventInput>

export async function createEvent(data: CreateEventInput): Promise<Event> {
  const slug = await generateSlug(data.groomName, data.eventDate)
  const shortCode = await generateShortCode()
  const eventDateStr =
    typeof (data.eventDate as any)?.toISOString === "function"
      ? (data.eventDate as Date).toISOString().slice(0, 10)
      : String(data.eventDate)

  return withDb(async (db) =>
    await db.orm.public.Event.create({
      tribe: data.tribe,
      groomName: data.groomName,
      eventDate: eventDateStr,
      venue: data.venue ?? null,
      imageUrl: data.imageUrl,
      galleryUrl: data.galleryUrl ?? null,
      slug,
      shortCode,
      clickCount: 0,
    })
  )
}

export async function updateEvent(id: string, data: UpdateEventInput): Promise<Event> {
  const result = await withDb(async (db) => {
    const updateData: Record<string, any> = {}
    if (data.tribe !== undefined) updateData.tribe = data.tribe
    if (data.groomName !== undefined) updateData.groomName = data.groomName
    if (data.eventDate !== undefined) updateData.eventDate = data.eventDate
    if (data.venue !== undefined) updateData.venue = data.venue
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.galleryUrl !== undefined) updateData.galleryUrl = data.galleryUrl

    return await db.orm.public.Event.where({ id }).update(updateData)
  })
  if (!result) throw new Error(`Event ${id} not found`)
  return result
}

export async function deleteEvent(id: string): Promise<void> {
  await withDb(async (db) => {
    await db.orm.public.Event.where({ id }).delete()
  })
}

// ── Short-link click tracking ────────────────────────────────────────────────

export async function incrementClickCount(id: string): Promise<void> {
  await withDb(async (db) => {
    await db.transaction(async (tx) => {
      const event = await tx.orm.public.Event.where({ id }).first()
      if (event) {
        await tx.orm.public.Event.where({ id }).update({
          clickCount: event.clickCount + 1,
        })
      }
    })
  })
}
