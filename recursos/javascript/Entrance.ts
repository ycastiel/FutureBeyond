const portal = document.querySelector<HTMLElement>('[data-entrance-portal]');

if (portal) {
  const loginForm = portal.querySelector<HTMLFormElement>('[data-login-form]');
  const feedback = portal.querySelector<HTMLElement>('[data-login-feedback]');
  const guestLink = portal.querySelector<HTMLAnchorElement>('[data-guest-access]');

  // O formulário é apenas parte da narrativa: nada é enviado ou armazenado.
  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    loginForm.reset();

    if (feedback) {
      feedback.hidden = false;
      feedback.classList.remove('login-feedback--shown');
      void feedback.offsetWidth; // Reinicia a animação para tentativas consecutivas.
      feedback.classList.add('login-feedback--shown');
    }
  });

  // Como é um <a href>, a rota continua funcionando mesmo sem JavaScript.
  guestLink?.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    if (portal.classList.contains('is-leaving')) {
      event.preventDefault();
      return;
    }

    // Navegação imediata para usuários que preferem movimento reduzido.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.preventDefault();
    portal.classList.add('is-leaving');

    window.setTimeout(() => {
      window.location.assign(guestLink.href);
    }, 760);
  });
}

// Evita manter a classe de saída quando a página é restaurada pelo histórico.
window.addEventListener('pageshow', () => {
  portal?.classList.remove('is-leaving');
});
