"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  HeartHandshakeIcon,
  ClipboardListIcon,
  ExternalLinkIcon,
  LogOutIcon,
} from "lucide-react"
import { logoutAction } from "@/app/admin/actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "نظرة عامة",
    href: "/admin",
    icon: LayoutDashboardIcon,
    exact: true,
  },
  {
    label: "إدارة المناسبات",
    href: "/admin/weddings",
    icon: HeartHandshakeIcon,
    exact: false,
  },
  {
    label: "طلبات الحجز",
    href: "/admin/bookings",
    icon: ClipboardListIcon,
    exact: false,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      dir="rtl"
      className="border-l border-[#E5DDD0] bg-[#FAF8F3]"
    >
      {/* ── Brand header (Non-clickable branding) ── */}
      <SidebarHeader className="border-b border-[#E5DDD0] px-4 py-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-3 transition-all">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="size-9 group-data-[collapsible=icon]:size-7 rounded-full bg-[#FCFEFB] overflow-hidden flex items-center justify-center border border-[#E5DDD0]/80 shadow-xs shrink-0 transition-all">
            <img src="/logo.png" alt="سناب مطير" className="size-full object-contain p-0.5" />
          </div>
          <div className="flex flex-col leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
            <span
              className="text-base font-bold text-[#1A1714] truncate"
              style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
            >
              سناب مطير
            </span>
            <span className="text-[10px] font-cairo text-[#A09080] tracking-wider">
              لوحة التحكم
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-3 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="font-cairo text-[11px] text-[#A09080] tracking-widest px-2 mb-1 group-data-[collapsible=icon]:hidden">
            القسم
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={{ children: item.label, side: "left" }}
                      className={cn(
                        "font-cairo text-sm rounded-lg h-10 gap-3 transition-all duration-200",
                        "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
                        active
                          ? "bg-[#8B1A1A]/10 text-[#8B1A1A] font-semibold"
                          : "text-[#4A4038] hover:bg-[#8B1A1A]/6 hover:text-[#8B1A1A]"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          active ? "text-[#8B1A1A]" : "text-[#6B5E52]"
                        )}
                      />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      {active && (
                        <span className="mr-auto w-1.5 h-1.5 rounded-full bg-[#8B1A1A] group-data-[collapsible=icon]:hidden" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-[#E5DDD0]/60 group-data-[collapsible=icon]:mx-1" />

      {/* ── Footer: link to public site & logout ── */}
      <SidebarFooter className="px-2 py-3 space-y-1 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              render={<Link href="/" target="_blank" rel="noreferrer" />}
              tooltip={{ children: "عرض الموقع العام", side: "left" }}
              className="font-cairo text-sm text-[#A09080] hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/6 rounded-lg h-10 gap-3 transition-all group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            >
              <ExternalLinkIcon className="size-4 shrink-0 text-[#C9973A]" />
              <span className="group-data-[collapsible=icon]:hidden">عرض الموقع العام</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <form action={logoutAction} className="w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                type="submit"
                tooltip={{ children: "تسجيل الخروج", side: "left" }}
                className="w-full font-cairo text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg h-10 gap-3 transition-all cursor-pointer group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
              >
                <LogOutIcon className="size-4 shrink-0 text-red-500" />
                <span className="group-data-[collapsible=icon]:hidden">تسجيل الخروج</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
