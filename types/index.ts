// All DB types come from @prisma/client directly.
// Re-exported here so UI components don't depend on @prisma/client directly.
export type { Event, EventRequest } from "@prisma/client"
export { RequestStatus } from "@prisma/client"

export interface Wedding {
  id: number
  tribe: string
  groom: string
  date: string // ISO date string "YYYY-MM-DD"
  image: string // URL
}

/** UI label and style map for RequestStatus values */
export const REQUEST_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  NEW: {
    label: "جديد",
    className:
      "bg-[#C9973A]/10 text-[#C9973A] border border-[#C9973A]/25 hover:bg-[#C9973A]/10 font-cairo text-xs",
  },
  CONTACTED: {
    label: "تم التواصل",
    className:
      "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 font-cairo text-xs",
  },
  CLOSED: {
    label: "مرفوض",
    className:
      "bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 font-cairo text-xs",
  },
  PUBLISHED: {
    label: "منشور",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-cairo text-xs",
  },
}
