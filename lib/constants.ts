export const arabicMonths = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
]

export const arabicDaysShort = ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"]

export const navLinks = [
  { label: "الرئيسية", id: "hero" },
  { label: "المناسبات القادمة", id: "upcoming" },
  { label: "التقويم", id: "calendar" },
  { label: "سجل مناسبتك", id: "booking" },
  { label: "تواصل معنا", id: "contact" },
]

export const adminNavItems = [
  {
    label: "نظرة عامة",
    href: "/admin",
    exact: true,
  },
  {
    label: "إدارة المناسبات",
    href: "/admin/events",
    exact: false,
  },
  {
    label: "طلبات الحجز",
    href: "/admin/bookings",
    exact: false,
  },
]
