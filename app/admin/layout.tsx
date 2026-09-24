import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم — سناب مطير",
  description: "إدارة المناسبات وطلبات الحجز",
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
