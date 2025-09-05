// /common/guard.js
const LOGIN_PAGE = '/login.html';

async function getSession() {
  const { data } = await window.db.auth.getSession();
  return data?.session ?? null;
}

async function getMyProfile() {
  const s = await getSession();
  if (!s) return null;
  const { data, error } = await window.db
    .from('profiles').select('*')
    .eq('user_id', s.user.id).single();
  if (error) return null;
  return data;
}

async function mustBe(minRole = 'usuario') {
  const order = { usuario:1, supervisor:2, admin:3 };
  const s = await getSession();
  if (!s) { location.replace(LOGIN_PAGE); return false; }

  const me = await getMyProfile();
  if (!me) { location.replace(LOGIN_PAGE); return false; }

  if ((order[me.role] ?? 0) < (order[minRole] ?? 999)) {
    alert('Acceso restringido. Se requiere rol: ' + minRole);
    location.replace('/modulos.html');
    return false;
  }

  window.currentUser = {
    id: s.user.id,
    email: s.user.email,
    role: me.role,
    nombre: me.nombre ?? null,
  };
  return true;
}

async function requireAuth() { return mustBe('usuario'); }

async function signOutAndRedirect() {
  await window.db.auth.signOut();
  location.replace(LOGIN_PAGE);
}

// Exponer helpers globales (como usas en tus módulos)
window.getSession = getSession;
window.getMyProfile = getMyProfile;
window.mustBe = mustBe;
window.requireAuth = requireAuth;
window.signOutAndRedirect = signOutAndRedirect;

// Mantener currentUser actualizado
window.db.auth.onAuthStateChange((_e, session) => {
  window.currentUser = session?.user ?? null;
});