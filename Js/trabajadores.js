// /js/trabajadores.js
import { supabase } from '/js/supabaseClient.js';
import '/common/guard.js';

const form = document.getElementById('frmTrabajador');
const rows = document.getElementById('tblRows');
const msg  = document.getElementById('msg');

// Proteger página (mínimo usuario)
await window.requireAuth();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = 'Guardando…';

  const session = await window.getSession();
  if (!session) {
    alert('Tu sesión expiró. Inicia sesión.');
    location.replace('/login.html');
    return;
  }

  // Datos del formulario
  const fd = new FormData(form);
  const record = {
    user_id:  session.user.id,               // CLAVE para RLS
    nombre:   fd.get('nombre')?.trim(),
    rut:      fd.get('rut')?.trim() || null,
    cargo:    fd.get('cargo')?.trim() || null,
    telefono: fd.get('telefono')?.trim() || null,
    email:    fd.get('email')?.trim() || null,
  };

  // Validación mínima
  if (!record.nombre) {
    msg.textContent = 'El nombre es obligatorio.'; return;
  }

  // Insert
  const { data, error } = await supabase
    .from('trabajadores')
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error(error);
    msg.textContent = 'No se pudo guardar: ' + (error.message || 'Error');
    return;
  }

  msg.textContent = 'Trabajador guardado ✅';
  form.reset();
  await loadRows(); // refrescar listado
});

// Cargar listado (solo mis registros, gracias a RLS)
async function loadRows() {
  rows.innerHTML = `<tr><td colspan="6">Cargando…</td></tr>`;

  const { data, error } = await supabase
    .from('trabajadores')
    .select('id, created_at, nombre, rut, cargo, telefono, email')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    rows.innerHTML = `<tr><td colspan="6">Error cargando datos</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    rows.innerHTML = `<tr><td colspan="6">Sin registros</td></tr>`;
    return;
  }

  rows.innerHTML = data.map(r => `
    <tr>
      <td>${escapeHTML(r.nombre)}</td>
      <td>${escapeHTML(r.rut ?? '')}</td>
      <td>${escapeHTML(r.cargo ?? '')}</td>
      <td>${escapeHTML(r.telefono ?? '')}</td>
      <td>${escapeHTML(r.email ?? '')}</td>
      <td>${new Date(r.created_at).toLocaleString()}</td>
    </tr>
  `).join('');
}

// util mínimo para evitar inyecciones en la tabla
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

await loadRows();