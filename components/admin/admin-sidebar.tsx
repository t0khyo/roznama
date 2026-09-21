"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  HeartHandshakeIcon,
  ClipboardListIcon,
  ExternalLinkIcon,
} from "lucide-react"
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
      {/* ── Brand header ── */}
      <SidebarHeader className="border-b border-[#E5DDD0] px-4 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="سناب مطير" className="h-8 w-auto shrink-0" />
          <div className="flex flex-col leading-none overflow-hidden">
            <span
              className="text-base font-bold text-[#1A1714] truncate group-hover:text-[#8B1A1A] transition-colors"
              style={{ fontFamily: "'ThmanyahSerifDisplay', serif" }}
            >
              سناب مطير
            </span>
            <span className="text-[10px] font-cairo text-[#A09080] tracking-wider">
              لوحة التحكم
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="font-cairo text-[11px] text-[#A09080] tracking-widest px-2 mb-1">
            القسم
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                      className={cn(
                        "font-cairo text-sm rounded-lg h-10 gap-3 transition-all duration-200",
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
                      <span>{item.label}</span>
                      {active && (
                        <span className="mr-auto w-1.5 h-1.5 rounded-full bg-[#8B1A1A]" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-[#E5DDD0]/60" />

      {/* ── Footer: link to public site ── */}
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" target="_blank" rel="noreferrer" />}
              tooltip="الموقع العام"
              className="font-cairo text-sm text-[#A09080] hover:text-[#8B1A1A] hover:bg-[#8B1A1A]/6 rounded-lg h-10 gap-3 transition-all"
            >
              <ExternalLinkIcon className="size-4 shrink-0 text-[#C9973A]" />
              <span>عرض الموقع العام</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
