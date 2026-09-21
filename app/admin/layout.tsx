import type { Metadata } from "next"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

// ── AUTH STUB ──────────────────────────────────────────────────────────────
// When auth is implemented, add a session check here before rendering.
// Example (Supabase):
//   import { createServerClient } from "@supabase/ssr"
//   const supabase = createServerClient(...)
//   const { data: { session } } = await supabase.auth.getSession()
//   if (!session) redirect("/login")
// ──────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "لوحة التحكم — سناب مطير",
  description: "إدارة المناسبات وطلبات الحجز",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-[#FAF8F3]">
          {/* Sidebar renders on the right due to RTL + side="right" */}
          <AdminSidebar />

          {/* Main content area */}
          <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#FAF8F3]">
            {/* Top bar */}
            <header className="flex h-14 items-center gap-3 border-b border-[#E5DDD0] px-4 shrink-0 bg-[#FAF8F3]">
              <SidebarTrigger className="text-[#6B5E52] hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/6 transition-colors" />
              <Separator orientation="vertical" className="h-5 bg-[#E5DDD0]" />
              <span
                className="text-sm font-medium text-[#A09080] font-cairo"
                suppressHydrationWarning
              >
                لوحة تحكم سناب مطير
              </span>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
