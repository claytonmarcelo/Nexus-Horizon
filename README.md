Atualize o arquivo README.md do projeto Nexus-Horizon.

Objetivo:
Corrigir links quebrados com erro 404, melhorar a formatação do README e manter o padrão original do projeto.

Regras obrigatórias:
- Não usar UTF-8 com BOM.
- Não alterar código funcional do projeto.
- Alterar somente o README.md.
- Manter o nome Nexus Horizon.
- Remover ou corrigir qualquer link 404.
- Substituir o link antigo do GitHub Pages por:
  https://nexus-horizon.onrender.com/
- Manter os screenshots existentes:
  ./docs/login.png
  ./docs/dashboard.png
  ./docs/map.png
  ./docs/oran.png
- Garantir markdown limpo, organizado e sem tabelas quebradas.

Substitua todo o conteúdo do README.md por:

# ⚡ Nexus Horizon

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

> **Next-Gen Connectivity System** — Plataforma web de monitoramento de conectividade com SAT, 5G, Li-Fi, Open RAN e Direct-to-Cell.

## 🔗 Deploy

**Live Demo:** https://nexus-horizon.onrender.com/

---

## 📸 Screenshots

| Login | Dashboard |
|---|---|
| ![Login](./docs/login.png) | ![Dashboard](./docs/dashboard.png) |

| Mapa Satelital | Open RAN |
|---|---|
| ![Mapa Satelital](./docs/map.png) | ![Open RAN](./docs/oran.png) |

---

## ✨ Features

- Monitoramento SAT em tempo real.
- Suporte visual para 5G, Li-Fi, Open RAN e Direct-to-Cell.
- Mapa satelital com nós orbitais e cobertura no Brasil.
- Simulador Li-Fi com transmissão via luz.
- Dashboard com métricas de latência, sinal, status e tecnologia ativa.
- Autenticação com JWT.
- Layout responsivo para desktop, tablet e mobile.
- Backend Node.js com Fastify.
- Banco de dados Firebase Firestore.

---

## 🏗️ Arquitetura

```text
Nexus-Horizon/
├── docs/
│   ├── index.html
│   ├── login.png
│   ├── dashboard.png
│   ├── map.png
│   └── oran.png
├── mobile/
│   └── src/
│       ├── screens/
│       ├── services/
│       └── theme/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── core/
│       ├── middlewares/
│       ├── repositories/
│       └── routes/
├── package.json
├── package-lock.json
└── README.md
