"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ChevronLeft, 
  Upload, 
  X, 
  Smartphone, 
  DollarSign, 
  Battery, 
  ShieldCheck, 
  Info,
  Check,
  Zap,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const IPHONE_MODELS = [
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
  "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
  "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 11 Pro Max",
  "iPhone 11 Pro", "iPhone 11", "iPhone XR", "iPhone XS Max"
]

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"]
const COLORS = ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium", "Deep Purple", "Space Black", "Silver", "Gold", "Midnight", "Starlight", "Blue", "Pink", "Yellow"]

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [storeId, setStoreId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    model: "",
    storage: "",
    color: "",
    condition: "pre-owned",
    price: "",
    battery: "100",
    faceId: true,
    accessories: "",
    description: "",
    city: "Kolwezi"
  })

  useEffect(() => {
    async function checkStore() {
      setIsPageLoading(true)
      const supabase = createClient()
      if (!supabase) {
        setIsPageLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!store) {
        toast.error("Vous devez d'abord créer votre boutique dans les paramètres.")
        router.push("/dashboard/settings")
        return
      }

      setStoreId(store.id)
      setIsPageLoading(false)
    }

    checkStore()
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImages([...images, file])
      const url = URL.createObjectURL(file)
      setPreviewUrls([...previewUrls, url])
    }
  }

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
    URL.revokeObjectURL(previewUrls[idx])
    setPreviewUrls(previewUrls.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeId) return

    setIsLoading(true)
    const supabase = createClient()
    if (!supabase) {
      toast.error("Erreur Supabase")
      setIsLoading(false)
      return
    }

    // 1. Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        store_id: storeId,
        model_name: formData.model,
        storage_gb: parseInt(formData.storage.replace('GB', '')),
        color: formData.color,
        condition: formData.condition,
        price_usd: parseFloat(formData.price),
        battery_health: parseInt(formData.battery),
        face_id_working: formData.faceId,
        accessories: formData.accessories,
        city: formData.city,
        status: 'available'
      })
      .select()
      .single()

    if (productError || !product) {
      toast.error("Erreur lors de la création du produit : " + productError?.message)
      setIsLoading(false)
      return
    }

    // 2. Upload images and link them
    let uploadSuccess = 0
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${product.id}/${i}.${fileExt}`
      const filePath = `product-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error(`Erreur upload photo ${i + 1}: ${uploadError.message}`)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath)

        const { error: dbError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: publicUrl,
            display_order: i
          })
        
        if (dbError) {
          console.error('DB insert error:', dbError)
          toast.error(`Erreur sauvegarde image: ${dbError.message}`)
        } else {
          uploadSuccess++
        }
      }
    }
    
    if (images.length > 0 && uploadSuccess === 0) {
      toast.warning("Annonce créée mais les photos n'ont pas pu être uploadées. Vérifiez les permissions Storage dans Supabase.")
    }

    setIsLoading(false)
    toast.success("Annonce publiée avec succès !")
    router.push("/dashboard/products")
  }

  if (isPageLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500 animate-pulse">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products" className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Ajouter un iPhone</h1>
          <p className="text-zinc-500">Remplissez les détails pour publier votre annonce.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-white/5 rounded-3xl p-8">
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Modèle</Label>
                  <Select onValueChange={(val) => setFormData({...formData, model: val as string})}>
                    <SelectTrigger className="bg-black border-white/5 h-12 rounded-xl w-full">
                      <SelectValue placeholder="Sélectionner le modèle" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {IPHONE_MODELS.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Stockage</Label>
                  <Select onValueChange={(val) => setFormData({...formData, storage: val as string})}>
                    <SelectTrigger className="bg-black border-white/5 h-12 rounded-xl w-full">
                      <SelectValue placeholder="ex: 128GB" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {STORAGE_OPTIONS.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Couleur</Label>
                  <Select onValueChange={(val) => setFormData({...formData, color: val as string})}>
                    <SelectTrigger className="bg-black border-white/5 h-12 rounded-xl w-full">
                      <SelectValue placeholder="Couleur de l'iPhone" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      {COLORS.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Prix (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input 
                      type="number" 
                      placeholder="950" 
                      className="pl-10 bg-black border-white/5 h-12 rounded-xl"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label className="text-zinc-400">État</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant={formData.condition === 'box' ? 'default' : 'outline'}
                      className={cn("flex-1 h-12 rounded-xl", formData.condition === 'box' ? 'bg-blue-600' : 'border-white/5 bg-black')}
                      onClick={() => setFormData({...formData, condition: 'box'})}
                    >
                      Box / Neuf
                    </Button>
                    <Button 
                      type="button"
                      variant={formData.condition === 'pre-owned' ? 'default' : 'outline'}
                      className={cn("flex-1 h-12 rounded-xl", formData.condition === 'pre-owned' ? 'bg-blue-600' : 'border-white/5 bg-black')}
                      onClick={() => setFormData({...formData, condition: 'pre-owned'})}
                    >
                      Occasion
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Santé Batterie (%)</Label>
                  <div className="relative">
                    <Battery className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input 
                      type="number" 
                      placeholder="100" 
                      max="100"
                      className="pl-10 bg-black border-white/5 h-12 rounded-xl"
                      value={formData.battery}
                      onChange={(e) => setFormData({...formData, battery: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <div>
                    <Label className="text-sm font-bold">Face ID Fonctionnel</Label>
                    <p className="text-xs text-zinc-500">Désactiver si le Face ID est défectueux.</p>
                  </div>
                </div>
                <Switch 
                  checked={formData.faceId}
                  onCheckedChange={(val) => setFormData({...formData, faceId: val})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Accessoires inclus</Label>
                <Input 
                  placeholder="ex: Chargeur, Boîte, Adaptateur" 
                  className="bg-black border-white/5 h-12 rounded-xl"
                  value={formData.accessories}
                  onChange={(e) => setFormData({...formData, accessories: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Photos & Summary */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-white/5 rounded-3xl p-8">
            <CardContent className="p-0 space-y-6">
              <h3 className="font-bold text-lg mb-4">Photos du produit</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="aspect-square relative rounded-2xl overflow-hidden bg-black border border-white/5 group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-white/5 bg-black flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                    <Upload className="h-6 w-6 text-zinc-600 mb-2" />
                    <span className="text-xs text-zinc-600">Ajouter</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                )}
              </div>

              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex gap-3">
                <Info className="h-5 w-5 text-blue-500 shrink-0" />
                <p className="text-xs text-zinc-400 leading-normal">
                  Ajoutez au moins 3 photos pour augmenter vos chances de vente (Devant, Arrière, Batterie).
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black rounded-2xl text-lg mt-4 shadow-xl shadow-white/5"
                disabled={isLoading || !formData.model}
              >
                {isLoading ? "Publication..." : "Publier l'Annonce"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
