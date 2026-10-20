# FutureBeyond × H1 Produtora — decisões e ideias

> Documento vivo do projeto. Atualizado em 2026-10-19.
> **IMPORTANTE:** distinguir decisões do cliente (fonte: `PI2.pdf`), protótipos implementados e ideias de frontend sujeitas a aprovação.

## Conceito e relação entre as marcas

- **FutureBeyond:** universo digital e portal de exploração; mantém a estética Old Web / Y2K / Frutiger Aero, a entrada XP e a transmissão rachada.
- **H1 Produtora:** empresa fictícia encontrada dentro do FutureBeyond. A marca e os integrantes têm papéis narrativos.
- **Premissa do roteiro (PI2, p. 1):** o site é feito por extraterrestres tentando parecer humanos e interpretando mal a cultura. A origem extraterrestre é uma *revelação*; não deve aparecer explicitamente nas páginas públicas iniciais.
- **Tom:** sátira midiática e corporativa + mistério gradual. Evitar jumpscares e mensagens de terror excessivamente óbvias.
- **Princípio de escrita:** cada seção pode refletir a voz de quem supostamente a escreveu, sem revelar cedo demais o segredo.

## Personagens do roteiro (PI2, pp. 3–4)

| Integrante | Papel no site | Voz narrativa / oportunidades |
|---|---|---|
| Benedito Silva (Benê) | Técnico e programador da página | Comunicados secos; mensagens de manutenção; comentários internos e bugs *intencionais* claramente delimitados |
| Jeff Grease | Produção e negócios | Avisos exageradamente corporativos; loja e financiamento coletivo absurdos; obsessão com propriedade |
| Leonardo Fábio (Berinjela) | Desenvolvimento criativo | Descrições surpreendentemente longas, arte, conceitos estranhos e digressões |
| Zezinho | Criador de vídeos externo à produtora | Trama transmídia, vídeos, pistas e futura rota oculta; verificar o nome *Wolfheus* do fluxograma com a equipe |

## Implementado / entregue para integrar

- [x] Portal `/` com efeito de queda e acesso de convidado.
- [x] Transmissão danificada `/home/transmissao` como experiência intermediária.
- [x] Home `/home` com três colunas e visual Lavanda & Chrome.
- [x] Blog `/blog` com conteúdo de demonstração (páginas de post ainda pendentes).
- [x] Adaptação da Home para apresentar a H1, anúncios de produções em preparação e links institucionais.
- [x] Página `/sobre` com apresentações resumidas de Benê, Jeff e Berinjela.
- [x] Logotipos enviados pela equipe integrados ao protótipo (cópias apenas com margens transparentes aparadas).

## Organização técnica

- Astro + TypeScript, com React instalado para futuras ilhas realmente interativas.
- `srcDir: './start'` e `publicDir: './recursos/publico'`.
- Rotas: `start/pages/index.astro`, `start/pages/home/index.astro`, `start/pages/home/transmissao.astro`, `start/pages/sobre.astro`, `/blog`.
- CSS compartilhado/tokens no **único** `recursos/css/global.css`. CSS local por página em `recursos/css/paginas/`.
- Logos: `recursos/publico/imagens/h1/h1-horizontal.png` e `h1-vertical.png`, acessíveis por `/imagens/h1/...`.
- Sem banco de dados, CMS, autenticação real ou armazenamento de senhas.
- Hospedagem sugerida: Cloudflare Pages + GitHub, com preview de branch para cliente e branch principal para produção; conteúdo não publicado deve ser protegido se sigiloso.

## Próximas páginas, conforme PDF

1. **Produções:** catálogo; documentário com pôster, sinopse, créditos e extras; podcasts curtos. Não inventar títulos, elenco, duração final ou materiais não recebidos.
2. **Fórum fictício:** conversas previamente escritas pelos produtores, sem conta nem publicação real nesta fase. Não exibir posts supostamente reais de visitantes.
3. **Login narrativo:** página separada do portal inicial; tentativas comuns falham, algumas combinações de ARG desbloqueiam rotas ocultas. Se for exclusivamente frontend, todo o código do puzzle é inspecionável — não tratar como segurança.
4. **Sobre:** desenvolver posteriormente backstory falso e texto de propósito institucional **a partir de material aprovado**. A versão presente é protótipo demonstrativo.
5. **Merch + financiamento coletivo absurdo:** pendentes de conteúdo, viabilidade e alinhamento de escopo. Não ativar pagamentos de demonstração.
6. **Blog:** alinhar com a equipe se continuará como diário/arquivo narrativo complementar ou parte oficial das seções da produtora.

## Ideias opcionais para review

- Alterar discretamente os textos institucionais conforme o visitante percorre as páginas; evitar revelar demais no primeiro acesso.
- Mensagens de sistema atribuídas a Benê com gramática objetiva e pouquíssima paciência para layout.
- Promoções de Jeff com preços contraditórios e textos corporativos, sem simular cobranças reais.
- Postagens mais criativas de Berinjela, com uma estranheza visual sutil que não comprometa legibilidade.
- Referências aos vídeos de Zezinho em forma de recortes, links e notas de rodapé, quando conteúdos estiverem prontos.
- Animações e segredos com alternativas acessíveis para teclado e toque; respeitar `prefers-reduced-motion`.

## Pendências para confirmar com a equipe

- O fluxograma (p. 7) usa **Wolfheus**: é Zezinho, outro nome de personagem ou outra conta?
- Quais textos e ilustrações estão efetivamente aprovados e quais são placeholders?
- O documentário e o podcast são as primeiras páginas públicas planejadas?
- Qual papel oficial de `/blog` na navegação final?
- Quando liberar os elementos de ARG e em quais condições?
- Qual será o marco real de apresentação/lançamento? As datas do calendário do pitch ainda precisam ser alinhadas.

## Regra de escopo

Textos engraçados adicionados pelo desenvolvedor são **rascunhos**, não cânone. Diferenciar conteúdo aprovado, placeholder e sugestão, e manter links não desenvolvidos inativos até haver uma página funcional.
