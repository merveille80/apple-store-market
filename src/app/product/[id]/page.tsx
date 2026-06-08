"use client"

import { useState, useEffect, type ComponentType } from "react"
import { motion } from "framer-motion"
import {
  Smartphone,
  Battery,
  Shield,
  MapPin,
  Store,
  ChevronLeft,
  MessageCircle,
  CheckCircle2,
  Check,
  Zap,
  Loader2,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductDetailsSkeleton } from "@/components/ui/skeletons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function SpecCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] shadow-sm p-4 md:p-5 flex items-center gap-3.5">
      <div className="h-10 w-10 rounded-xl bg-[#0071e3]/8 flex items-center justify-center shrink-0">
        <Icon className="h-[18px] w-[18px] text-[#0071e3]" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#86868b] mb-0.5">{label}</p>
        <p className="text-[15px] font-medium text-[#1d1d1f] truncate">{value}</p>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const supabase = createClient()

      if (!supabase) {
        setProduct(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          stores (*),
          product_images (*)
        `)
        .eq("id", id)
        .single()

      if (error || !data) {
        setProduct(null)
      } else {
        const formattedProduct = {
          id: data.id,
          model: data.model_name,
          price: Number(data.price_usd),
          storage: `${data.storage_gb} Go`,
          condition: data.condition,
          color: data.color,
          battery: data.battery_health,
          faceId: data.face_id_working,
          accessories: data.accessories || "Non spécifié",
          city: data.city || data.stores?.city || "Kolwezi",
          store: data.stores?.name || "Vendeur particulier",
          storeId: data.stores?.id,
          storeSlug: data.stores?.slug,
          whatsapp: data.stores?.whatsapp_number || "243820000000",
          images:
            data.product_images?.length > 0
              ? data.product_images
                  .sort((a: any, b: any) => a.display_order - b.display_order)
                  .map((img: any) => img.image_url)
              : ["/placeholder.svg"],
          ref: `ASK-${data.id.slice(0, 4)}`.toUpperCase(),
        }
        setProduct(formattedProduct)
        setActiveImage(formattedProduct.images[0])
      }
      setLoading(false)
    }

    if (id) fetchProduct()
  }, [id])

  const handleWhatsAppOrder = async () => {
    const supabase = createClient()
    if (supabase && product.id && product.storeId) {
      await supabase.from("leads").insert({
        product_id: product.id,
        store_id: product.storeId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_message: `Intéressé par ${product.model} (${product.price}$)`,
        source: "whatsapp",
        status: "new",
      })
    }

    const message = `Bonjour, je veux commander cet iPhone
Modèle : ${product.model}
Capacité : ${product.storage}
Couleur : ${product.color}
État : ${product.condition === "box" ? "Box / Neuf" : "Occasion propre"}
Batterie : ${product.battery}%
Prix : ${product.price}$
Référence : ${product.ref}
Nom client : ${customerName}
Numéro : ${customerPhone}
Lien : ${window.location.href}`

    const encodedMessage = encodeURIComponent(message)
    const cleanWhatsApp = product.whatsapp.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`

    toast.success("Ouverture de WhatsApp…")
    window.location.href = whatsappUrl
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <div className="container mx-auto px-5 py-8 md:py-12 max-w-[1200px]">
          <div className="inline-flex items-center text-[#86868b] mb-8 text-[14px]">
            <ChevronLeft className="mr-1 h-4 w-4" /> Retour au catalogue
          </div>
          <ProductDetailsSkeleton />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f5f5f7] px-5">
        <h1 className="font-sf-display text-2xl font-semibold text-[#1d1d1f] tracking-[-0.02em]">
          Produit non trouvé
        </h1>
        <Link href="/catalog">
          <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full h-11 px-6">
            Retour au catalogue
          </Button>
        </Link>
      </div>
    )
  }

  const accessoriesList = product.accessories
    .split(",")
    .map((a: string) => a.trim())
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="container mx-auto px-5 py-8 md:py-12 max-w-[1200px]">
        <Link
          href="/catalog"
          className="inline-flex items-center text-[#0071e3] hover:text-[#0077ed] mb-8 md:mb-10 transition-colors text-[14px] font-medium"
        >
          <ChevronLeft className="mr-0.5 h-4 w-4" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square relative overflow-hidden rounded-[28px] bg-white border border-black/[0.04] shadow-sm">
              <img
                src={activeImage}
                alt={product.model}
                className="object-cover w-full h-full"
              />
              <Badge
                className={`absolute top-4 right-4 font-medium text-white text-[11px] px-3 py-1 border-0 rounded-full ${
                  product.condition === "box"
                    ? "bg-[#0071e3]"
                    : "bg-black/55 backdrop-blur-md"
                }`}
              >
                {product.condition === "box" ? "Box / Neuf" : "Occasion"}
              </Badge>
            </div>

            {product.images.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-[12px] font-medium text-[#86868b] px-0.5">
                  {product.images.length === 1
                    ? "Photo du produit"
                    : `${product.images.length} photos — cliquez pour parcourir`}
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      aria-label={`Voir la photo ${idx + 1}`}
                      aria-current={activeImage === img}
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden transition-all shrink-0 bg-white ${
                        activeImage === img
                          ? "ring-2 ring-[#0071e3] ring-offset-2 ring-offset-[#f5f5f7] opacity-100"
                          : "ring-1 ring-black/[0.08] opacity-70 hover:opacity-100 hover:ring-black/[0.12]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.model} — vue ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col"
          >
            {/* Store + title */}
            <div className="mb-8">
              {product.storeSlug ? (
                <Link
                  href={`/vendeur/${product.storeSlug}`}
                  className="inline-flex items-center gap-2 text-[#0071e3] hover:text-[#0077ed] transition-colors font-medium text-[13px] mb-4"
                >
                  <Store className="h-3.5 w-3.5" />
                  {product.store}
                </Link>
              ) : (
                <p className="text-[#86868b] font-medium text-[13px] mb-4 flex items-center gap-2">
                  <Store className="h-3.5 w-3.5" /> {product.store}
                </p>
              )}

              <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-[#1d1d1f] mb-3 tracking-[-0.03em] leading-tight">
                {product.model}
              </h1>

              <p className="text-[13px] text-[#86868b] mb-5">
                Réf. {product.ref}
                {product.color ? ` · ${product.color}` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-sf-display text-[clamp(2rem,4vw,2.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
                    {product.price}$
                  </span>
                  <span className="text-[14px] font-medium text-[#86868b]">USD</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-medium text-[12px] px-3 py-1 rounded-full">
                  En stock
                </Badge>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <SpecCard icon={Battery} label="Batterie" value={`${product.battery}%`} />
              <SpecCard icon={Smartphone} label="Capacité" value={product.storage} />
              <SpecCard
                icon={CheckCircle2}
                label="Face ID"
                value={product.faceId ? "Fonctionnel" : "Non disponible"}
              />
              <SpecCard icon={MapPin} label="Ville" value={product.city} />
              {product.color && (
                <SpecCard icon={Palette} label="Couleur" value={product.color} />
              )}
            </div>

            {/* Accessories */}
            <div className="mb-8">
              <h3 className="text-[13px] font-medium text-[#86868b] mb-3">
                Accessoires inclus
              </h3>
              <div className="flex flex-wrap gap-2">
                {accessoriesList.map((acc: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-white border border-black/[0.06] text-[#1d1d1f] text-[13px] font-medium px-3 py-1.5 rounded-full"
                  >
                    <Check className="h-3 w-3 text-emerald-600" />
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="card-apple p-5 md:p-6 space-y-4 mb-8 !transform-none hover:!transform-none hover:!shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[14px] text-[#1d1d1f] leading-relaxed">
                  Authenticité et qualité garanties par le vendeur
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-[#0071e3] shrink-0 mt-0.5" />
                <span className="text-[14px] text-[#1d1d1f] leading-relaxed">
                  Remise en main propre possible à Kolwezi
                </span>
              </div>
            </div>

            {/* CTA */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <Button
                    size="lg"
                    className="h-[52px] text-[16px] font-medium bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full w-full shadow-sm"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Commander via WhatsApp
                  </Button>
                }
              />
              <DialogContent className="bg-white border-black/10 text-[#1d1d1f] sm:max-w-[420px] rounded-[28px] p-6 md:p-8">
                <DialogHeader>
                  <DialogTitle className="font-sf-display text-[22px] font-semibold tracking-[-0.02em]">
                    Finaliser la commande
                  </DialogTitle>
                  <DialogDescription className="text-[#6e6e73] text-[15px]">
                    Renseignez vos coordonnées pour générer votre message WhatsApp personnalisé.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#86868b]">
                      Nom complet
                    </label>
                    <Input
                      placeholder="Votre nom"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-white border-black/10 h-12 rounded-xl text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#86868b]">
                      Numéro de téléphone
                    </label>
                    <Input
                      placeholder="+243…"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-white border-black/10 h-12 rounded-xl text-[15px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleWhatsAppOrder}
                    disabled={!customerName || !customerPhone}
                    className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white text-[15px] font-medium rounded-full"
                  >
                    Confirmer et ouvrir WhatsApp
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
