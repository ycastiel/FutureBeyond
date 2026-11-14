
# FutureBeyond — H1 Produtora

Site oficial e experiência narrativa interativa da H1 Produtora, desenvolvido com Astro e TypeScript.

O FutureBeyond é o universo digital que abriga a H1 Produtora, uma empresa fictícia com identidade inspirada na internet dos anos 2000, estética Y2K, Old Web e elementos de ficção científica.

## Tecnologias

- Astro
- TypeScript
- CSS
- JavaScript
- Cloudflare Workers (Static Assets)
- Cloudflare R2 para mídias externas

O projeto utiliza geração estática e não depende de um backend tradicional, banco de dados ou autenticação real.

## Requisitos

- Node.js >= 22.19.0
- npm

## Estrutura

```text
FutureBeyond/
├── application/
│   ├── config/
│   │   ├── astro.config.mjs
│   │   ├── tsconfig.json
│   │   └── wrangler.jsonc
│   ├── .astro/
│   └── start/
│       └── dist/
├── frontend/
│   ├── pages/
│   ├── recursos/
│   │   ├── css/
│   │   ├── javascript/
│   │   └── publico/
│   └── views/
│       ├── componentes/
│       └── layouts/
├── docs/
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

Os diretórios `application/.astro/` e `application/start/dist/` são gerados automaticamente.

As dependências e os caches de compilação ficam no `node_modules/` da raiz.

## Instalação

Execute na raiz do repositório:

```powershell
npm install
```

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run check` | Verifica componentes Astro e TypeScript |
| `npm run build` | Gera os arquivos estáticos de produção |
| `npm run preview` | Executa o preview local da build |
| `npm run build:preview` | Compila e inicia o preview |

O servidor local utiliza normalmente:

http://localhost:4321/

## Rotas principais

| Rota | Página |
|---|---|
| `/` | Entrada narrativa |
| `/home` | Página inicial |
| `/home/transmissao` | Transmissão intermediária |
| `/blog/sobre` | Sobre a H1 |
| `/alienados` | Podcast Alienados |
| `/documentario` | Fato Capital |
| `/forum` | Fórum narrativo |
| `/login` | Acesso aos personagens |

Existem também rotas individuais para Benê, Jeff, Leonardo e Wolftheus.

## Arquitetura

### application/

Centraliza a configuração operacional do Astro, TypeScript e Wrangler, além dos arquivos gerados durante a compilação.

### frontend/pages/

Contém as rotas Astro utilizadas para gerar as páginas públicas.

### frontend/views/

Contém layouts e componentes compartilhados ou especializados.

### frontend/recursos/css/

Contém os estilos globais, componentes visuais e estilos específicos de cada página.

### frontend/recursos/javascript/

Contém os scripts de interatividade, organizados por responsabilidade.

### frontend/recursos/publico/

Contém arquivos estáticos como imagens, ícones e demais recursos públicos.

### docs/

Contém o histórico das decisões técnicas e criativas.

## Mídias

O projeto utiliza recursos estáticos locais e mídias hospedadas externamente.

Os vídeos maiores podem ser disponibilizados por meio do Cloudflare R2.

As URLs definitivas e a disponibilidade dos arquivos devem ser conferidas antes da publicação.

## Deploy

A hospedagem utiliza Cloudflare Workers com Static Assets.

A compilação gera os arquivos em:

`application/start/dist/`

O arquivo de configuração do Wrangler está localizado em:

`application/config/wrangler.jsonc`

Para publicação manual, após validar a configuração de produção:

```powershell
npm run build
npx wrangler deploy --config application/config/wrangler.jsonc
```

O fluxo planejado de branches é:

- `desenvolvimento`: desenvolvimento e validação.
- `main`: versão destinada à produção.

A configuração final do domínio personalizado será realizada no Cloudflare.

