# ⚡ Nexus Horizon

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

> **Next-Gen Connectivity System** — Plataforma de monitoramento de conectividade multi-tecnologia: Satélite, 5G, Li-Fi, Open RAN e Direct-to-Cell. Aplicação full-stack com backend Fastify + Firebase, frontend web responsivo e app React Native + Expo.

🌐 **Live Demo:** https://nexus-horizon.onrender.com

---

## 📱 Screenshots

| Login | Dashboard | Mapa Satelital | Open RAN |
|-------|-----------|----------------|----------|
| ![Login](./docs/login.png) | ![Dashboard](./docs/dashboard.png) | ![Mapa](./docs/map.png) | ![RAN](./docs/oran.png) |

---

## ✨ Features

- 🛰️ **Monitoramento SAT** — conexão via satélite em tempo real com indicadores de latência e sinal
- 📡 **5G e Li-Fi** — múltiplas tecnologias de conectividade em uma única plataforma
- 🗺️ **Mapa Satelital** — visualização de nós orbitais com cobertura do Brasil
- 💡 **Simulador Li-Fi** — transmissão de dados via luz com gráfico ao vivo em tempo real
- 📶 **Open RAN** — monitoramento de nós de rádio aberto com métricas detalhadas
- 📱 **Direct-to-Cell** — satélite direto para o celular sem necessidade de antena
- 🔐 **Autenticação JWT** — cadastro, login, recuperação de senha e perfil
- 📊 **Dashboard completo** — métricas em tempo real de todas as tecnologias
- 📱 **App Mobile** — React Native + Expo com suporte a Android, iOS e Web
- 🧹 **Gerenciamento de Cache** — limpeza de dados locais diretamente pelo app
- 🗑️ **Exclusão de Conta** — auto-exclusão com confirmação diretamente pelo perfil
- 🔄 **Detecção Automática de API** — fallback inteligente entre localhost e servidor remoto
- ⚡ **Rate Limiting** — proteção contra brute-force em rotas de autenticação

---

## 🏗️ Arquitetura

```
Nexus-Horizon/
├── docs/                          # Documentação e screenshots
│   ├── index.html / .md           # Documentação do projeto
│   ├── login.png
│   ├── dashboard.png
│   ├── map.png
│   └── oran.png
├── assets/                        # Assets do projeto web
│   ├── adaptive-icon.png
│   ├── icon.png
│   ├── favicon.png
│   └── splash-icon.png
├── mobile/                        # App React Native + Expo
│   ├── src/
│   │   ├── screens/               # 10 telas do app
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── SatelliteScreen.tsx
│   │   │   ├── LiFiScreen.tsx
│   │   │   ├── OranScreen.tsx
│   │   │   ├── DtcScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   └── AboutScreen.tsx
│   │   ├── navigation/            # Drawer + navegação
│   │   ├── services/              # API, SecureStorage, DeviceContext
│   │   ├── theme/                 # Design system (cores, espaçamento)
│   │   └── components/            # Componentes reutilizáveis
│   ├── web/                       # Web build do Expo
│   ├── App.tsx
│   └── package.json
├── server/                        # Backend Node.js + Fastify
│   └── src/
│       ├── server.ts              # Entrypoint Fastify
│       ├── config/
│       │   ├── firebase.ts        # Conexão Firebase Admin
│       │   └── web/               # Frontend web servido pelo backend
│       │       ├── index.html     # SPA principal
│       │       └── admin/
│       │           └── crm/
│       │               └── pages/ # 12 páginas web (login, dash, etc)
│       ├── controllers/
│       │   └── authController.ts  # Auth + reset de senha
│       ├── core/
│       │   └── ConnectivityProvider.ts  # SAT, 5G, Li-Fi, DTC providers
│       ├── middlewares/
│       │   ├── authMiddleware.ts  # Verificação JWT
│       │   └── rateLimit.ts      # Rate limiter por IP/email
│       └── routes/
│           ├── authRoutes.ts
│           └── connectivityRoutes.ts
├── tools/
│   └── expo-proxy/               # Proxy para desenvolvimento Expo
├── web/                          # Frontend GitHub Pages (standalone)
│   └── index.html
├── graphify-out/                  # Knowledge graph do projeto
│   ├── graph.json                # Grafo de conhecimento (463 nós, 480 arestas)
│   ├── graph.html                # Visualização interativa do grafo
│   └── GRAPH_REPORT.md           # Relatório de comunidades
├── package.json
└── README.md
```

---

## 🚀 Tech Stack

| Tecnologia | Uso |
|-----------|-----|
| Node.js + Fastify 5 | Backend API REST |
| TypeScript 6 | Tipagem estática (server + mobile) |
| Firebase Admin 13 | Banco de dados Firestore |
| JWT + bcryptjs | Autenticação segura |
| Nodemailer | Envio de emails (reset de senha) |
| HTML5 + CSS3 + JavaScript | Frontend web responsivo |
| React Native 0.85 + Expo 56 | App mobile (Android, iOS, Web) |
| React Navigation 7 | Navegação Drawer + Stack |
| Reanimated 4 | Animações nativas |
| Canvas API | Gráficos em tempo real (Li-Fi) |
| Render | Deploy e hospedagem do backend |
| GitHub Pages | Deploy do frontend estático |

---

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| 🖥️ Backend API | https://nexus-horizon.onrender.com |
| 🌍 Frontend Web | https://claytonmarcelo.github.io/Nexus-Horizon |
| 🔥 Banco de Dados | Firebase Firestore |
| 📦 Repositório | https://github.com/claytonmarcelo/Nexus-Horizon |

---

## 🔑 API Endpoints

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|:---:|
| POST | `/api/auth/register` | Cadastro de usuário | ❌ |
| POST | `/api/auth/login` | Autenticação | ❌ |
| POST | `/api/auth/forgot-password` | Recuperação de senha | ❌ |
| POST | `/api/auth/reset-password` | Redefinição de senha | ❌ |
| GET | `/api/auth/profile` | Perfil do usuário | ✅ |
| DELETE | `/api/auth/account` | Excluir conta | ✅ |
| POST | `/api/auth/logout` | Logout | ❌ |
| GET | `/api/connectivity/:type` | Dados do provedor (satellite, cellular, lifi, directcell) | ✅ |
| GET | `/health` | Health check | ❌ |
| GET | `/api/health` | Health check | ❌ |

---

## ⚙️ Getting Started

### Backend (servidor)

```bash
# Clone
git clone https://github.com/claytonmarcelo/Nexus-Horizon.git
cd Nexus-Horizon/server

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)
# Copie o exemplo abaixo e preencha:

# PORT=3333
# JWT_SECRET=sua_chave_secreta
# JWT_EXPIRES_IN=7d
# FIREBASE_PROJECT_ID=seu_projeto
# FIREBASE_CLIENT_EMAIL=seu_email@seu_projeto.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=465
# SMTP_USER=seu-email@gmail.com
# SMTP_PASS=sua-senha-de-app
# SMTP_SECURE=true
# NODE_ENV=development

# Em dev, se JWT_SECRET não for definido, o servidor usa automaticamente
# uma chave padrão ('nexus-horizon-dev-secret') com aviso no console.

# Execute em desenvolvimento (com hot-reload)
npm run dev

# Compilar para produção
npm run build

# Iniciar produção
npm start
```

> O servidor inicia em `http://localhost:3333` — acesse para ver a SPA web.

### Mobile (React Native + Expo)

```bash
cd Nexus-Horizon/mobile

# Instale as dependências
npm install

# Inicie o Expo
npx expo start --port 8082 --clear

# Ou para plataforma específica:
npm run android
npm run ios
npm run web
```

> O app detecta automaticamente a URL da API (localhost ou remota).

---

## 🧠 Knowledge Graph

O projeto possui um **grafo de conhecimento** gerado automaticamente:

```bash
# Visualizar o grafo interativo
graphify-out/graph.html

# Consultar relações entre componentes
graphify query "Qual a relação entre authController e os providers?"
graphify path "authController" "ConnectivityProvider"
graphify explain "SatelliteProvider"
```

---

## 🛡️ Segurança

- **JWT** — tokens com expiração configurável (`JWT_EXPIRES_IN`)
- **bcryptjs** — senhas hasheadas com salt 10 rounds
- **Rate Limiting** — proteção contra força bruta em register (8/30min), login (5/10min), forgot-password (3/15min) e reset-password (5/15min)
- **Placeholder Detection** — SMTP placeholder detectado automaticamente, evitando crash em dev
- **Sanitização** — dados de contexto do dispositivo sanitizados (máx 80 caracteres)
- **CORS** — origens permitidas configuráveis via `ALLOWED_ORIGINS`

---

## 👨‍💻 Desenvolvedor

**Clayton Marcelo** — Estudante de Análise e Desenvolvimento de Sistemas

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/claytonmarcelo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/clayton-marcelo-dev)

---

## 📄 Licença

MIT License © 2026 Clayton Marcelo
