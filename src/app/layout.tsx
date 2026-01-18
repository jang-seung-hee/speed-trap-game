import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegistry from "@/components/PWARegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "특명! 파파라치!",
  description: "고속도로 위의 무법자를 단속하라! 긴장감 넘치는 스피드 트랩 액션 게임",
  manifest: "/manifest.json",
  icons: {
    icon: "/speed_trap_icon.svg",
    shortcut: "/speed_trap_icon.svg",
    apple: "/speed_trap_icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mission! Paparazzi!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PWARegistry />
        {children}
      </body>
    </html>
  );
}
