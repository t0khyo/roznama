import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "سناب مطير — مناسبات الكويت",
  description: "مرجعكم للتنسيق والتذكير بالمناسبات في الكويت",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
