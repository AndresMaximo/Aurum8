// /js/aurum-data.js
import { supabase } from "/js/supabaseClient.js";

// ——— Utilidad: estado de conexión (opcional en UI)
export async function pintarEstadoConexion(){
  const el = document.querySelector("[data-conn]");
  if(!el) return;
  try{
    const { error } = await supabase.from("recursos_humanos").select("count", { head:true, count:"exact" });
    if(error) throw error;
    el.textContent = "conectado";
  }catch(e){
    console.error("[conn] Supabase:", e);
    el.textContent = "error";
  }
}

// ——— Recursos Humanos
export async function listarTrabajadores(){
  const { data, error } = await supabase
    .from("recursos_humanos")
    .select("*")
    .order("created_at", { ascending:false }); // created_at si la tienes; si no, quita esta línea
  if(error) throw error;
  return data || [];
}

export async function crearTrabajador({ nombre, rut, cargo }){
  const { error } = await supabase
    .from("recursos_humanos")
    .insert([{ nombre, rut, cargo }]);
  if(error) throw error;
  return true;
}

// ——— (Por si luego los usas en OT/Bodega)
export async function listarOTs(){
  const { data, error } = await supabase.from("ordenes_trabajo").select("*").order("fecha_inicio", { ascending:false });
  if(error) throw error;
  return data || [];
}
export async function listarInventario(){
  const { data, error } = await supabase.from("inventario_items").select("*").order("sku", { ascending:true });
  if(error) throw error;
  return data || [];
}