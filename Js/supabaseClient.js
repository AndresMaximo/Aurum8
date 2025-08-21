// js/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qwitskwkvfqubowpqmyv.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJh...tu_key_completa..."; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});