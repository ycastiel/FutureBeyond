const adSlot = document.querySelector<HTMLElement>('[data-random-ad]');
if (adSlot) {
  const cards = Array.from(adSlot.querySelectorAll<HTMLElement>('[data-ad]'));
  if (cards.length > 0) {
    const selected = Math.floor(Math.random() * cards.length);
    cards.forEach((card, i) => { card.hidden = i !== selected; });
  }
}
