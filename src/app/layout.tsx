import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Toaster from "@/components/Toaster";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "NEMTEK Store — Electric Fencing & Gate Automation | Ghana",
  description:
    "Buy genuine NEMTEK electric fencing products and CENTURION gate motors in Ghana. Energizers, wire, remotes, gate operators and accessories with nationwide delivery.",
  applicationName: "NEMTEK Store",
  openGraph: {
    title: "NEMTEK Store — Electric Fencing & Gate Automation",
    description:
      "Genuine NEMTEK & CENTURION products — energizers, gate motors, remotes & more. Available in stock with nationwide delivery across Ghana.",
    siteName: "NEMTEK Store",
    type: "website",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEMTEK Store — Electric Fencing & Gate Automation",
    description: "Genuine NEMTEK & CENTURION products — available in stock across Ghana.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
