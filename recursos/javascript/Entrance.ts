const portal = document.querySelector<HTMLElement>('[data-entrance-portal]');

if (portal) {
  const loginForm = portal.querySelector<HTMLFormElement>('[data-login-form]');
  const feedback = portal.querySelector<HTMLElement>('[data-login-feedback]');
  const guestLink = portal.querySelector<HTMLAnchorElement>('[data-guest-access]');
  const portalWindow = portal.querySelector<HTMLElement>('.portal-window');

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    loginForm.reset();

    if (feedback) {
      feedback.hidden = false;
      feedback.classList.remove('login-feedback--shown');
      void feedback.offsetWidth;
      feedback.classList.add('login-feedback--shown');
    }
  });

  guestLink?.addEventListener('click', (event) => {
    // Preserva atalhos do navegador e abertura em nova aba.
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // Sem animação para pessoas que preferem movimento reduzido.
    // Nesse caso, o link HTML navega normalmente.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.preventDefault();
    if (portal.classList.contains('is-entering')) return;

    portal.classList.add('is-entering');
    guestLink.setAttribute('aria-disabled', 'true');

    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      window.location.assign(guestLink.href);
    };

    // A animação pertence à janela, não ao container nem ao overlay.
    portalWindow?.addEventListener('animationend', (animationEvent) => {
      if (
        animationEvent.target === portalWindow &&
        animationEvent.animationName === 'portalFallAway'
      ) {
        navigate();
      }
    });

    // Fallback caso a animação seja interrompida.
    window.setTimeout(navigate, 1700);
  });
}

// Restaurar o estado quando a página voltar do histórico (BFCache).
window.addEventListener('pageshow', () => {
  portal?.classList.remove('is-entering');
  portal?.querySelector('[data-guest-access]')?.removeAttribute('aria-disabled');
});
