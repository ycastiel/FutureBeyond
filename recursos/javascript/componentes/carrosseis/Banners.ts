function atualizarBanner(): void {
  const slot = document.querySelector<HTMLElement>('[data-random-ad]');
  if (!slot) return;

  const banners = Array.from(slot.querySelectorAll<HTMLElement>('[data-ad]'));
  if (banners.length === 0) return;

  const escolhido = Math.floor(Math.random() * banners.length);
  banners.forEach((banner, indice) => { banner.hidden = indice !== escolhido; });
}

document.addEventListener('astro:page-load', atualizarBanner);
if (document.readyState !== 'loading') atualizarBanner();
else document.addEventListener('DOMContentLoaded', atualizarBanner, { once: true });