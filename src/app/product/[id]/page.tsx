"use client"

import { useState, useEffect } from "react"
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
  Box, 
  Check,
  Zap,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
        .from('products')
        .select(`
          *,
          stores (*),
          product_images (*)
        `)
        .eq('id', id)
        .single()

      if (error || !data) {
        setProduct(null)
      } else {
        const formattedProduct = {
          id: data.id,
          model: data.model_name,
          price: Number(data.price_usd),
          storage: `${data.storage_gb}GB`,
          condition: data.condition,
          color: data.color,
          battery: data.battery_health,
          faceId: data.face_id_working,
          accessories: data.accessories || "Non spécifié",
          city: data.city || data.stores?.city || "Kolwezi",
          store: data.stores?.name || "Vendeur Particulier",
          storeId: data.stores?.id,
          storeSlug: data.stores?.slug,
          whatsapp: data.stores?.whatsapp_number || "243820000000",
          images: data.product_images?.length > 0 
            ? data.product_images.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.image_url)
            : ["/placeholder.svg"],
          ref: `ASK-${data.id.slice(0, 4)}`.toUpperCase()
        }
        setProduct(formattedProduct)
        setActiveImage(formattedProduct.images[0])
      }
      setLoading(false)
    }

    if (id) fetchProduct()
  }, [id])

  const handleWhatsAppOrder = async () => {
    // 1. Log the lead in Supabase
    const supabase = createClient()
    if (supabase && product.id && product.storeId) {
      await supabase
        .from('leads')
        .insert({
          product_id: product.id,
          store_id: product.storeId,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_message: `Intéressé par ${product.model} (${product.price}$)`,
          source: 'whatsapp',
          status: 'new'
        })
    }

    // 2. Open WhatsApp
    const message = `Bonjour, je veux commander cet iPhone
Modèle : ${product.model}
Capacité : ${product.storage}
Couleur : ${product.color}
État : ${product.condition === 'box' ? 'Box / Neuf' : 'Occasion Propre'}
Batterie : ${product.battery}%
Prix : ${product.price}$
Référence : ${product.ref}
Nom client : ${customerName}
Numéro : ${customerPhone}
Lien : ${window.location.href}`

    const encodedMessage = encodeURIComponent(message)
    const cleanWhatsApp = product.whatsapp.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`
    
    toast.success("Ouverture de WhatsApp...")
    
    // Use location.href instead of window.open — Safari iOS blocks window.open in async functions
    window.location.href = whatsappUrl
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="inline-flex items-center text-zinc-400 mb-8">
          <ChevronLeft className="mr-1 h-4 w-4" /> Retour au catalogue
        </div>
        <ProductDetailsSkeleton />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-white">Produit non trouvé</h1>
        <Link href="/catalog">
          <Button className="bg-blue-600">Retour au catalogue</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <Link href="/catalog" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" /> Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5"
          >
            <img 
              src={activeImage} 
              alt={product.model}
              className="object-cover w-full h-full"
            />
            <Badge className={`absolute top-4 right-4 font-black text-white text-xs px-3 py-1 border-0 shadow-lg shadow-blue-600/30 ${product.condition === 'box' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
              {product.condition === 'box' ? '✦ Box / Neuf' : 'Occasion'}
            </Badge>
          </motion.div>
          <div className="flex gap-4">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === img ? 'border-blue-500 scale-95' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            {product.storeSlug ? (
              <Link href={`/vendeur/${product.storeSlug}`} className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-black uppercase tracking-widest text-sm mb-3 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-full w-fit">
                <Store className="h-4 w-4" />
                {product.store}
              </Link>
            ) : (
              <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-sm mb-3 flex items-center gap-2">
                <Store className="h-4 w-4" /> {product.store}
              </p>
            )}
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">{product.model}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-blue-500">{product.price}$</span>
                <span className="text-sm font-bold text-zinc-500 uppercase">USD</span>
              </div>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 py-1">
                En Stock
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-3">
              <Battery className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-zinc-500">Batterie</p>
                <p className="text-sm font-bold text-white">{product.battery}%</p>
              </div>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-zinc-500">Capacité</p>
                <p className="text-sm font-bold text-white">{product.storage}</p>
              </div>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-zinc-500">Face ID</p>
                <p className="text-sm font-bold text-white">{product.faceId ? 'Fonctionnel' : 'N/A'}</p>
              </div>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 p-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-zinc-500">Ville</p>
                <p className="text-sm font-bold text-white">{product.city}</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="text-zinc-400 font-bold text-sm uppercase tracking-wider mb-3">Accessoires inclus</h3>
              <div className="flex flex-wrap gap-2">
                {product.accessories.split(',').map((acc: string, i: number) => (
                  <Badge key={i} variant="secondary" className="bg-zinc-800 text-zinc-300 font-normal">
                    <Check className="h-3 w-3 mr-1 text-emerald-500" /> {acc.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-zinc-900/80 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium">Authenticité & Qualité Garantie par le Vendeur</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Remise en main propre possible à Kolwezi</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
              <Button size="lg" className="h-16 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl w-full shadow-lg shadow-emerald-500/20">
                <MessageCircle className="mr-2 h-6 w-6" /> Commander via WhatsApp
              </Button>
            } />
            <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Finaliser la commande</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Remplissez ces informations pour générer votre commande personnalisée sur WhatsApp.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 ml-1">Nom complet</label>
                  <Input 
                    placeholder="Votre nom" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-black border-white/10 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 ml-1">Numéro de téléphone</label>
                  <Input 
                    placeholder="+243..." 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-black border-white/10 h-12 rounded-xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleWhatsAppOrder}
                  disabled={!customerName || !customerPhone}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl"
                >
                  Confirmer et Ouvrir WhatsApp
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
