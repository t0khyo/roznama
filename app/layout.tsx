import type { Metadata } from "next"
import { DirectionProvider } from "@/components/ui/direction"
import { Toaster } from "@/components/ui/sonner"
import { CircleCheckIcon } from "lucide-react"
import "./globals.css"

export const metadata: Metadata = {
  title: "سناب مطير — مناسبات",
  description: "مرجعكم للتنسيق والتذكير بالمناسبات",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <DirectionProvider direction="rtl">
          {children}
        </DirectionProvider>
        <Toaster
          position="top-center"
          dir="rtl"
          icons={{
            success: <CircleCheckIcon className="size-5 text-emerald-600" />,
          }}
          toastOptions={{
            classNames: {
              content: "flex-1 flex flex-col items-center text-center",
              title: "text-center font-bold",
              description: "text-center",
            },
          }}
        />
      </body>
    </html>
  )
}
