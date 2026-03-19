-- Database Schema for Apple Store Kolwezi Marketplace

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'seller' CHECK (role IN ('admin', 'seller', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Stores
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  whatsapp_number TEXT NOT NULL,
  city TEXT DEFAULT 'Kolwezi',
  address TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  model_name TEXT NOT NULL,
  storage_gb INTEGER NOT NULL,
  color TEXT NOT NULL,
  condition TEXT DEFAULT 'pre-owned' CHECK (condition IN ('box', 'pre-owned')),
  battery_health INTEGER,
  face_id_working BOOLEAN DEFAULT true,
  accessories TEXT, -- e.g., "Chargeur, Écouteurs"
  price_usd DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 1,
  city TEXT DEFAULT 'Kolwezi',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Leads (WhatsApp tracking)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_message TEXT,
  source TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Stores: Anyone can view stores, owners can manage their own
CREATE POLICY "Stores are viewable by everyone" ON stores FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their own store" ON stores FOR ALL USING (auth.uid() = profile_id);

-- Products: Anyone can view available products, owners can manage
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their own products" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM stores 
    WHERE stores.id = products.store_id AND stores.profile_id = auth.uid()
  )
);

-- Product Images: Anyone can view, sellers can manage their own product images
CREATE POLICY "Product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their own product images" ON product_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products 
    JOIN stores ON products.store_id = stores.id
    WHERE products.id = product_images.product_id AND stores.profile_id = auth.uid()
  )
);

-- Leads: Only store owners and admins can view leads
CREATE POLICY "Sellers can view leads for their store" ON leads FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM stores 
    WHERE stores.id = leads.store_id AND stores.profile_id = auth.uid()
  )
);
CREATE POLICY "Anyone can create a lead" ON leads FOR INSERT WITH CHECK (true);
-- 6. Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'seller');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
