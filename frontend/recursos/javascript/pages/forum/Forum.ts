function iniciarForum(): void {
  const forum = document.querySelector<HTMLElement>('.h1-forum');
  if (!forum) return;

  const busca = forum.querySelector<HTMLInputElement>('[data-forum-search]');
  const vazio = forum.querySelector<HTMLElement>('[data-forum-empty]');
  const topicos = Array.from(forum.querySelectorAll<HTMLDetailsElement>('[data-forum-topic]'));

  if (busca) {
    busca.addEventListener('input', () => {
      const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
      let visiveis = 0;
      topicos.forEach(topico => {
        const titulo = topico.dataset.title ?? '';
        const encontrado = titulo.includes(termo);
        topico.hidden = !encontrado;
        if (encontrado) visiveis++;
      });
      if (vazio) vazio.hidden = visiveis !== 0;
    });
  }

  const abrirHash = (): void => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const destino = topicos.find(topico => topico.id === id);
    if (!destino) return;
    if (busca?.value) {
      busca.value = '';
      topicos.forEach(topico => { topico.hidden = false; });
      if (vazio) vazio.hidden = true;
    }
    destino.open = true;
  };

  forum.querySelectorAll<HTMLAnchorElement>('[data-forum-topic-link]').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.hash.slice(1);
      const destino = topicos.find(topico => topico.id === id);
      if (destino) destino.open = true;
      if (busca?.value) {
        busca.value = '';
        topicos.forEach(topico => { topico.hidden = false; });
        if (vazio) vazio.hidden = true;
      }
    });
  });
  abrirHash();
}

document.addEventListener('astro:page-load', iniciarForum);