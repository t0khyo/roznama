import localFont from "next/font/local";

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
