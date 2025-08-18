<!-- Cargar SDK antes de este archivo -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script>
  // ⬇⬇ EDITA SOLO ESTAS DOS CONSTANTES ⬇⬇
  const SUPABASE_URL  = "https://awtsikwkfqluobpmqywi.supabase.co";
  const SUPABASE_ANON = "TU_ANON_KEY_AQUÍ";
  // ⬆⬆ EDITA SOLO ESTAS DOS CONSTANTES ⬆⬆

  window.db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // Helper simple de UX
  window.toast = (msg)=>{ console.log("AURUM∞:", msg); };
</script>