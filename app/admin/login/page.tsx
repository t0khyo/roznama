import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { verifySession } from "@/lib/session"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = {
  title: "تسجيل الدخول — لوحة تحكم سناب مطير",
  description: "تسجيل الدخول لحساب إدارة روزنامة مناسبات سناب مطير",
}

export default async function AdminLoginPage() {
  const session = await verifySession()
  if (session) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FAF8F3] relative overflow-hidden">
      {/* Subtle decorative background circles matching brand colors */}
      <div className="absolute top-1/4 -right-24 size-96 rounded-full bg-[#8B1A1A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 size-96 rounded-full bg-[#C9973A]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
