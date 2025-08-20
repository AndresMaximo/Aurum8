<!-- /Js/supabaseClient.js -->
<script>
// ⚠️ Este archivo NO debe usar "type=module".
// Requiere que antes esté cargado el CDN: @supabase/supabase-js v2

const SUPABASE_URL = "https://qwitkswkvfqubowpqmvy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aXRrc3drdmZxdWJvd3BxbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTM0MzYsImV4cCI6MjA3MDg4OTQzNn0.sV-unvowZvZP2q7osj5uL_JNpK-X4J2aLTAlrZOm5to";

// Cliente global: window.sb
window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>