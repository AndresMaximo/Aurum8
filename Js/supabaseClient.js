// /js/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://qwitkswkvfqubowpqmvy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aXRrc3drdmZxdWJvd3BxbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTM0MzYsImV4cCI6MjA3MDg4OTQzNn0.sV-unvowZvZP2q7osj5uL_JNpK-X4J2aLTAlrZOm5to";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
