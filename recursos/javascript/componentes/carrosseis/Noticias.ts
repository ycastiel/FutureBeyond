const INTERVALO_NOTICIAS_MS = 7200;

function configurarNoticias(root: HTMLElement): void {
  if (root.dataset.newsReady === 'true') return;
  root.dataset.newsReady = 'true';

  const janelas = Array.from(root.querySelectorAll<HTMLElement>('[data-news-window]'));
  const contador = root.querySelector<HTMLElement>('[data-news-count]');
  const controles = root.querySelector<HTMLElement>('[data-news-controls]');
  const vazio = root.querySelector<HTMLElement>('[data-news-empty]');
  const restaurar = root.querySelector<HTMLButtonElement>('[data-news-restore]');
  const dialogo = root.querySelector<HTMLDialogElement>('[data-news-dialog]');
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!janelas.length) return;

  let indice = Math.floor(Math.random() * janelas.length);
  let timer: number | undefined;
  let mouseDentro = false;
  let focoDentro = false;
  let destruido = false;

  function disponiveis(): HTMLElement[] {
    return janelas.filter(janela => janela.dataset.newsDismissed !== 'true');
  }

  function renderizar(): void {
    const validas = disponiveis();
    if (validas.length && !validas.includes(janelas[indice])) indice = janelas.indexOf(validas[0]);
    janelas.forEach((janela, i) => {
      janela.hidden = i !== indice || janela.dataset.newsDismissed === 'true';
      janela.classList.toggle('is-current', !janela.hidden);
    });
    const atual = validas.indexOf(janelas[indice]);
    if (contador) contador.textContent = validas.length ? `${atual + 1} / ${validas.length}` : '0 / 0';
    if (controles) controles.hidden = validas.length <= 1;
    if (vazio) vazio.hidden = validas.length !== 0;
    if (restaurar) restaurar.hidden = validas.length === janelas.length;
  }

  function parar(): void {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  }

  function podeRodar(): boolean {
    return !destruido && !mouseDentro && !focoDentro && !document.hidden &&
      !reduzirMovimento.matches && !dialogo?.open && disponiveis().length > 1;
  }

  function reiniciar(): void {
    parar();
    if (!podeRodar()) return;
    timer = window.setInterval(() => avancar(1), INTERVALO_NOTICIAS_MS);
  }

  function avancar(direcao: number): void {
    const validas = disponiveis();
    if (!validas.length) return;
    const anterior = validas.indexOf(janelas[indice]);
    const proximaPosicao = ((anterior < 0 ? 0 : anterior) + direcao + validas.length) % validas.length;
    indice = janelas.indexOf(validas[proximaPosicao]);
    renderizar();
    reiniciar();
  }

  function clique(evento: MouseEvent): void {
    const alvo = evento.target;
    if (!(alvo instanceof Element)) return;

    if (alvo.closest<HTMLButtonElement>('[data-news-prev]')) {
      avancar(-1); return;
    }
    if (alvo.closest<HTMLButtonElement>('[data-news-next]')) {
      avancar(1); return;
    }

    if (alvo.closest<HTMLButtonElement>('[data-news-restore]')) {
      janelas.forEach(janela => delete janela.dataset.newsDismissed);
      indice = Math.floor(Math.random() * janelas.length);
      renderizar(); reiniciar(); return;
    }

    const fechar = alvo.closest<HTMLButtonElement>('[data-news-dismiss]');
    if (fechar) {
      const janela = fechar.closest<HTMLElement>('[data-news-window]');
      if (!janela || !root.contains(janela)) return;
      janela.dataset.newsDismissed = 'true';
      const seguintes = disponiveis();
      const proxima = seguintes.find(item => janelas.indexOf(item) > indice) ?? seguintes[0];
      if (proxima) indice = janelas.indexOf(proxima);
      renderizar(); reiniciar(); return;
    }

    const abrir = alvo.closest<HTMLButtonElement>('[data-news-open]');
    if (abrir && dialogo) {
      const janela = abrir.closest<HTMLElement>('[data-news-window]');
      if (!janela || !root.contains(janela)) return;
      const titulo = janela.querySelector<HTMLElement>('h3');
      const conteudo = janela.querySelector<HTMLElement>('.h1-news__copy');
      const tituloModal = dialogo.querySelector<HTMLElement>('[data-news-dialog-title]');
      const textoModal = dialogo.querySelector<HTMLElement>('[data-news-dialog-copy]');
      if (tituloModal) tituloModal.textContent = titulo?.textContent ?? 'Notícias Paralelas';
      if (textoModal) textoModal.textContent = conteudo?.textContent ?? '';
      parar();
      if (!dialogo.open) dialogo.showModal();
      return;
    }

    const fecharDialogo = alvo.closest<HTMLButtonElement>('[data-news-dialog-close]');
    if (fecharDialogo && dialogo?.open) dialogo.close();
  }

  function aoEntrar(): void { mouseDentro = true; parar(); }
  function aoSair(): void { mouseDentro = false; reiniciar(); }
  function aoFocar(): void { focoDentro = true; parar(); }
  function aoDesfocar(evento: FocusEvent): void {
    if (evento.relatedTarget instanceof Node && root.contains(evento.relatedTarget)) return;
    focoDentro = false; reiniciar();
  }
  function aoFecharDialogo(): void { reiniciar(); }
  function aoMudarVisibilidade(): void { reiniciar(); }
  function aoMudarMovimento(): void { reiniciar(); }
  function aoClicarBackdrop(evento: MouseEvent): void {
    if (evento.target === dialogo && dialogo?.open) dialogo.close();
  }

  function limpar(): void {
    destruido = true;
    parar();
    root.removeEventListener('click', clique);
    root.removeEventListener('mouseenter', aoEntrar);
    root.removeEventListener('mouseleave', aoSair);
    root.removeEventListener('focusin', aoFocar);
    root.removeEventListener('focusout', aoDesfocar);
    dialogo?.removeEventListener('close', aoFecharDialogo);
    dialogo?.removeEventListener('click', aoClicarBackdrop);
    document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    reduzirMovimento.removeEventListener('change', aoMudarMovimento);
    document.removeEventListener('astro:before-swap', limpar);
  }

  root.addEventListener('click', clique);
  root.addEventListener('mouseenter', aoEntrar);
  root.addEventListener('mouseleave', aoSair);
  root.addEventListener('focusin', aoFocar);
  root.addEventListener('focusout', aoDesfocar);
  dialogo?.addEventListener('close', aoFecharDialogo);
  dialogo?.addEventListener('click', aoClicarBackdrop);
  document.addEventListener('visibilitychange', aoMudarVisibilidade);
  reduzirMovimento.addEventListener('change', aoMudarMovimento);
  document.addEventListener('astro:before-swap', limpar, { once: true });
  renderizar();
  reiniciar();
}

function inicializarNoticias(): void {
  document.querySelectorAll<HTMLElement>('[data-news-root]').forEach(configurarNoticias);
}

document.addEventListener('astro:page-load', inicializarNoticias);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarNoticias, { once: true });
} else {
  inicializarNoticias();
}

export {};
