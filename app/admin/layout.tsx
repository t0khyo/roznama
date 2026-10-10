import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم — رزنامة مطير",
  description: "إدارة المناسبات وطلبات التسجيل",
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
