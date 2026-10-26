let controlador: AbortController | undefined;

function formatarTempo(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos < 0) return '--:--';
  const total = Math.floor(segundos);
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const resto = total % 60;
  const dois = (numero: number) => String(numero).padStart(2, '0');
  return horas > 0
    ? `${dois(horas)}:${dois(minutos)}:${dois(resto)}`
    : `${dois(minutos)}:${dois(resto)}`;
}

function textoDasLegendas(faixa: TextTrack): string {
  const ativas = faixa.activeCues;
  if (!ativas || !ativas.length) return '';
  return Array.from(ativas)
    .map((cue) => {
      // WebVTT pode ter ênfase/etiquetas. Extraímos só o texto, sem usar innerHTML.
      const legenda = cue as VTTCue;
      return typeof legenda.getCueAsHTML === 'function'
        ? (legenda.getCueAsHTML().textContent ?? '').trim()
        : (legenda.text ?? '').trim();
    })
    .filter(Boolean)
    .join('\n');
}

function configurarTerminal(terminal: HTMLElement, sinal: AbortSignal): void {
  const midia = terminal.closest<HTMLElement>('[data-transcricao-midia]');
  const audio = midia?.querySelector<HTMLAudioElement>('[data-transcricao-audio]');
  const track = midia?.querySelector<HTMLTrackElement>('[data-transcricao-track]');
  const texto = terminal.querySelector<HTMLElement>('[data-transcricao-texto]');
  const status = terminal.querySelector<HTMLElement>('[data-transcricao-status]');
  const tempo = terminal.querySelector<HTMLElement>('[data-transcricao-tempo]');

  if (!texto || !status || !tempo) return;

  // Evita reescrever a mesma legenda várias vezes por segundo e disparar
  // anúncios repetidos para leitores de tela (aria-live).
  const apresentar = (mensagem: string): void => {
    if (texto.textContent !== mensagem) texto.textContent = mensagem;
  };

  // Enquanto a equipe não fornece o áudio e o .vtt, não simulamos reprodução.
  if (!audio) {
    apresentar('Transcrição indisponível');
    status.textContent = 'SEM ÁUDIO';
    tempo.textContent = '--:-- / --:--';
    return;
  }

  const temLegenda = Boolean(track?.getAttribute('src'));
  let legendaFalhou = false;
  let audioFalhou = false;
  let legendaCarregada = !temLegenda;

  const atualizar = (): void => {
    tempo.textContent = `${formatarTempo(audio.currentTime)} / ${formatarTempo(audio.duration)}`;

    if (audioFalhou) {
      status.textContent = 'ERRO DE ÁUDIO';
      apresentar('Não foi possível reproduzir este episódio.');
      return;
    }

    if (!temLegenda || !track) {
      status.textContent = 'SEM ARQUIVO .VTT';
      apresentar('Transcrição indisponível');
      return;
    }

    if (legendaFalhou) {
      status.textContent = 'ERRO DE LEGENDA';
      apresentar('Não foi possível carregar a transcrição.');
      return;
    }

    if (!legendaCarregada) {
      status.textContent = 'CARREGANDO .VTT';
      apresentar('Preparando transcrição...');
      return;
    }

    const fala = textoDasLegendas(track.track);
    if (fala) {
      apresentar(fala);
    } else if (audio.ended) {
      apresentar('Transcrição concluída.');
    } else if (audio.currentTime === 0 && audio.paused) {
      apresentar('Pressione reproduzir para acompanhar a transcrição.');
    } else {
      apresentar('Aguardando próxima fala...');
    }

    status.textContent = audio.ended ? 'FINALIZADO' : audio.paused ? 'PAUSADO' : 'EM REPRODUÇÃO';
  };

  if (track) {
    // O modo hidden manda o navegador carregar o WebVTT sem duplicar a legenda
    // nativa sobre o vídeo/áudio. O texto visível é renderizado no terminal.
    track.track.mode = 'hidden';
    legendaCarregada = track.readyState === HTMLTrackElement.LOADED;
    track.addEventListener('load', () => {
      legendaCarregada = true;
      legendaFalhou = false;
      atualizar();
    }, { signal: sinal });
    track.addEventListener('error', () => {
      legendaFalhou = true;
      atualizar();
    }, { signal: sinal });
    track.track.addEventListener('cuechange', atualizar, { signal: sinal });
  }

  for (const evento of ['play', 'playing', 'pause', 'seeked', 'timeupdate', 'loadedmetadata', 'durationchange', 'ended', 'emptied']) {
    audio.addEventListener(evento, atualizar, { signal: sinal });
  }
  audio.addEventListener('error', () => {
    audioFalhou = true;
    atualizar();
  }, { signal: sinal });
  atualizar();
}

function iniciarTranscricoes(): void {
  controlador?.abort();
  controlador = new AbortController();
  document.querySelectorAll<HTMLElement>('[data-transcricao-terminal]')
    .forEach((terminal) => configurarTerminal(terminal, controlador!.signal));
}

// Astro ClientRouter mantém o documento entre páginas; reinicializamos ao navegar.
document.addEventListener('astro:page-load', iniciarTranscricoes);
document.addEventListener('astro:before-swap', () => {
  controlador?.abort();
  controlador = undefined;
});
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarTranscricoes, { once: true });
} else {
  iniciarTranscricoes();
}
