import { buscarPersonagem } from './Personagens';

const stage = document.querySelector<HTMLElement>('[data-alien-stage]');

if (stage) {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get('preview') === '1';
  const retro = params.get('tema') === 'retro';

  if (stage.dataset.mode === 'revelacao') {
    const personagem = buscarPersonagem(params.get('personagem'));
    stage.dataset.character = personagem.nome;
    const nome = stage.querySelector<HTMLElement>('[data-alien-character-name]');
    if (nome) nome.textContent = personagem.nome;
    const destino = stage.querySelector<HTMLAnchorElement>('[data-alien-zoom]');
    if (destino) destino.href = personagem.rota;
  }
  const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-alien-theme]'));
  const phase = stage.querySelector<HTMLElement>('[data-alien-phase]');
  let navigating = false;
  let autoTimer: number | undefined;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function syncTheme(theme: 'retro' | 'hibrido') {
    if (!stage) return;
    stage.dataset.theme = theme;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.alienTheme === theme)));
    const current = new URL(window.location.href);
    current.searchParams.set('tema', theme);
    window.history.replaceState(null, '', current.pathname + current.search + current.hash);
    stage.querySelectorAll<HTMLAnchorElement>('[data-alien-zoom], [data-alien-fly]')
      .forEach((link) => {
        const url = new URL(link.href);
        if (!url.pathname.startsWith('/login')) return;
        url.searchParams.set('tema', theme);
        if (preview) url.searchParams.set('preview', '1');
        link.href = url.pathname + url.search;
      });
  }
  syncTheme(retro ? 'retro' : 'hibrido');

  function go(href: string, style: 'zoom' | 'fly') {
    if (navigating) return;
    navigating = true;
    if (autoTimer !== undefined) window.clearTimeout(autoTimer);
    if (phase) phase.textContent = style === 'zoom' ? 'ABRINDO ÁREA INTERNA...' : 'TRANSFERÊNCIA EXTRATERRESTRE...';
    if (reduced) {
      window.location.assign(href);
      return;
    }
    stage?.classList.add(style === 'zoom' ? 'is-zooming' : 'is-flying');
    // Navegação única com fallback, evitando depender de animationend do elemento correto.
    window.setTimeout(() => window.location.assign(href), style === 'zoom' ? 1000 : 1170);
  }

  function scheduleAuto() {
    if (autoTimer !== undefined) window.clearTimeout(autoTimer);
    if (preview || stage?.dataset.mode !== 'revelacao') return;
    const link = stage.querySelector<HTMLAnchorElement>('[data-alien-zoom]');
    if (link) autoTimer = window.setTimeout(() => go(link.href, 'zoom'), reduced ? 6500 : 7200);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.dataset.alienTheme === 'retro' ? 'retro' : 'hibrido';
      syncTheme(theme);
      scheduleAuto();
    });
  });

  stage.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[data-alien-zoom], a[data-alien-fly]');
    if (!link) return;
    if (!(event instanceof MouseEvent)) return;
    if (event.button !== 0 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    go(link.href, link.hasAttribute('data-alien-zoom') ? 'zoom' : 'fly');
  });

  if (stage.dataset.mode === 'revelacao') {
    // Primeiro renderiza a fachada; depois abre as portas no próximo instante.
    window.setTimeout(() => { stage.dataset.open = 'true'; }, 180);
    scheduleAuto();
  }
}
