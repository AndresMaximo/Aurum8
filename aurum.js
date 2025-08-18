<!-- Cargar SDK antes de este archivo -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script>
  // ⬇⬇ EDITA SOLO ESTAS DOS CONSTANTES ⬇⬇
  const SUPABASE_URL  = "https://awtsikwkfqluobpmqywi.supabase.co";
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aXRrc3drdmZxdWJvd3BxbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTM0MzYsImV4cCI6MjA3MDg4OTQzNn0.sV-unvowZvZP2q7osj5uL_JNpK-X4J2aLTAlrZOm5to";
  // ⬆⬆ EDITA SOLO ESTAS DOS CONSTANTES ⬆⬆

  window.db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // Helper simple de UX
  window.toast = (msg)=>{ console.log("AURUM∞:", msg); };
</script>
