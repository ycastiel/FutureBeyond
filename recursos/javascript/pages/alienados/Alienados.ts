type EpisodioVisual = {
  audio: HTMLAudioElement;
  elemento: HTMLElement;
  barras: HTMLElement[];
  legenda: HTMLElement | null;
  niveis: Float32Array;
  visivel: boolean;
  fonte?: MediaElementAudioSourceNode;
  analisador?: AnalyserNode;
  frequencias?: Uint8Array<ArrayBuffer>;
  onda?: Uint8Array<ArrayBuffer>;
};

const NIVEL_REPOUSO = 0.12;
const INTERVALO_QUADRO_MS = 24; // até ~40 FPS; JS suaviza a movimentação

// Ajustes de sensibilidade: altere somente estes números para calibrar.
const LIMIAR_RUIDO = 0.0025;     // evita tremulação em quase-silêncio
const GANHO_VOZ = 21;           // maior = mais reação a vozes baixas
const CURVA_VOZ = 0.72;         // menor que 1 realça sons mais suaves
const ATAQUE = 0.74;            // resposta rápida a novas falas
const DECAIMENTO = 0.31;        // volta suave quando a voz termina
const ALTURA_MAXIMA = 2.0;     // impede picos exagerados nas barras

let paginaAtual: HTMLElement | null = null;
let controlador: AbortController | null = null;
let observador: IntersectionObserver | null = null;
let contexto: AudioContext | null = null;
let episodios: EpisodioVisual[] = [];
let ativo: EpisodioVisual | null = null;
let quadro: number | null = null;
let ultimoQuadro = 0;
let reduzirMovimento: MediaQueryList | null = null;

function tituloVisual(episodio: EpisodioVisual, texto: string): void {
  if (episodio.legenda && episodio.legenda.textContent !== texto) {
    episodio.legenda.textContent = texto;
  }
}

function pararQuadros(): void {
  if (quadro !== null) window.cancelAnimationFrame(quadro);
  quadro = null;
  ultimoQuadro = 0;
}

function repousar(episodio: EpisodioVisual): void {
  episodio.elemento.classList.remove('is-audio-playing');
  episodio.niveis.fill(NIVEL_REPOUSO);
  for (const barra of episodio.barras) {
    barra.style.setProperty('--audio-level', String(NIVEL_REPOUSO));
  }
}

function habilitarAnalise(episodio: EpisodioVisual): boolean {
  if (episodio.analisador) return true;
  if (typeof window.AudioContext !== 'function') return false;

  // Inicializa somente após a interação de reprodução do usuário.
  // Um único contexto serve os quatro episódios e evita contextos simultâneos.
  contexto ??= new AudioContext();

  // A mesma tag <audio> só pode virar MediaElementAudioSource uma vez.
  // Guardamos os nós em cada episódio para reutilização nas pausas e seeks.
  const fonte = contexto.createMediaElementSource(episodio.audio);
  const analisador = contexto.createAnalyser();
  analisador.fftSize = 1024;
  analisador.smoothingTimeConstant = 0.72;
  analisador.minDecibels = -95;
  analisador.maxDecibels = -20;

  fonte.connect(analisador);
  // ESSENCIAL: áudio continua audível com os controles HTML originais.
  analisador.connect(contexto.destination);

  episodio.fonte = fonte;
  episodio.analisador = analisador;
  episodio.frequencias = new Uint8Array(new ArrayBuffer(analisador.frequencyBinCount));
  episodio.onda = new Uint8Array(new ArrayBuffer(analisador.fftSize));
  return true;
}

function desenhar(episodio: EpisodioVisual): void {
  const analisador = episodio.analisador;
  const frequencias = episodio.frequencias;
  const onda = episodio.onda;
  if (!analisador || !frequencias || !onda || !contexto) return;

  analisador.getByteFrequencyData(frequencias);
  analisador.getByteTimeDomainData(onda);

  // RMS da onda: faz o conjunto respirar com a intensidade real das vozes.
  let somaQuadrados = 0;
  for (let i = 0; i < onda.length; i++) {
    const amostra = (onda[i] - 128) / 128;
    somaQuadrados += amostra * amostra;
  }
  const rms = Math.sqrt(somaQuadrados / onda.length);
  const energiaUtil = Math.max(0, rms - LIMIAR_RUIDO);
  const intensidade = Math.min(1, Math.pow(energiaUtil * GANHO_VOZ, CURVA_VOZ));

  // Distribuição logarítmica espelhada: a forma radial fica equilibrada e
  // ainda diferencia graves, médios e agudos de cada trecho do podcast.
  const qtd = episodio.barras.length;
  const larguraBin = contexto.sampleRate / analisador.fftSize;
  for (let i = 0; i < qtd; i++) {
    const posicao = Math.min(i, qtd - 1 - i) / Math.max(1, (qtd - 1) / 2);
    const frequencia = 100 * Math.pow(55, posicao); // 100 Hz ... 5,5 kHz
    const inicio = Math.max(1, Math.floor(frequencia * 0.82 / larguraBin));
    const fim = Math.min(frequencias.length, Math.max(inicio + 1, Math.ceil(frequencia * 1.18 / larguraBin)));

    let soma = 0;
    for (let k = inicio; k < fim; k++) soma += frequencias[k];
    const banda = soma / Math.max(1, fim - inicio) / 255;

    // Pequenas vozes continuam visíveis, mas cada frequência conserva variação.
    // Evita o aspecto de anel rígido quando a banda está abaixo do pico da fala.
    const faixaRealcada = Math.pow(Math.min(1, banda * 1.8), 0.68);
    const alvo = Math.min(
      ALTURA_MAXIMA,
      NIVEL_REPOUSO + intensidade * (0.55 + 1.45 * faixaRealcada)
    );
    const anterior = episodio.niveis[i];
    const suavizacao = alvo > anterior ? ATAQUE : DECAIMENTO;
    const valor = anterior + (alvo - anterior) * suavizacao;
    episodio.niveis[i] = valor;
    episodio.barras[i].style.setProperty('--audio-level', valor.toFixed(3));
  }
}

function podeAnimar(episodio: EpisodioVisual): boolean {
  return ativo === episodio
    && !episodio.audio.paused
    && !episodio.audio.ended
    && episodio.visivel
    && !document.hidden
    && !reduzirMovimento?.matches
    && contexto?.state === 'running';
}

function agendarQuadro(episodio: EpisodioVisual): void {
  if (quadro !== null || !podeAnimar(episodio)) return;
  quadro = window.requestAnimationFrame((agora) => {
    quadro = null;
    if (!podeAnimar(episodio)) return;
    if (agora - ultimoQuadro >= INTERVALO_QUADRO_MS) {
      ultimoQuadro = agora;
      desenhar(episodio);
    }
    agendarQuadro(episodio);
  });
}

async function aoReproduzir(episodio: EpisodioVisual, sinal: AbortSignal): Promise<void> {
  if (ativo !== episodio) {
    pararQuadros();
    if (ativo) repousar(ativo);
    ativo = episodio;
  }

  // O script da transcrição também garante um episódio por vez;
  // repetimos a segurança aqui para o visualizer ser independente.
  for (const outro of episodios) {
    if (outro !== episodio && !outro.audio.paused) outro.audio.pause();
  }

  if (reduzirMovimento?.matches) {
    tituloVisual(episodio, 'Áudio em reprodução · Movimento reduzido conforme sua preferência');
    return;
  }

  try {
    if (!habilitarAnalise(episodio) || !contexto) {
      tituloVisual(episodio, 'Áudio disponível · Visualização reativa não suportada neste navegador');
      return;
    }
    // Tenta retomar o AudioContext (pode começar suspenso por política do navegador).
    if (contexto.state === 'suspended') await contexto.resume();
    if (sinal.aborted || ativo !== episodio || episodio.audio.paused) return;

    episodio.elemento.classList.add('is-audio-playing');
    tituloVisual(episodio, 'Ondas sincronizadas com a voz e os sons do episódio');
    agendarQuadro(episodio);
  } catch (erro) {
    console.warn('[H1 Alienados] Não foi possível iniciar o analisador de áudio:', erro);
    tituloVisual(episodio, 'Áudio disponível · Animação reativa indisponível neste navegador');
  }
}

function aoPausar(episodio: EpisodioVisual): void {
  repousar(episodio);
  if (ativo === episodio) {
    pararQuadros();
    ativo = null;
  }
  tituloVisual(episodio, episodio.audio.ended
    ? 'Episódio finalizado · Visualizador em repouso'
    : 'Visualizer reativo · Pressione reproduzir para acompanhar o som');
}

function encerrarPagina(): void {
  pararQuadros();
  observador?.disconnect();
  observador = null;
  controlador?.abort();
  controlador = null;
  for (const episodio of episodios) {
    // Evita deixar o áudio de uma rota anterior tocando durante o ClientRouter.
    if (!episodio.audio.paused) episodio.audio.pause();
    repousar(episodio);
    episodio.fonte?.disconnect();
    episodio.analisador?.disconnect();
  }
  episodios = [];
  ativo = null;
  paginaAtual = null;
  reduzirMovimento = null;
  const antigo = contexto;
  contexto = null;
  if (antigo && antigo.state !== 'closed') {
    void antigo.close().catch(() => undefined);
  }
}

function iniciarVisualizadores(): void {
  const pagina = document.querySelector<HTMLElement>('.h1-alienados');
  if (pagina === paginaAtual) return; // evita duas inicializações no primeiro carregamento
  encerrarPagina();
  if (!pagina) return;

  paginaAtual = pagina;
  controlador = new AbortController();
  const sinal = controlador.signal;
  reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  episodios = Array.from(pagina.querySelectorAll<HTMLElement>('.h1-alienados__episode'))
    .flatMap((secao): EpisodioVisual[] => {
      const elemento = secao.querySelector<HTMLElement>('[data-audio-visualizer]');
      const audio = secao.querySelector<HTMLAudioElement>('[data-transcricao-audio]');
      if (!elemento || !audio) return [];
      const barras = Array.from(elemento.querySelectorAll<HTMLElement>('.h1-alienados__ray i'));
      if (!barras.length) return [];
      const legenda = secao.querySelector<HTMLElement>('.h1-alienados__visualizer-caption');
      const ep: EpisodioVisual = {
        audio, elemento, barras, legenda,
        niveis: new Float32Array(barras.length).fill(NIVEL_REPOUSO),
        visivel: true,
      };
      elemento.setAttribute('aria-label', 'Visualização radial que reage às frequências e à intensidade do áudio do episódio');
      tituloVisual(ep, 'Visualizer reativo · Pressione reproduzir para acompanhar o som');
      // Pré-ativa o AudioContext no gesto do usuário. Isso ajuda em navegadores
      // que bloqueiam resume() disparado somente pelo evento assíncrono 'play'.
      const ativarNoGesto = (): void => {
        if (reduzirMovimento?.matches) return;
        try {
          if (habilitarAnalise(ep) && contexto?.state === 'suspended') {
            void contexto.resume().catch(() => undefined);
          }
        } catch (erro) {
          console.warn('[H1 Alienados] Análise de áudio não disponível:', erro);
        }
      };
      audio.addEventListener('pointerdown', ativarNoGesto, { signal: sinal });
      audio.addEventListener('keydown', ativarNoGesto, { signal: sinal });
      audio.addEventListener('play', () => { void aoReproduzir(ep, sinal); }, { signal: sinal });
      for (const evento of ['pause', 'ended', 'emptied', 'error']) {
        audio.addEventListener(evento, () => aoPausar(ep), { signal: sinal });
      }
      return [ep];
    });

  // Visualização offscreen não consome ciclos de pintura/análise.
  if ('IntersectionObserver' in window) {
    observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        const ep = episodios.find((item) => item.elemento === entrada.target);
        if (!ep) continue;
        ep.visivel = entrada.isIntersecting;
        if (ep === ativo && ep.visivel) agendarQuadro(ep);
        else if (ep === ativo) pararQuadros();
      }
    }, { threshold: 0.01 });
    for (const ep of episodios) observador.observe(ep.elemento);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pararQuadros();
    else if (ativo) agendarQuadro(ativo);
  }, { signal: sinal });

  reduzirMovimento.addEventListener('change', () => {
    if (reduzirMovimento?.matches) {
      pararQuadros();
      for (const ep of episodios) repousar(ep);
    } else if (ativo) {
      void aoReproduzir(ativo, sinal);
    }
  }, { signal: sinal });
}

// O ClientRouter do Astro reaproveita o documento ao mudar de rota.
document.addEventListener('astro:page-load', iniciarVisualizadores);
document.addEventListener('astro:before-swap', encerrarPagina);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarVisualizadores, { once: true });
} else {
  iniciarVisualizadores();
}

// Mantém as declarações deste script isoladas das dos demais componentes.
export {};
