import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BottomNav } from "@/components/bottom-nav"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Apple Store Kolwezi | Marketplace iPhone RDC",
  description: "Achetez vos iPhones en toute sécurité à Kolwezi. iPhones Box, Occasion et Accessoires avec commande directe sur WhatsApp.",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer className="hidden md:block" />
        </div>
        <BottomNav />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}

