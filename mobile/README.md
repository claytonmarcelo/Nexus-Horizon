# ⚡ Nexus Horizon

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)

> **Next-Gen Connectivity System** — Plataforma de monitoramento de conectividade com SAT, 5G, Li-Fi, Open RAN e Direct-to-Cell.

🌐 **Live Demo:** [https://claytonmarcelo.github.io/Nexus-Horizon/](https://claytonmarcelo.github.io/Nexus-Horizon/)

---

## 📱 Screenshots

| Login | Dashboard | Mapa Satelital | Open RAN |
|-------|-----------|----------------|----------|
| ![Login](./docs/login.png) | ![Dashboard](./docs/dashboard.png) | ![Mapa](./docs/map.png) | ![RAN](./docs/oran.png) |

---

## ✨ Features

- 🛰️ **Monitoramento SAT** — conexão via satélite em tempo real
- 📡 **5G e Li-Fi** — múltiplas tecnologias de conectividade
- 🗺️ **Mapa Satelital** — nós orbitais com cobertura do Brasil
- 💡 **Simulador Li-Fi** — transmissão de dados via luz com gráfico ao vivo
- 📶 **Open RAN** — monitoramento de nós de rádio aberto
- 📱 **Direct-to-Cell** — satélite direto para o celular
- 🔐 **Autenticação JWT** — login seguro com token
- 📊 **Dashboard completo** — métricas em tempo real
- 📱 **Responsivo** — funciona em mobile, tablet e desktop

---

## 🏗️ Architecture

```
Nexus-Horizon/
├── docs/                    # Frontend (GitHub Pages)
│   └── index.html           # Aplicação web completa
├── mobile/                  # App mobile (React Native)
│   └── src/
│       ├── screens/         # Telas do app
│       ├── services/        # Serviços e API
│       └── theme/           # Design system
├── server/                  # Backend Node.js (Render)
│   └── src/
│       ├── config/          # Firebase + configurações
│       ├── controllers/     # Lógica de negócio
│       ├── core/            # ConnectivityProvider
│       ├── middlewares/     # Auth middleware JWT
│       ├── repositories/    # Acesso ao Firebase
│       └── routes/          # Rotas da API REST
└── README.md
```

---

## 🚀 Tech Stack

| Tecnologia | Uso |
|-----------|-----|
| Node.js + Fastify | Backend API REST |
| TypeScript | Tipagem estática |
| Firebase Firestore | Banco de dados NoSQL |
| JWT + bcryptjs | Autenticação segura |
| HTML/CSS/JS | Frontend web |
| React Native + Expo | App mobile |
| GitHub Pages | Deploy do frontend |
| Render | Deploy do backend |

---

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| 🖥️ Frontend | [claytonmarcelo.github.io/Nexus-Horizon](https://claytonmarcelo.github.io/Nexus-Horizon/) |
| ⚙️ Backend API | [nexus-horizon.onrender.com](https://nexus-horizon.onrender.com) |
| 🔥 Database | Firebase Firestore (nexus-horizon) |

---

## ⚙️ Getting Started

```bash
# Clone o repositório
git clone https://github.com/claytonmarcelo/Nexus-Horizon.git

# Entre na pasta do servidor
cd Nexus-Horizon/server

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env com:
# PORT=3333
# JWT_SECRET=seu_secret
# JWT_EXPIRES_IN=7d
# FIREBASE_PROJECT_ID=seu_project_id
# FIREBASE_CLIENT_EMAIL=seu_client_email
# FIREBASE_PRIVATE_KEY=sua_private_key

# Compile e rode
npm run build
npm start
```

Acesse: **https://claytonmarcelo.github.io/Nexus-Horizon/**

---

## 🔑 API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/profile` | Perfil do usuário |
| GET | `/api/connectivity/satellite` | Dados satélite |
| GET | `/api/connectivity/cellular` | Dados 5G |
| GET | `/api/connectivity/lifi` | Dados Li-Fi |
| GET | `/api/connectivity/directcell` | Dados Direct-to-Cell |
| GET | `/health` | Status da API |

---

## 👨‍💻 Author

**Clayton Marcelo**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/clayton-marcelo-270602352)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/claytonmarcelo)

---

## 📄 License

MIT License © 2026 Clayton Marcelo
