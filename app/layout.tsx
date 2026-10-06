import "temporal-polyfill/full/global";
import type { Metadata } from "next";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { CircleCheckIcon } from "lucide-react";
import { thmanyahSans, thmanyahSerif, ibmPlexSansArabic, tajawal } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "سناب مطير — مناسبات",
  description: "مرجعكم للتنسيق والتذكير بمناسبات مطير",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`h-full ${thmanyahSans.variable} ${thmanyahSerif.variable} ${ibmPlexSansArabic.variable} ${tajawal.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <DirectionProvider direction="rtl">{children}</DirectionProvider>
        </ThemeProvider>
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
              icon: "order-last shrink-0",
            },
          }}
        />
      </body>
    </html>
  );
}
