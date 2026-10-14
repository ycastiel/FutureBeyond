const portal = document.querySelector<HTMLElement>('[data-entrance-portal]');

if (portal) {
  const loginForm = portal.querySelector<HTMLFormElement>('[data-login-form]');
  const feedback = portal.querySelector<HTMLElement>('[data-login-feedback]');
  const guestLink = portal.querySelector<HTMLAnchorElement>('[data-guest-access]');

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    loginForm.reset();

    if (feedback) {
      feedback.hidden = false;
      feedback.classList.remove('login-feedback--shown');
      void feedback.offsetWidth; // Permite repetir a animação do aviso.
      feedback.classList.add('login-feedback--shown');
    }
  });

  guestLink?.addEventListener('click', (event) => {
    // Preserva Ctrl/Cmd + clique, abertura em nova aba e outros atalhos.
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // O próprio <a href="/home"> funciona sem JavaScript ou com movimento reduzido.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.preventDefault();

    if (portal.classList.contains('is-entering')) {
      return;
    }

    portal.classList.add('is-entering');
    guestLink.setAttribute('aria-disabled', 'true');

    let hasNavigated = false;
    const navigate = () => {
      if (hasNavigated) return;
      hasNavigated = true;
      window.location.assign(guestLink.href);
    };

    // Coordena a navegação com o término real da animação CSS.
    portal.addEventListener('animationend', (animationEvent) => {
      if (animationEvent.animationName === 'portalDive') {
        navigate();
      }
    }, { once: false });

    // Proteção caso o navegador não emita animationend.
    window.setTimeout(navigate, 1500);
  });
}

// Quando o navegador restaura a página pelo histórico, reinicia o portal.
window.addEventListener('pageshow', () => {
  portal?.classList.remove('is-entering');
  portal?.querySelector('[data-guest-access]')?.removeAttribute('aria-disabled');
});
