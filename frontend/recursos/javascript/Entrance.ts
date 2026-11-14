import { reconhecerLogin } from './componentes/login/Personagens';

const portal = document.querySelector<HTMLElement>('[data-entrance-portal]');

if (portal) {
  const loginForm = portal.querySelector<HTMLFormElement>('[data-login-form]');
  const feedback = portal.querySelector<HTMLElement>('[data-login-feedback]');
  const guestLink = portal.querySelector<HTMLAnchorElement>('[data-guest-access]');
  const portalWindow = portal.querySelector<HTMLElement>('.portal-window');

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const userField = loginForm.elements.namedItem('visitor-name');
    const passField = loginForm.elements.namedItem('visitor-password');
    const user = userField instanceof HTMLInputElement ? userField.value.trim() : '';
    const pass = passField instanceof HTMLInputElement ? passField.value : '';
    const personagem = reconhecerLogin(user, pass);

    // Login narrativo do ARG, NÃO autenticação segura.
    // Benê, Leo.Fab e Wolftheus: cada personagem ganha a própria página.
    // Jeff_Grease ainda não tem senha oficial definida.
    if (personagem) {
      if (portal.classList.contains('is-alien-recognized')) return;
      if (feedback) feedback.hidden = true;
      portal.classList.add('is-alien-recognized');
      const submitButton = loginForm.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        const label = submitButton.querySelector('span');
        if (label) label.textContent = 'Acesso reconhecido';
      }
      const target = `/login?tema=hibrido&personagem=${encodeURIComponent(personagem.chave)}`;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.location.assign(target);
      } else {
        window.setTimeout(() => window.location.assign(target), 560);
      }
      return;
    }

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
