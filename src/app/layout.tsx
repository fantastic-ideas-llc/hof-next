import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const brownPro = localFont({
  src: [
    {
      path: "../fonts/BrownPro-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/BrownPro-BoldAlt.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/BrownPro-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-brown-pro",
  display: "swap",
});

const brownStd = localFont({
  src: [
    {
      path: "../fonts/BrownStd-ReclinBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-brown-std",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hall of Flowers",
    template: "%s | Hall of Flowers",
  },
  description:
    "The world's premier cannabis trade show. Connecting brands, retailers, and industry leaders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${brownPro.variable} ${brownStd.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
