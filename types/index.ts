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
      "bg-ring/10 text-ring border border-ring/25 hover:bg-ring/10 dark:bg-ring/15 dark:border-ring/30 font-cairo text-xs",
  },
  CONTACTED: {
    label: "تم التواصل",
    className:
      "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 dark:hover:bg-blue-500/15 font-cairo text-xs",
  },
  CLOSED: {
    label: "مرفوض",
    className:
      "bg-red-50 text-red-700 border border-red-200 hover:bg-red-50 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/15 font-cairo text-xs",
  },
  PUBLISHED: {
    label: "منشور",
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/15 font-cairo text-xs",
  },
}
