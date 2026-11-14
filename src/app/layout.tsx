import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QNurse | Your Nursing Learning Companion",
    template: "%s | QNurse",
  },
  description:
    "Prepare for your nursing examinations with structured practice, clinical learning resources and personalised study tools.",
  applicationName: "QNurse",
  keywords: [
    "QNurse",
    "NCLEX",
    "Nursing Education",
    "NCLEX-RN",
    "NCLEX-PN",
    "Nursing Practice Questions",
  ],
};

export const viewport: Viewport = {
  themeColor: "#3A0CA3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}