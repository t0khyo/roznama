import type { BookingRequest, BookingStatus } from "@/types"

// ---------------------------------------------------------------------------
// Mock booking requests — realistic Arabic sample data.
// Swap for Supabase calls when the backend is ready.
// ---------------------------------------------------------------------------
let store: BookingRequest[] = [
  {
    id: 1,
    name: "يوسف بن عبدالله بن صالح الرشيدي",
    phone: "+965 9900 1122",
    date: "2026-11-15",
    venue: "قاعة الأفراح — الجهراء",
    status: "pending",
    submittedAt: "2026-09-10T14:30:00Z",
  },
  {
    id: 2,
    name: "سعود بن منصور بن طلال العتيبي",
    phone: "+965 9801 5544",
    date: "2026-12-01",
    venue: "فندق ماريوت — الكويت",
    status: "approved",
    submittedAt: "2026-09-08T09:15:00Z",
  },
  {
    id: 3,
    name: "حمد بن سلطان بن حمد المطيري",
    phone: "+965 6622 7788",
    date: "2026-11-28",
    venue: "قاعة الملوك — السالمية",
    status: "pending",
    submittedAt: "2026-09-12T18:00:00Z",
  },
  {
    id: 4,
    name: "فهد بن ناصر بن علي الشمري",
    phone: "+965 9703 3311",
    date: "2026-10-20",
    venue: "قصر النخيل — الفروانية",
    status: "rejected",
    submittedAt: "2026-09-05T11:45:00Z",
  },
  {
    id: 5,
    name: "بدر بن خالد بن مساعد الحربي",
    phone: "+965 9955 6677",
    date: "2026-12-15",
    venue: "قاعة الزهراء — حولي",
    status: "pending",
    submittedAt: "2026-09-14T20:30:00Z",
  },
]

let nextId = Math.max(...store.map((b) => b.id)) + 1

export async function getBookingRequests(): Promise<BookingRequest[]> {
  return [...store].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )
}

export async function updateBookingStatus(
  id: number,
  status: BookingStatus
): Promise<BookingRequest> {
  const idx = store.findIndex((b) => b.id === id)
  if (idx === -1) throw new Error(`BookingRequest ${id} not found`)
  store[idx] = { ...store[idx], status }
  return store[idx]
}
