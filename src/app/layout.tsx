import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { getI18n } from "@/i18n/server";
import { I18nContextProvider } from "@/i18n/client";
import ConvexClientProvider from "@/convex.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Condo Manager",
  description: "Manage your condominium with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentLocale } = await getI18n();
  return (
    <I18nContextProvider locale={currentLocale}>
      <ClerkProvider>
        <ConvexClientProvider>
          <html lang={currentLocale}>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </ConvexClientProvider>
      </ClerkProvider>
    </I18nContextProvider>
  );
}
