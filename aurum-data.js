// /aurum-data.js
import { supabase } from "/supabaseClient.js";

// Pinta estado de conexión en cualquier página
export async function pintarEstadoConexion(){
  const el = document.querySelector("[data-conn]");
  if(!el) return;
  try{
    // ping barato a perfiles (si no existe, igual marcamos conectado porque hay URL y key)
    await supabase.auth.getSession();
    el.textContent = "Conectado a Supabase";
    el.style.color = "#00f5d4";
  }catch{
    el.textContent = "Modo local (sin Supabase)";
    el.style.color = "#ffd166";
  }
}

// ---- OTs
export async function listarOTs(){
  const { data, error } = await supabase
    .from("ordenes_trabajo")
    .select("id,equipo,tipo,estado,fecha_inicio")
    .order("fecha_inicio",{ascending:false});
  if(error){ console.error(error); return []; }
  return data || [];
}

// ---- RR.HH.
export async function listarTrabajadores(){
  const { data, error } = await supabase
    .from("recursos_humanos")
    .select("id,nombre");
  if(error){ console.error(error); return []; }
  return data || [];
}

// ---- Asignaciones en OT
export async function listarAsignados(ot_id){
  const { data, error } = await supabase
    .from("ot_trabajadores")
    .select("id, funcion, trabajador_id, recursos_humanos!inner(nombre)")
    .eq("ot_id", ot_id);
  if(error){ console.error(error); return []; }
  return (data||[]).map(r=>({
    id: r.id,
    funcion: r.funcion,
    trabajador_id: r.trabajador_id,
    trabajador_nombre: r.recursos_humanos?.nombre || "—"
  }));
}

export async function asignarTrabajadorAOT(ot_id, trabajador_id, funcion){
  const { error } = await supabase
    .from("ot_trabajadores")
    .insert({ ot_id, trabajador_id, funcion });
  if(error) throw error;
}

export async function eliminarAsignacion(id){
  const { error } = await supabase
    .from("ot_trabajadores")
    .delete()
    .eq("id", id);
  if(error) throw error;
}

// ---- Consumos por OT (bodega)
// Intentamos tabla 'movimientos_bodega' y si falla probamos 'consumos_almacen'
async function insertConsumo(payload){
  let r = await supabase.from("movimientos_bodega").insert({
    ot_id: payload.ot_id,
    sku: payload.sku,
    nombre: payload.nombre,
    cantidad: payload.cantidad,
    trabajador_id: payload.trabajador_id,
    tipo: "salida"
  });
  if(r.error && r.error.code === "42P01"){
    r = await supabase.from("consumos_almacen").insert({
      ot_id: payload.ot_id,
      sku: payload.sku,
      nombre: payload.nombre,
      cantidad: payload.cantidad,
      trabajador_id: payload.trabajador_id
    });
  }
  if(r.error) throw r.error;
}

async function selectConsumos(ot_id){
  // primero intentamos 'movimientos_bodega'
  let q = supabase
    .from("movimientos_bodega")
    .select("sku,nombre,cantidad, trabajador:recursos_humanos(nombre)")
    .eq("ot_id", ot_id)
    .eq("tipo","salida");
  let { data, error } = await q;
  if(error && error.code === "42P01"){
    // fallback a 'consumos_almacen'
    const r2 = await supabase
      .from("consumos_almacen")
      .select("sku,nombre,cantidad, trabajador:recursos_humanos(nombre)")
      .eq("ot_id", ot_id);
    data = r2.data; error = r2.error;
  }
  if(error){ console.error(error); return []; }
  return (data||[]).map(x=>({
    sku: x.sku, nombre: x.nombre, cantidad: x.cantidad,
    trabajador_nombre: x.trabajador?.nombre || "—"
  }));
}

export async function registrarConsumo(payload){
  await insertConsumo(payload);
}

export async function listarConsumos(ot_id){
  return await selectConsumos(ot_id);
}