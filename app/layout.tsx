import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ZaloButton from "@/components/ZaloButton";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Cá cảnh nhà nuôi`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ocean-800"
        >
          Bỏ qua tới nội dung
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <ZaloButton />
      </body>
    </html>
  );
}
