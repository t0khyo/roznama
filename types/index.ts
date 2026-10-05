import type { FieldOutputTypes } from "@/prisma/contract.d";

export type Event = FieldOutputTypes["public"]["Event"];
export type EventRequest = FieldOutputTypes["public"]["EventRequest"];

export const RequestStatus = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  CLOSED: "CLOSED",
  PUBLISHED: "PUBLISHED",
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];


/** UI label and style map for RequestStatus values */
export const REQUEST_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  NEW: {
    label: "جديد",
    className:
      "bg-[#A8823A]/10 text-[#A8823A] border border-[#A8823A]/25 hover:bg-[#A8823A]/10 font-cairo text-xs",
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
