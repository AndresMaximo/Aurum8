<script type="module">
// common/guard.js — Helpers de sesión, perfil y autorización por rol

// === Constantes de navegación ===
const LOGIN_PAGE = '/login.html';
const HOME_PAGE  = '/modulos.html';

// === Jerarquía de roles ===
// Ajusta aquí si agregas nuevos roles (mayor número = mayor permiso)
const ROLE_ORDER = { usuario: 1, supervisor: 2, admin: 3 };

// === Utilidades UI simples ===
function notify(msg) {
  // Reemplaza por tu banner/toast si lo tienes
  try { console.info(msg); }
  catch (_) {}
  alert(msg);
}

function go(path) {
  location.replace(path);
}

// === Sesión y perfil ===
async function getSession() {
  try {
    const { data, error } = await window.db.auth.getSession();
    if (error) throw error;
    return data?.session ?? null;
  } catch (err) {
    console.error('Error obteniendo sesión:', err?.message || err);
    return null;
  }
}

async function getMyProfile() {
  try {
    const s = await getSession();
    if (!s) return null;
    const { data, error } = await window.db
      .from('profiles')
      .select('*')
      .eq('user_id', s.user.id)
      .single();
    if (error) throw error;
    return data ?? null;
  } catch (err) {
    console.warn('No fue posible cargar el perfil:', err?.message || err);
    return null;
  }
}

// === Autorización por rol mínimo ===
async function mustBe(minRole = 'usuario') {
  const session = await getSession();
  if (!session) {
    notify('Tu sesión no está activa. Inicia sesión para continuar.');
    go(LOGIN_PAGE);
    return false;
  }

  const me = await getMyProfile();
  if (!me) {
    notify('No pudimos cargar tu perfil. Vuelve a iniciar sesión.');
    go(LOGIN_PAGE);
    return false;
  }

  const myRank  = ROLE_ORDER[me.role] ?? 0;
  const needRank = ROLE_ORDER[minRole] ?? 999;

  if (myRank < needRank) {
    notify('Acceso restringido. Se requiere rol: ' + minRole);
    go(HOME_PAGE);
    return false;
  }

  // Exponer usuario actual para otras partes del frontend
  window.currentUser = {
    id: session.user.id,
    email: session.user.email,
    role: me.role,
    trabajador_id: me.trabajador_id ?? null,
    nombre: me.nombre ?? null
  };

  return true;
}

// === Extras útiles ===
async function requireAuth() {
  // Igual que mustBe('usuario') pero sin verificar roles
  const ok = await mustBe('usuario');
  return ok;
}

async function signOutAndRedirect() {
  try {
    await window.db.auth.signOut();
  } finally {
    go(LOGIN_PAGE);
  }
}

// Reacción a cambios de sesión (sign-in/out/refresh)
window.db.auth.onAuthStateChange((_event, session) => {
  window.currentUser = session?.user ?? null;
});

// === Exposición global (compatible con tu implementación previa) ===
window.getSession = getSession;
window.getMyProfile = getMyProfile;
window.mustBe = mustBe;
window.requireAuth = requireAuth;
window.signOutAndRedirect = signOutAndRedirect;

</script>
