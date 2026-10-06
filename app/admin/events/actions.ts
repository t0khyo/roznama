"use server"

import { redirect } from "next/navigation"
import { verifySession } from "@/lib/session"
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type CreateEventInput,
  type UpdateEventInput,
} from "@/lib/data/events"

import { uploadImageToR2 } from "@/lib/storage"
import sharp from "sharp"

async function requireAdmin() {
  const session = await verifySession()
  if (!session) redirect("/admin/login")
}

export async function uploadEventImageAction(formData: FormData): Promise<{ url: string }> {
  await requireAdmin()

  const file = formData.get("file") as File | null
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error("لم يتم تحديد أي ملف للرفع")
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("الملف المحدد ليس صورة صالحة")
  }

  // 10MB limit
  const MAX_SIZE = 10 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error("حجم الصورة يتجاوز الحد المسموح به (10 ميجابايت)")
  }

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  // Optimize image with Sharp:
  // - Resize to a max width of 1200px (good for web, doesn't enlarge if smaller)
  // - Convert to WebP format with 80% quality (excellent balance of quality vs file size)
  const optimizedBuffer = await sharp(bytes)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  const optimizedBytes = new Uint8Array(optimizedBuffer)

  // Update filename and mime type to reflect WebP conversion
  const originalNameParts = file.name.split('.')
  if (originalNameParts.length > 1) {
    originalNameParts.pop() // remove old extension
  }
  const optimizedName = `${originalNameParts.join('.')}.webp`

  const url = await uploadImageToR2(optimizedBytes, optimizedName, "image/webp")
  return { url }
}

export async function getEventsAction() {
  await requireAdmin()
  return getEvents()
}

export async function createEventAction(data: CreateEventInput) {
  await requireAdmin()
  return createEvent(data)
}

export async function updateEventAction(id: string, data: UpdateEventInput) {
  await requireAdmin()
  return updateEvent(id, data)
}

export async function deleteEventAction(id: string) {
  await requireAdmin()
  return deleteEvent(id)
}
