"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  CalendarDays,
  MessageSquareDot,
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
  useSidebar,
} from "@/components/ui/sidebar"
import { adminNavItems } from "@/lib/constants"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  isExternal?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "الرئيسية",
    items: [
      { href: "/admin", label: "لوحة التحكم", exact: true, icon: LayoutDashboardIcon },
    ],
  },
  {
    label: "إدارة المحتوى",
    items: [
      { href: "/admin/events", label: "المناسبات", icon: CalendarDays },
      { href: "/admin/bookings", label: "طلبات التسجيل", icon: MessageSquareDot },
    ],
  },
  {
    label: "اخرى",
    items: [
      { href: "/", label: "الموقع الرئيسي", icon: ExternalLinkIcon, isExternal: true },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      dir="rtl"
      className="border-l border-sidebar-border bg-sidebar"
    >
      {/* ── Brand header (Non-clickable branding) ── */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-3 transition-all">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <img src="/logo.png" alt="رزنامة مطير" className="size-10 group-data-[collapsible=icon]:size-8 object-contain drop-shadow-sm shrink-0 transition-all" />
          <div className="flex flex-col leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
            <span
              className="text-base font-bold text-sidebar-foreground truncate"
              style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
            >
              رزنامة مطير
            </span>
            <span className="text-[10px] font-cairo text-muted-foreground tracking-wider">
              لوحة التحكم
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-3 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        {NAV_GROUPS.map((group, index) => (
          <SidebarGroup key={index} className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupLabel className="font-cairo text-[11px] text-muted-foreground tracking-widest px-2 mb-1 group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                {group.items.map((item) => {
                  const active = item.isExternal ? false : isActive(item.href, !!item.exact)
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                      <SidebarMenuButton
                        render={<Link href={item.href} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noreferrer" : undefined} />}
                        isActive={active}
                        tooltip={{ children: item.label, side: "left" }}
                        onClick={() => !item.isExternal && setOpenMobile(false)}
                        className={cn(
                          "font-cairo text-sm rounded-lg h-10 gap-3 transition-all duration-200",
                          "group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
                          active
                            ? "bg-sidebar-primary/10 text-sidebar-primary font-semibold"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            active ? "text-sidebar-primary" : "text-sidebar-foreground/60"
                          )}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        {active && (
                          <span className="mr-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary group-data-[collapsible=icon]:hidden" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="bg-sidebar-border/60 group-data-[collapsible=icon]:mx-1" />

      {/* ── Footer: Logout ── */}
      <SidebarFooter className="px-2 py-3 space-y-1 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <form action={logoutAction} className="w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                type="submit"
                tooltip={{ children: "تسجيل الخروج", side: "left" }}
                className="w-full font-cairo text-sm text-sidebar-foreground/80 hover:bg-sidebar-primary/10 hover:text-sidebar-primary rounded-lg h-10 gap-3 transition-all cursor-pointer group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
              >
                <LogOutIcon className="size-4 shrink-0 text-sidebar-primary" />
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
