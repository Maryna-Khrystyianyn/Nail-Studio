import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maniküre-Dresden",
  description: "Maniküre - minimale Sorgen, maximale Schönheit",
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Receiving messages provided in `i18n/request.ts`
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-stone-900 min-h-screen flex flex-col`}>
        <NextAuthProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
