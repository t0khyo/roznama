import type { Wedding } from "@/types"

export const weddingsData: Wedding[] = [
  {
    id: 1,
    tribe: "العنزي",
    groom: "محمد بن خالد بن سعد العنزي",
    date: "2026-09-12",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 2,
    tribe: "المطيري",
    groom: "عبدالله بن فهد بن ناصر المطيري",
    date: "2026-09-18",
    image: "https://images.unsplash.com/photo-1511285560929-80b456503681?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 3,
    tribe: "الرشيدي",
    groom: "سلطان بن عبدالعزيز بن تركي الرشيدي",
    date: "2026-09-25",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 4,
    tribe: "السبيعي",
    groom: "فيصل بن محمد بن أحمد السبيعي",
    date: "2026-10-03",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 5,
    tribe: "الشمري",
    groom: "بندر بن سعود بن حمد الشمري",
    date: "2026-10-10",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 6,
    tribe: "العجمي",
    groom: "ناصر بن راشد بن يوسف العجمي",
    date: "2026-10-17",
    image: "https://images.unsplash.com/photo-1538439907460-1596cafd4eff?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 7,
    tribe: "الحربي",
    groom: "علي بن سعيد بن مبارك الحربي",
    date: "2026-10-24",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=520&fit=crop&auto=format",
  },
  {
    id: 8,
    tribe: "الدوسري",
    groom: "خالد بن عمر بن صالح الدوسري",
    date: "2026-11-01",
    image: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&h=520&fit=crop&auto=format",
  },
]

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
