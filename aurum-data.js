<!-- /aurum-data.js -->
<script type="module">
  const sb = window.supabase;

  // ===== Recursos Humanos =====
  export async function listarTrabajadores() {
    const { data, error } = await sb
      .from("trabajadores")
      .select("id, nombre, rut, cargo")
      .order("nombre", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  export async function crearTrabajador(payload) {
    const { data, error } = await sb
      .from("trabajadores")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ===== Órdenes de Trabajo =====
  export async function listarOTs() {
    const { data, error } = await sb
      .from("ordenes_trabajo")
      .select("id, equipo, tipo, estado, fecha_inicio")
      .order("fecha_inicio", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  export async function asignarTrabajadorAOT(ot_id, trabajador_id, funcion) {
    const { data, error } = await sb
      .from("ot_trabajadores")
      .insert({ ot_id, trabajador_id, funcion })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ===== Bodega / Consumos =====
  export async function listarInventario() {
    const { data, error } = await sb
      .from("inventario")
      .select("id, sku, nombre, stock")
      .order("nombre", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  export async function registrarConsumo({ ot_id, sku, nombre, cantidad, trabajador_id }) {
    const { data, error } = await sb
      .from("consumos_almacen")
      .insert({ ot_id, sku, nombre, cantidad, trabajador_id })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // ===== Utilidad: mostrar estado conexión =====
  export function pintarEstadoConexion(selector = "[data-conn]") {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = window.AURUM_BACKEND === "supabase"
        ? "Conectado a Supabase"
        : "Modo local";
    });
  }
</script>