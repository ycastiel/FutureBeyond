# FutureBeyond × H1 Produtora — Caderno de ideias

> **Atualizado em 25/10/2026.** Documento vivo. Distinguir **pedido do cliente**, **implementado** e **ideia opcional**.
> Fonte principal de conteúdo: `PI2 - Transcrição Site(2).pdf`, fornecido pela equipe.

## 1. Identidade e narrativa

- **FutureBeyond** é o universo digital/portal; **H1 Produtora** é a produtora fictícia dentro dele.
- O site é produzido por alienígenas que procuram soar humanos. Humor corporativo, sátira e estranheza gradual, sem revelar a premissa cedo demais.
- Estilo visual: Old Web / Y2K / Frutiger Aero, painéis cromados, lilás claro + roxo noturno + detalhes ciano.
- Arte e textos oficiais prevalecem sobre placeholders e sugestões do desenvolvedor.

## 2. Estrutura atual real do repositório

- Astro + TypeScript + React instalado para eventuais ilhas; páginas atuais estáticas.
- `astro.config.mjs`: `srcDir: ./start` e `publicDir: ./recursos/publico`.
- Rotas principais: `start/pages/index.astro`, `home/index.astro`, `home/transmissao.astro`, `alienados/index.astro`, `forum/index.astro`, `blog/index.astro`, `blog/sobre.astro`.
- CSS por seção: `recursos/css/pages/{home,alienados,forum,blog}/...`, e entrada em `recursos/css/pages/entrance.css`.
- **Um único CSS global:** `recursos/css/global.css` (tokens, estilos-base, transições compartilhadas e rotação 3D da marca H1).
- Carrossel da Home: `recursos/javascript/componentes/carrosseis/Banners.ts`.
- Visualizer decorativo: `recursos/javascript/componentes/visualizadores/Alienados.ts`.
- Identidade H1: `recursos/publico/imagens/h1/`. Fundo oficial usado no visualizer: `recursos/publico/imagens/h1/h1-visualizer-fundo.webp`.
- Deploy de produção/prévia: Cloudflare **Workers** com integração GitHub; `main` é produção, `desenvolvimento` é a prévia para o cliente.

## 3. Implementado e atualizado neste pacote

- [x] Home institucional com Quem Somos, Nossas Produções e Comunidade.
- [x] Logo H1 rotacionando lentamente **em 3D** em pontos selecionados (Home e Alienados), com `prefers-reduced-motion`.
- [x] Carrossel de anúncios: primeiro item **aleatório**, depois avança sequencialmente a cada **5,2 s**, com pausa no hover/foco, controle manual e pausa quando a aba está oculta.
- [x] Tipografia e espaçamentos do anúncio ajustados para a largura da sidebar.
- [x] Página Alienados passa a usar a primeira arte oficial fornecida como base, com ondas radiais **decorativas** por cima, animadas só enquanto visíveis. **Ainda não há áudio sincronizado.**
- [x] Link `Sobre` de Alienados atualizado para a rota existente `/blog/sobre`.
- [x] Scripts considerados para `ClientRouter` / `astro:page-load`.
- [x] Portal, queda, transmissão/CMD e transferência de janelas preservados.

## 4. Pedidos específicos do roteiro e da reunião

- [x] Nome do campo de login: **Usuário**.
- [x] Erro de login fictício: **"Usuário ou Senha incorretos, essa conta não existe"**.
- [x] A entrada oferece opção de convidado; terminal/intermediário de código mais compacto.
- [x] No Sobre, apelidos fixos removidos; hover/foco do **Leonardo** revela **Berinjela**.
- [x] Fórum com estética de internet dos anos 2010 e conversas roteirizadas.
- [x] Alienados tem estrutura de episódios, ainda aguardando mídias finais.
- [ ] Remover datas remanescentes de páginas demonstrativas, caso ainda existam (especialmente blog).
- [ ] Revisar todos os textos substitutos com a equipe antes da versão pública final.
- [ ] Substituir os cartões de anúncio por GIFs/imagens oficiais quando forem entregues.

## 5. Próximos trabalhos — prioridade

1. **Revisão visual do novo visualizer** com a H1: decidir se ondas devem ocupar o círculo todo e se a animação deve variar por episódio.
2. **Banners oficiais**: incluir mídias e links aprovados sem alterar o comportamento do carrossel.
3. **Responsividade** da Home e das páginas de conteúdo: validar telas de 360–768 px, tablet e desktop.
4. **Performance / acessibilidade**: Lighthouse, testes com CPU limitada, navegação por teclado, preferências de movimento reduzido, lazy loading e tamanhos de imagem.
5. **Terminar o conteúdo do podcast** conforme cheguem áudio, visualizers definitivos e descrições.
6. **Polimento do CMD e das transições** (sem sacrificar a fluidez da navegação).

## 6. Ideias opcionais para discussão

- Rotação do selo H1: versão 3D (`rotateY`) atual ou rotação plana (`rotateZ`) mais arcade, por contexto.
- Visualizer real sincronizado a áudio quando houver arquivos e player: usar `Web Audio API` e `AnalyserNode` **somente após autorização de reprodução**. Não afirmar sincronização antes disso.
- Mensagens sutis do Benê e alterações narrativas de interface em áreas específicas.
- Evoluir o fórum roteirizado para conversas adicionais fornecidas pelos produtores, antes de considerar comentários reais.
- Login do ARG com senhas ficcionais (sem confundir com autenticação segura); páginas escondidas só quando houver conteúdo aprovado.
- Página específica do documentário (pôster, créditos, materiais extras) quando a equipe fornecer assets.
- Mensagens secretas e transições diferenciadas apenas em momentos importantes, sem repetir glitches em toda página.

## 7. Padrões para manter

- Não alterar arquivos antigos do projeto apenas para renomear pastas.
- Não criar outro global além de `recursos/css/global.css`.
- Scripts `.ts` fornecidos separadamente também em `.txt` para compatibilidade com proxy.
- Não inventar datas, mídias, títulos definitivos ou falas canônicas.
- Fazer commits incrementais e validar `npm run build` antes do push para `desenvolvimento`.
