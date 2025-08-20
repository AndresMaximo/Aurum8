(function(){
  function wire(){
    const bar = document.querySelector('.topbar');
    if(!bar) return false;
    const btn = bar.querySelector('.hamburger');
    const menu = bar.querySelector('#main-menu');
    if(!btn || !menu) return false;

    // Toggle
    const toggle = () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      bar.classList.toggle('open', !expanded);
    };
    btn.addEventListener('click', toggle);

    // Cerrar al hacer click en un enlace
    menu.addEventListener('click', (e)=>{
      const a = e.target.closest('a');
      if(a){
        btn.setAttribute('aria-expanded','false');
        bar.classList.remove('open');
      }
    });

    // Esc para cerrar
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        btn.setAttribute('aria-expanded','false');
        bar.classList.remove('open');
      }
    });

    // Click afuera para cerrar
    document.addEventListener('click', (e)=>{
      if(!bar.contains(e.target)){
        btn.setAttribute('aria-expanded','false');
        bar.classList.remove('open');
      }
    });

    return true;
  }

  // Para páginas que inyectan topbar.html vía fetch:
  // intenta cablear cada 200ms hasta encontrarlo (máx 3s).
  let tries = 0;
  const timer = setInterval(()=>{
    if(wire() || ++tries > 15) clearInterval(timer);
  }, 200);

  // Si quieres llamar manualmente tras el fetch:
  window.initTopbar = wire;
})();