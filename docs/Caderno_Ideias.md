# FutureBeyond — Caderno de ideias e decisões

> Documento vivo de direção criativa e técnica. Atualizar a cada etapa do desenvolvimento.
> **Estado:** protótipo frontend · **Atualizado:** 2026-10-13

## Conceito

Um blog/arquivo pessoal que imagina o futuro usando a linguagem visual da internet dos anos 2000. A interface mistura *Old Web*, MSN, Orkut, Y2K, gradientes cromados, roxo/lilás e elementos de Frutiger Aero. Quanto mais o visitante explora, mais sinais de uma transmissão desconhecida aparecem.

**Regra narrativa:** o site não deve revelar imediatamente que é estranho; ele começa acolhedor, e a anomalia surge em detalhes.

## Decisões técnicas atuais

- **Astro + TypeScript** para rotas, conteúdo e componentes estáticos.
- **React** instalado, mas reservado para ilhas realmente interativas no futuro.
- **CSS personalizado** e tokens unificados em `recursos/css/global.css`.
- Código-fonte do Astro em `start/` (`srcDir`); arquivos públicos em `recursos/publico/` (`publicDir`).
- Arquivos de rota em `start/pages/`, com nomes minúsculos: `index.astro`, `home.astro` etc.
- **Sem backend/CMS por enquanto**: o desenvolvedor publica as alterações a partir dos arquivos recebidos do cliente.
- Sem envio ou armazenamento das credenciais fictícias do portal.

## Implementado / pronto para integração

- [x] Entrada como janela retrofuturista com perspectiva 3D e interação ao focar/passar o mouse.
- [x] Login cosmético: qualquer tentativa retorna “Você não pertence a essa era”.
- [x] Acesso como convidado direcionado a `/home`.
- [ ] **Implementar agora:** substituir a animação de queda por aproximação/mergulho no portal.
- [ ] **Implementar agora:** transformar a Home temporária num cartão de transmissão danificado.

## Ideias de curto prazo

- [ ] Refinar efeitos cromados dos botões (hover, pressionado, foco pelo teclado).
- [ ] Testar transição entre portal e Home em desktop, celular e modo de movimento reduzido.
- [ ] Construir a Home definitiva com header, sidebars, widgets e navegação Old Web.
- [ ] Projetar a área `/blog` em Y2K lilás, com posts e galerias.
- [ ] Criar componentes reutilizáveis: `RetroWindow`, `GlossyButton`, `BlogCard`.
- [ ] Testar legibilidade e contraste dos textos pequenos em telas móveis.

## Ideias de médio prazo — imersão narrativa

- [ ] Relógio que parece contar normalmente e ocasionalmente muda de direção.
- [ ] Mensagem estilo MSN que aparece após o visitante encontrar uma pista.
- [ ] Frases com lacunas, arquivos incompletos e símbolos recorrentes entre páginas.
- [ ] Pistas escondidas em ilustrações e painéis, sem depender exclusivamente de hover.
- [ ] Sistema de descobertas com `localStorage` (sem coleta de informações pessoais).
- [ ] Registro de transmissão com diferentes estágios de integridade visual.
- [ ] Sons leves e opcionais de interface antiga, com controle para silenciar.
- [ ] Uma porta que parece erro 404, mas é uma peça narrativa intencional (nunca usada no lugar dos erros reais).
- [ ] Login fictício reagindo a uma palavra-chave apenas como easter egg — sem contas reais.

## Futuro, apenas se o cliente solicitar

- [ ] CMS para publicação de posts pelo cliente.
- [ ] Contas reais e persistência de progresso; exigiria backend e discussão de privacidade.
- [ ] Galeria com filtros, personagens, timelines e sistema de arquivos narrativos.

## Cuidados de UX e escopo

- Manter caminho claro de convidado: o mistério não pode parecer site quebrado.
- Animações devem respeitar `prefers-reduced-motion`; não depender de efeitos piscantes.
- Segredos acessíveis também pelo teclado e em dispositivos touch.
- Definir no escopo do freela quantidade de páginas, animações personalizadas e revisões.
- Não transformar ideias opcionais em requisitos antes de serem aprovadas pelo cliente.

## Próxima decisão

Quando o cartão de transmissão estiver aprovado, definir se ele continua como tela intermediária ou se será incorporado à Home definitiva como um painel especial (por exemplo, uma primeira transmissão/alerta).
