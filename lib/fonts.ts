import localFont from "next/font/local";
import { IBM_Plex_Sans_Arabic, Tajawal } from "next/font/google";

export const thmanyahSans = localFont({
  src: [
    {
      path: "../public/fonts/thmanyahsans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/thmanyahsans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/thmanyahsans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/thmanyahsans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-thmanyah-sans",
  display: "swap",
});

export const thmanyahSerif = localFont({
  src: [
    {
      path: "../public/fonts/thmanyahserifdisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-thmanyah-serif",
  display: "swap",
});

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});
