<script>
/* guard.js: helpers de sesión y rol */

window.getSession = async () => {
  const { data } = await window.db.auth.getSession();
  return data.session || null;
};

window.getMyProfile = async () => {
  const s = await window.getSession();
  if(!s) return null;
  const { data, error } = await window.db.from('profiles').select('*').eq('user_id', s.user.id).single();
  if(error) return null;
  return data;
};

/** 
 * Protege una página por rol mínimo.
 * roles en orden: usuario < supervisor < admin
 */
window.mustBe = async (minRole='usuario')=>{
  const order = { usuario:1, supervisor:2, admin:3 };
  const sess = await window.getSession();
  if(!sess){ location.href='/login.html'; return false; }
  const me = await window.getMyProfile();
  if(!me){ location.href='/login.html'; return false; }
  if(order[me.role] < order[minRole]){
    alert('Acceso restringido. Se requiere rol: '+minRole);
    location.href='/modulos.html';
    return false;
  }
  // opcional: expone usuario actual
  window.currentUser = { id:sess.user.id, email:sess.user.email, role:me.role, trabajador_id:me.trabajador_id, nombre:me.nombre };
  return true;
};
</script>