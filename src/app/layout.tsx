import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { getI18n } from "@/i18n/server";
import { I18nContextProvider } from "@/i18n/client";
import ConvexClientProvider from "@/convex.provider";

const dmsans = DM_Sans({
  variable: "--font-app",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <ClerkProvider signInUrl="/sign-in">
        <ConvexClientProvider>
          <html lang={currentLocale} className={dmsans.variable}>
            <body className="antialiased">{children}</body>
          </html>
        </ConvexClientProvider>
      </ClerkProvider>
    </I18nContextProvider>
  );
}
