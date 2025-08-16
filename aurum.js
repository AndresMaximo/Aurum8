
// JS base (placeholder). Aquí podemos agregar telemetría simple o helpers.
document.addEventListener('DOMContentLoaded', () => {
  // Realce del link activo por URL (por si navegas directo a subrutas)
  const path = location.pathname.replace(/\/+$/, '');
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/+$/, '');
    if (href && path.endsWith(href)) a.classList.add('active');
  });
});