import { ConditionalNavbar } from "@/components/conditional-navbar"
import { ConditionalMain } from "@/components/conditional-main"
import { ConditionalFooter } from "@/components/conditional-footer"
import { BottomNav } from "@/components/bottom-nav"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata = {
  title: "Apple Store Market | iPhone Kolwezi, RDC",
  description:
    "Commandez, achetez ou échangez votre iPhone chez Apple Store Kolwezi. Modèles du XR au 17 Pro Max, troc possible, livraison Kolwezi, Likasi, Lubumbashi.",
  icons: {
    icon: "/favicon.svg",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="light font-sf">
      <body className="font-sf bg-[#f5f5f7] text-[#1d1d1f] antialiased">
        <div className="flex min-h-screen flex-col">
          <ConditionalNavbar />
          <ConditionalMain>{children}</ConditionalMain>
          <ConditionalFooter />
        </div>
        <BottomNav />
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: { fontFamily: 'var(--font-sf)' },
          }}
        />
      </body>
    </html>
  )
}

