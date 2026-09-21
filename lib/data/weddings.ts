import type { Wedding } from "@/types"
import { weddingsData } from "@/lib/constants"

// ---------------------------------------------------------------------------
// In-memory store — seeded from the same data the public site uses.
// Swap this backing store for Supabase calls when the backend is ready.
// ---------------------------------------------------------------------------
let store: Wedding[] = structuredClone(weddingsData)
let nextId = Math.max(...store.map((w) => w.id)) + 1

export async function getWeddings(): Promise<Wedding[]> {
  return [...store].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

export async function getWedding(id: number): Promise<Wedding | undefined> {
  return store.find((w) => w.id === id)
}

export async function createWedding(
  data: Omit<Wedding, "id">
): Promise<Wedding> {
  const wedding: Wedding = { id: nextId++, ...data }
  store.push(wedding)
  return wedding
}

export async function updateWedding(
  id: number,
  data: Partial<Omit<Wedding, "id">>
): Promise<Wedding> {
  const idx = store.findIndex((w) => w.id === id)
  if (idx === -1) throw new Error(`Wedding ${id} not found`)
  store[idx] = { ...store[idx], ...data }
  return store[idx]
}

export async function deleteWedding(id: number): Promise<void> {
  store = store.filter((w) => w.id !== id)
}
