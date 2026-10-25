let observer: IntersectionObserver | undefined;

function iniciarVisualizadores(): void {
  observer?.disconnect();
  observer = undefined;
  const elementos = document.querySelectorAll<HTMLElement>('[data-audio-visualizer]');
  if (!elementos.length) return;

  if (!('IntersectionObserver' in window)) {
    elementos.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      (entrada.target as HTMLElement).classList.toggle(
        'is-visible', entrada.isIntersecting && !document.hidden
      );
    });
  }, { threshold: 0.05 });
  elementos.forEach((item) => observer?.observe(item));
}

function atualizarVisibilidade(): void {
  if (document.hidden) {
    document.querySelectorAll<HTMLElement>('[data-audio-visualizer]')
      .forEach((item) => item.classList.remove('is-visible'));
  } else {
    // Recupera a interseção atual sem manter animações invisíveis rodando.
    iniciarVisualizadores();
  }
}

document.addEventListener('astro:page-load', iniciarVisualizadores);
document.addEventListener('visibilitychange', atualizarVisibilidade);
document.addEventListener('astro:before-swap', () => {
  observer?.disconnect(); observer = undefined;
});
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarVisualizadores, { once: true });
} else {
  iniciarVisualizadores();
}
