import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = fs.readFileSync('.env.local', 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]
if (!url || !key) throw new Error("Clés Supabase introuvables dans .env.local")
const supabase = createClient(url, key)
async function main() {
  const { data: stores } = await supabase.from('stores').select('*')
  console.log(stores)
}
main()
