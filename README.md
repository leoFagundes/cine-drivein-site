<h1 align="center">Cine Drive-in — Site Público</h1>

<p align="center">
  Site estático voltado ao público com a programação de filmes, mapa, cardápio e informações do Cine Drive-in de Brasília.
</p>

<p align="center">
  <a href="https://github.com/leoFagundes/cine-drivein-site">
    <img alt="GitHub repo" src="https://img.shields.io/badge/GitHub-cine--drivein--site-181717?logo=github">
  </a>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss&logoColor=white">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Firestore%20%2B%20RTDB-orange?logo=firebase">
</p>

---

## Sobre o projeto

O site público do Cine Drive-in é a vitrine digital do cinema para o público geral. Ele exibe em tempo real as sessões em cartaz (busca dados do Firebase), preços, snack bar, localização no mapa e informações institucionais. O site é gerado como exportação estática (`output: "export"`) e não requer servidor Node.js em produção.

---

## Funcionalidades

### Programação de filmes
- Até 4 sessões configuradas no painel admin, exibidas automaticamente
- Pôster, sinopse, diretor, elenco, gêneros, duração, idioma, horário e classificação indicativa
- Link para trailer no YouTube
- Página de detalhe individual por sessão (`/film/detail/screening1` … `screening4`)

### Informações do cinema
- Seção de preços com regras por dia da semana (meia e inteira)
- Seção do snack bar com cardápio modal
- Seção institucional "Como Funciona" e história do cinema
- Localização via mapa interativo

### Pop-up de avisos
- Pop-up configurável pelo painel admin (imagem, título, descrições)
- Exibido na entrada do site quando ativado

### Analytics anônimo
- Registro de visitas e interações (cliques em filmes, páginas, sessões) no Firebase Firestore
- Deduplicação por sessão via `sessionStorage` — cada aba conta uma única visita por carregamento
- Dados consumidos pelo painel admin na aba Estatísticas

### Efeitos sazonais
- Animações visuais para eventos: Halloween, Natal, Páscoa
- Controlado pelo campo `isEvent` no Firebase

### Avaliação / Feedback
- Página `/feedback` com formulário de avaliação por estrelas e comentário
- Dados salvos no Firestore e visualizados no painel admin

---

## Estrutura de páginas

```
/                     → Página inicial (Hero, Filmes, Preços, Snack, Localização)
/film/detail/screening1  → Detalhe da Sessão 1
/film/detail/screening2  → Detalhe da Sessão 2
/film/detail/screening3  → Detalhe da Sessão 3
/film/detail/screening4  → Detalhe da Sessão 4
/info                 → Informações e história
/feedback             → Formulário de avaliação
/advertiser           → Página "Seja um Anunciante"
```

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14 | Framework React com `output: "export"` (site estático) |
| [React](https://react.dev/) | 18+ | Componentes de interface com TypeScript |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática em todo o projeto |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Estilização utilitária |
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | — | Leitura de configuração do site (filmes, preços, pop-up, status) |
| [Firebase RTDB](https://firebase.google.com/docs/database) | — | Dados em tempo real (ex.: status da loja) |
| [Framer Motion](https://www.framer.com/motion/) | — | Animações de entrada e transições |
| [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/) / [Google Maps](https://developers.google.com/maps) | — | Mapa interativo com localização do cinema |
| [React Icons](https://react-icons.github.io/) | — | Ícones SVG |
| [react-snowfall](https://github.com/cahilfoley/react-snowfall) | — | Efeito de neve no evento de Natal |

---

## Configuração do ambiente

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Projeto Firebase configurado (Firestore e RTDB)

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com as credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

### Instalação e execução

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build estático para produção
npm run build

# Resultado em /out — pronto para hospedagem estática (Netlify, Vercel, GitHub Pages etc.)
```

---

## Relação com os outros sistemas

O site público é **somente leitura** em relação ao Firebase — ele consome dados, não os cria. Toda a configuração (filmes em cartaz, preços, pop-up, eventos sazonais) é gerenciada pelo **Painel Admin** (`cinedrivein-admin-v2`).

Os dados de analytics gerados pelo site (visitas, cliques) são armazenados no Firestore e exibidos no painel admin na aba **Site → Estatísticas**.

---

## Autor

<p>
  <img src="https://github.com/leoFagundes.png" width="80px" style="border-radius:50%" alt="Leonardo Fagundes" />
  <br/>
  <strong>Leonardo Fagundes</strong>
</p>

[![LinkedIn](https://img.shields.io/badge/-Leonardo%20Fagundes-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/leonardo-fagundes-5a348a248/)
[![Gmail](https://img.shields.io/badge/-leofagundes2015@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white)](mailto:leofagundes2015@gmail.com)
[![Instagram](https://img.shields.io/badge/-@leo.fagundes.50-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/leo.fagundes.50/)
