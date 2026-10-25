/** H1Produtora · Carrossel de anúncios da Home.
 * Inicia num slide aleatório e depois avança em sequência.
 */
const INTERVALO_BANNERS = 5200;

function inicializarCarrossel(): void {
  const slot = document.querySelector<HTMLElement>('[data-random-ad]');
  if (!slot || slot.dataset.carouselReady === 'true') return;
  slot.dataset.carouselReady = 'true';

  const slides = Array.from(slot.querySelectorAll<HTMLElement>('[data-ad]'));
  const controles = slot.querySelector<HTMLElement>('[data-ad-controls]');
  const contador = slot.querySelector<HTMLElement>('[data-ad-count]');
  const anterior = slot.querySelector<HTMLButtonElement>('[data-ad-prev]');
  const proximo = slot.querySelector<HTMLButtonElement>('[data-ad-next]');
  if (slides.length === 0) return;

  let indice = Math.floor(Math.random() * slides.length);
  let timer: number | undefined;
  let cursorSobre = false;
  let focoDentro = false;
  let foiDestruido = false;
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function renderizar(): void {
    slides.forEach((slide, i) => {
      slide.hidden = i !== indice;
      slide.classList.toggle('is-current', i === indice);
      if (i !== indice) slide.setAttribute('aria-hidden', 'true');
      else slide.removeAttribute('aria-hidden');
    });
    if (contador) contador.textContent = `${indice + 1} / ${slides.length}`;
  }

  function parar(): void {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  }
  function podeRodar(): boolean {
    return !cursorSobre && !focoDentro && !document.hidden && !reduzirMovimento.matches && slides.length > 1;
  }
  function iniciar(): void {
    parar();
    if (!podeRodar() || foiDestruido) return;
    timer = window.setInterval(() => avancar(1, false), INTERVALO_BANNERS);
  }
  function avancar(direcao: number, manual: boolean): void {
    indice = (indice + direcao + slides.length) % slides.length;
    renderizar();
    if (manual) iniciar();
  }
  function entrarHover(): void { cursorSobre = true; parar(); }
  function sairHover(): void { cursorSobre = false; iniciar(); }
  function entrarFoco(): void { focoDentro = true; parar(); }
  function sairFoco(event: FocusEvent): void {
    if (event.relatedTarget instanceof Node && slot!.contains(event.relatedTarget)) return;
    focoDentro = false; iniciar();
  }
  function mudouVisibilidade(): void { iniciar(); }
  function mudouMovimento(): void { iniciar(); }
  function anteriorClick(): void { avancar(-1, true); }
  function proximoClick(): void { avancar(1, true); }

  slot.addEventListener('mouseenter', entrarHover);
  slot.addEventListener('mouseleave', sairHover);
  slot.addEventListener('focusin', entrarFoco);
  slot.addEventListener('focusout', sairFoco);
  anterior?.addEventListener('click', anteriorClick);
  proximo?.addEventListener('click', proximoClick);
  document.addEventListener('visibilitychange', mudouVisibilidade);
  reduzirMovimento.addEventListener('change', mudouMovimento);
  if (controles && slides.length > 1) controles.hidden = false;

  renderizar();
  iniciar();

  // Antes de trocar a Home, libera timer e listeners vinculados ao DOM antigo.
  document.addEventListener('astro:before-swap', function limpar() {
    foiDestruido = true;
    parar();
    slot.removeEventListener('mouseenter', entrarHover);
    slot.removeEventListener('mouseleave', sairHover);
    slot.removeEventListener('focusin', entrarFoco);
    slot.removeEventListener('focusout', sairFoco);
    anterior?.removeEventListener('click', anteriorClick);
    proximo?.removeEventListener('click', proximoClick);
    document.removeEventListener('visibilitychange', mudouVisibilidade);
    reduzirMovimento.removeEventListener('change', mudouMovimento);
    document.removeEventListener('astro:before-swap', limpar);
  }, { once: true });
}

document.addEventListener('astro:page-load', inicializarCarrossel);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarCarrossel, { once: true });
} else {
  inicializarCarrossel();
}
