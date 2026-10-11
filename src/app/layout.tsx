import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import Navbar from "@/components/shared/navbar";
import PriceMarquee from "@/components/priceMarquee";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/shared/footer";

const notoSerifBangali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "দৈনন্দিন বাজারের পণ্যের সঠিক দাম জানুন",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${notoSerifBangali.className} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Suspense
            fallback={
              <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
                <div className="h-[68px] border-b border-gray-100" />
                <div className="h-12 border-b border-gray-100" />
              </header>
            }
          >
            <Navbar />
          </Suspense>

          <PriceMarquee />

          <main className="flex-1">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
