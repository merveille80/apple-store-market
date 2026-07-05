"use client"

import { useState, useEffect } from "react"
import { 
  Store, 
  MapPin, 
  MessageSquare, 
  Shield, 
  ShieldCheck,
  Save,
  Camera,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function StoreSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    city: "Kolwezi",
    address: "",
    description: "",
    logo_url: "",
    is_verified: false
  })

  useEffect(() => {
    async function fetchStore() {
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
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (store) {
        setStoreId(store.id)
        setFormData({
          name: store.name || "",
          whatsapp: store.whatsapp_number || "",
          city: store.city || "Kolwezi",
          address: store.address || "",
          description: store.description || "",
          logo_url: store.logo_url || "",
          is_verified: store.is_verified || false
        })
      }
      setIsPageLoading(false)
    }

    fetchStore()
  }, [router])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const supabase = createClient()
    if (!supabase) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-logo-${Math.random()}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, logo_url: publicUrl }))
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erreur inconnue"
      toast.error("Erreur upload logo : " + message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const supabase = createClient()
    if (!supabase) {
      toast.error("Erreur de configuration Supabase.")
      setIsLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const storeData = {
      name: formData.name,
      whatsapp_number: formData.whatsapp,
      city: formData.city,
      address: formData.address,
      description: formData.description,
      logo_url: formData.logo_url,
      profile_id: user.id,
      slug: (formData.name || user.email?.split('@')[0] || "store").toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      updated_at: new Date().toISOString()
    }

    let error
    if (storeId) {
      const { error: updateError } = await supabase
        .from('stores')
        .update(storeData)
        .eq('id', storeId)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('stores')
        .insert(storeData)
      error = insertError
    }

    if (error) {
      toast.error("Erreur lors de l'enregistrement : " + error.message)
    } else {
      toast.success("Paramètres enregistrés !")
      router.refresh()
    }
    setIsLoading(false)
  }

  if (isPageLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-[#0071e3] animate-spin" />
        <p className="text-[#86868b] animate-pulse">Chargement de votre boutique...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div>
        <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">Paramètres du store</h1>
        <p className="text-[#6e6e73] text-[15px] mt-1">Gérez l&apos;identité de votre boutique et vos informations de contact.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl p-6 sm:p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-sf-display text-[17px] font-semibold text-[#1d1d1f]">Identité de la boutique</CardTitle>
              <CardDescription className="text-[#6e6e73]">Ces informations seront visibles par vos clients sur vos fiches produits.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <Label>Nom du store</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Décrivez votre store..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                    <Input 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse physique</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                    <Input 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl p-6 sm:p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-sf-display text-[17px] font-semibold text-[#1d1d1f]">Contact WhatsApp</CardTitle>
              <CardDescription className="text-[#6e6e73]">Le numéro utilisé pour recevoir les commandes clients.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                <Label>Numéro WhatsApp (avec code pays)</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0071e3]" />
                  <Input 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="+243..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-white border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="font-semibold text-[17px] mb-6 text-[#1d1d1f]">Logo du store</h3>
            <div 
              className="relative inline-block group cursor-pointer"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <div className="h-32 w-32 rounded-3xl bg-black/[0.02] border border-black/10 flex items-center justify-center text-[#86868b] overflow-hidden shadow-sm">
                {formData.logo_url ? (
                  <img src={formData.logo_url} alt="Logo du store" className="w-full h-full object-cover" />
                ) : (
                  <Store className="h-12 w-12" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Camera className="h-8 w-8 text-white" />
                )}
              </div>
              <input 
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </div>
            <p className="text-xs text-[#86868b] mt-4 leading-relaxed">
              Format carré recommandé. JPG ou PNG. <br /> Max 2MB.
            </p>
          </Card>

          <Card className="bg-white border border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-2xl p-6 sm:p-8 space-y-4">
             {formData.is_verified ? (
               <div className="flex items-center gap-3 p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                  <ShieldCheck className="h-5 w-5 text-[#0071e3] shrink-0" />
                  <span className="text-sm text-[#1d1d1f] font-medium">Votre store est vérifié et certifié.</span>
               </div>
             ) : (
               <div className="flex items-center gap-3 p-4 bg-black/[0.02] rounded-2xl border border-black/5">
                  <Shield className="h-5 w-5 text-[#86868b] shrink-0" />
                  <span className="text-sm text-[#6e6e73] font-medium">Votre store est en cours de vérification.</span>
               </div>
             )}
             <Button 
              type="submit" 
              disabled={isLoading || isUploading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Enregistrer
            </Button>
          </Card>
        </div>
      </form>
    </div>
  )
}
