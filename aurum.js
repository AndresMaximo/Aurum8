<script>
/* ==================  AURUM∞ Context & Linking  ================== */
(function (w, d) {
  const KEY_CTX  = 'AURUM_CTX';   // contexto compartido entre módulos
  const KEY_LOGS = 'AURUM_LOGS';  // registros guardados localmente

  // Estado en memoria
  const AURUM = w.AURUM = w.AURUM || {};

  /* ---------- Utils ---------- */
  const nowISO = () => new Date().toISOString();
  const parseQS = () =>
    Object.fromEntries(new URL(location.href).searchParams.entries());

  function loadContext() {
    // 1) desde localStorage
    let ctx = {};
    try { ctx = JSON.parse(localStorage.getItem(KEY_CTX) || '{}'); } catch {}
    // 2) si viene en la URL, sobreescribe
    const qs = parseQS();
    Object.assign(ctx, qs);
    localStorage.setItem(KEY_CTX, JSON.stringify(ctx));
    AURUM.ctx = ctx;
    return ctx;
  }

  function saveContext() {
    localStorage.setItem(KEY_CTX, JSON.stringify(AURUM.ctx || {}));
  }

  /* ---------- API pública ---------- */
  AURUM.get = k => (AURUM.ctx || {})[k];
  AURUM.set = (k, v) => {
    AURUM.ctx = AURUM.ctx || {};
    AURUM.ctx[k] = v;
    saveContext();
    // refleja en inputs con data-bind
    d.querySelectorAll(`[data-bind="${k}"]`).forEach(el => {
      if ('value' in el && el !== d.activeElement) el.value = v ?? '';
      else el.textContent = v ?? '';
    });
  };

  // Adjunta el contexto a un href (para navegación con estado)
  function withCtx(href) {
    if (!href) return href;
    const url = new URL(href, location.origin);
    const ctx = AURUM.ctx || {};
    Object.entries(ctx).forEach(([k, v]) => {
      if (v != null && v !== '') url.searchParams.set(k, v);
    });
    return url.pathname + (url.search ? url.search : '');
  }

  /* ---------- Auto-binding en la UI ---------- */
  function bindInputs() {
    // Completa todos los elementos con data-bind usando el contexto actual
    d.querySelectorAll('[data-bind]').forEach(el => {
      const k = el.getAttribute('data-bind');
      const v = AURUM.get(k) ?? '';
      if ('value' in el) el.value = v;
      else el.textContent = v;
      // Si el usuario escribe, actualizamos el contexto
      if ('addEventListener' in el && 'value' in el) {
        el.addEventListener('input', () => AURUM.set(k, el.value));
        el.addEventListener('change', () => AURUM.set(k, el.value));
      }
    });

    // Enlaces marcados con data-link propagan el contexto por querystring
    d.querySelectorAll('a[data-link]').forEach(a => {
      a.href = withCtx(a.getAttribute('href'));
    });
  }

  /* ---------- Guardado de formularios ---------- */
  function enableFormSave() {
    d.querySelectorAll('form[data-save]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = Object.fromEntries([...fd.entries()]);
        // añade contexto y metadatos
        const record = {
          ...data,
          __ctx: AURUM.ctx || {},
          __page: location.pathname,
          __savedAt: nowISO()
        };
        // guarda en localStorage (modo offline / demo)
        let logs = [];
        try { logs = JSON.parse(localStorage.getItem(KEY_LOGS) || '[]'); } catch {}
        logs.push(record);
        localStorage.setItem(KEY_LOGS, JSON.stringify(logs));
        // feedback simple
        alert('✅ Registro guardado localmente.');
        // opcional: limpiar solo campos “de trabajo”
        // form.reset(); bindInputs();  // si quieres reset
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    loadContext();
    bindInputs();
    enableFormSave();
  });

})(window, document);
</script>