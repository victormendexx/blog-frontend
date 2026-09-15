# Mural — Front-end (Tech Challenge Fase 3)

![CI/CD](https://github.com/victormendexx/blog-frontend/actions/workflows/ci-cd.yml/badge.svg)

Interface React para a plataforma de blogging educacional **Mural**, consumindo a API REST
desenvolvida na Fase 2 ([blog-api](https://github.com/victormendexx/blog-api)). Permite que
alunos leiam e busquem posts publicamente, e que professores autenticados criem, editem e
excluam conteúdo.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar localmente](#como-rodar-localmente)
- [Como rodar com Docker](#como-rodar-com-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Guia de uso](#guia-de-uso)
- [CI/CD](#cicd)
- [Desafios e aprendizados](#desafios-e-aprendizados)

## Sobre o projeto

Este repositório contém **apenas o front-end**. Ele depende da API REST do repositório
[`blog-api`](https://github.com/victormendexx/blog-api) estar em execução — local ou publicada
— para funcionar por completo.

## Arquitetura

src/
routes/AppRouter.tsx define todas as rotas e aplica o Layout + ProtectedRoute
│
components/Layout.tsx cabeçalho comum a todas as páginas, reage ao estado de auth
│
pages/ um componente por rota (lista, leitura, login, criar, editar, admin)
│
services/ chamadas HTTP à API (postsService, authService), via api.ts
│
context/AuthContext.tsx estado de autenticação (professor logado, token) via Context API


**Proteção de rotas:** `/admin`, `/admin/new` e `/admin/edit/:id` ficam agrupadas sob um
componente `ProtectedRoute`, que verifica `AuthContext` e redireciona para `/login` caso não
haja sessão ativa — preservando a rota original em `location.state.from`, para retornar a ela
após o login.

**Cliente de API:** todas as chamadas passam por um único `apiFetch` (`services/api.ts`), que:
injeta automaticamente o header `Authorization` quando há um token salvo, desembrulha o
envelope `{success, data}`/`{success:false, error}` retornado pelo back-end, e lança uma
`ApiError` tipada em caso de falha — nenhum componente lida com `fetch` bruto.

**Estado de autenticação:** o token e os dados do professor ficam em `localStorage`, restaurados
automaticamente ao carregar a página (sessão sobrevive a um F5).

**Design:** paleta e tipografia centralizadas via `@theme` do Tailwind v4, em `src/index.css` —
fundo "papel", tipografia serifada (Lora) nos títulos e sans (Inter) no corpo, evitando o visual
genérico de template.

## Tecnologias utilizadas

- **React 18** + **TypeScript** — componentes funcionais e hooks
- **Vite** — build tool e dev server
- **React Router** — roteamento client-side
- **Tailwind CSS v4** — estilização utilitária, configurada via CSS (`@theme`)
- **Context API** — gerenciamento de estado de autenticação
- **Docker** + **Nginx** (variante *unprivileged*) — build de produção
- **GitHub Actions** — CI/CD

## Estrutura de pastas

src/
├── components/ # Layout, ProtectedRoute, PostCard, PostForm
├── context/ # AuthContext
├── hooks/ # useDebouncedValue
├── pages/ # componentes de rota (um por página)
├── routes/ # AppRouter (definição das rotas)
├── services/ # api.ts, postsService.ts, authService.ts
├── types/ # tipos compartilhados (Post, Teacher, etc.)
├── utils/ # truncate, formatDate
├── App.tsx
├── main.tsx
└── index.css # tokens de design (@theme) + estilos globais


## Como rodar localmente

Pré-requisitos: Node.js 20+, e a API do back-end rodando (veja o README do
[`blog-api`](https://github.com/victormendexx/blog-api)).

```bash
npm install
cp .env.example .env
# ajuste VITE_API_URL se sua API não estiver em localhost:3000

npm run dev
```

Acesse `http://localhost:5173`.

## Como rodar com Docker

```bash
docker compose up --build
```

Acesse `http://localhost:8080`.

> **Atenção:** diferente do back-end, a URL da API aqui é definida **em tempo de build**, não
> em runtime (o Vite "assa" as variáveis `VITE_*` no JavaScript compilado). Para apontar pra uma
> API diferente, crie um `.env` na raiz com `VITE_API_URL=...` e rode `docker compose up --build`
> novamente — só recriando a imagem a nova URL é aplicada.

## Variáveis de ambiente

| Variável        | Descrição                                    | Exemplo                     |
|-----------------|------------------------------------------------|-------------------------------|
| `VITE_API_URL`  | URL base da API REST do back-end                | `http://localhost:3000`       |

## Guia de uso

- **Página principal (`/`)** — lista todos os posts publicados, com campo de busca por
  palavra-chave (busca com debounce, usa `GET /posts/search`).
- **Leitura de post (`/posts/:id`)** — conteúdo completo, acessível publicamente.
- **Login (`/login`)** — autenticação de professores. Após login bem-sucedido, retorna
  automaticamente à página que o usuário tentou acessar antes de ser redirecionado.
- **Novo post (`/admin/new`, protegida)** — formulário de criação.
- **Editar post (`/admin/edit/:id`, protegida)** — formulário pré-preenchido com os dados atuais.
- **Administração (`/admin`, protegida)** — lista todos os posts com opções de editar/excluir.

Professores são criados via o script de seed do back-end (`npm run seed`, no repositório
`blog-api`) — não existe cadastro público de professor pela interface, por design.

## CI/CD

O workflow (`.github/workflows/ci-cd.yml`) segue a mesma estrutura do back-end:

1. **`lint-and-build`** — roda em todo push e pull request para `main`: lint e build de produção.
2. **`build-and-push`** — roda apenas quando o código entra na `main`: builda a imagem Docker
   (com a `VITE_API_URL` definida na variável de repositório `vars.VITE_API_URL`) e publica no
   GHCR.

## Desafios e aprendizados

> Esta seção é um relato da experiência da equipe — substitua os colchetes pelas suas palavras.

- **`verbatimModuleSyntax` no template do Vite:** o template `react-ts` mais recente exige que
  imports de tipos (`interface`/`type`) usem `import type`, separados dos imports de valor —
  diferente do que era comum em projetos TypeScript mais antigos. Vários imports precisaram ser
  ajustados (ex: `import type { Post } from '../types'`).
- **Permissão `workflow` do GitHub CLI:** o primeiro `git push` alterando
  `.github/workflows/ci-cd.yml` foi rejeitado porque o token do `gh` não tinha o escopo
  `workflow` habilitado por padrão. Resolvido com `gh auth refresh -h github.com -s workflow`.
- **Autenticação real vs. simulada:** o requisito de "apenas usuários autenticados acessarem
  criação/edição/administração" levou à decisão de voltar ao back-end e implementar JWT de
  verdade, em vez de uma tela de login que só existisse visualmente no front — garantindo que a
  API também rejeite requisições não autenticadas, não só a interface.
- **[Descreva aqui qualquer ajuste de UI/UX que vocês fizeram ao testar em dispositivos reais.]**
- **[Adicione outros aprendizados relevantes da equipe.]**

## Autor

Victor Mendes — Pós-graduação em Full Stack Development (FIAP)