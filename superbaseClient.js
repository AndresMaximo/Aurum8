<!-- /supabaseClient.js -->
<script type="module">
  import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

  // ➜ TUS CREDENCIALES (públicas) DE SUPABASE
  const SUPABASE_URL = "https://qwitkswkvfqubowpqmvy.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aXRrc3drdmZxdWJvd3BxbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTM0MzYsImV4cCI6MjA3MDg4OTQzNn0.sV-unvowZvZP2q7osj5uL_JNpK-X4J2aLTAlrZOm5to";

  // Cliente compartido para toda la app
  window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Bandera global para que las pantallas muestren "Conectado"
  window.AURUM_BACKEND = "supabase";
</script>