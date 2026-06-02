# Relatório de Auditoria e Correção — Nexus Horizon

## 1. Erros Encontrados

### Críticos (Segurança)
- **`server/firebase-credentials.json` no versionamento** — Arquivo com chave privada Firebase commitado no repositório
- **`server/.env` com credenciais reais** — `.env` não estava no `.gitignore` da raiz e continha chave privada Firebase
- **Nenhum `.gitignore` na raiz** — `node_modules/`, `dist/`, `.env` não eram ignorados globalmente
- **`dist/` no versionamento** — 14 arquivos compilados (JS + source maps) commitados desnecessariamente
- **`server/node_modules/` no versionamento** — Milhares de arquivos de dependências commitados
- **JWT_SECRET padrão em produção** — Usava `'nexus-horizon-secret-key'` sem validação de ambiente
- **CORS com `origin: true`** — Aceitava qualquer origem, sem restrição em produção
- **Firebase dependente de arquivo local** — Fallback para `firebase-credentials.json` se env vars ausentes
- **`@prisma/client` como dependência não utilizada** — 30+ MB desnecessários

### UTF-8 BOM
- `server/src/config/firebase.ts` — BOM UTF-8 presente
- `server/.gitignore` — BOM UTF-8 presente
- `mobile/src/services/api.ts` — BOM UTF-8 presente

### Autenticação
- **Sem validação de entrada** — Nome, email e senha sem validação de formato/mínimo
- **Email não normalizado** — Sem `trim().toLowerCase()`, permitia duplicatas por variação de case
- **Mensagens de erro inconsistentes** — Login retornava "Credenciais inválidas" vs outros padrões
- **Senha retornada no profile** — A rota `getProfile` devolvia o documento completo sem sanitização

### Backend (server.ts)
- **Caminhos estáticos errados** — `path.join(__dirname, 'config/web')` não resolvia para `src/config/web` no runtime
- **Ausência de handler global de erros** — Erros não tratados retornavam HTML padrão do Fastify
- **Porta não validada** — Usava `process.env.PORT` sem fallback numérico adequado

### Dependências
- **`@prisma/client` e `firebase`** — Instalados mas nunca importados/usados

## 2. Arquivos Corrigidos

| Arquivo | Correção |
|---------|----------|
| **`.gitignore` (raiz)** | Criado com `node_modules/`, `dist/`, `firebase-credentials*`, `.env`, `.expo/`, `*.log` |
| **`server/.gitignore`** | Adicionado `dist/`, `firebase-credentials*.json`, `*.log` |
| **`server/.env.example`** | Criado com todas as variáveis necessárias e valores placeholder |
| **`server/firebase-credentials.json`** | Removido do tracking git (`git rm --cached`) |
| **`server/dist/`** | Removido do tracking git (14 arquivos) |
| **`server/node_modules/`** | Removido do tracking git |
| **`server/src/config/firebase.ts`** | Removido BOM; removido fallback para arquivo local; validação de variáveis ausentes com mensagem clara; suporte a `\n` no private key |
| **`server/src/server.ts`** | CORS restrito por `ALLOWED_ORIGINS`; JWT_SECRET obrigatório em produção; caminhos estáticos corrigidos (`../src/config/web`); handler global de erros adicionado |
| **`server/src/controllers/authController.ts`** | Validação de nome (mín. 2 char), email (regex + normalize), senha (mín. 6 char); email normalizado (`trim().toLowerCase()`); mensagens de erro consistentes; sanitização do profile (remove `password`, `resetToken`); retorna 409 para duplicatas |
| **`server/package.json`** | Removido `@prisma/client` e `firebase` (não utilizados) |
| **`mobile/src/services/api.ts`** | BOM UTF-8 removido |
| **`server/src/config/web/admin/crm/pages/assets/style.css`** | (Não alterado — mantido padrão original) |
| **`web/index.html`** | (Não alterado — API detection e offline handling já implementados) |
| **`docs/index.html`** | (Não alterado — mantido padrão original) |

## 3. Motivo de Cada Correção

1. **Segurança**: Credenciais Firebase expostas no repositório permitem acesso total ao Firestore por qualquer pessoa com acesso ao código. A correção remove do tracking e configura Firebase exclusivamente por variáveis de ambiente.

2. **BOM UTF-8**: Arquivos com BOM causam problemas em sistemas Unix/Linux e em ferramentas de CI/CD. A remoção garante compatibilidade multiplataforma.

3. **Validação de entrada**: Previne cadastro de dados inválidos, duplicatas por variação de case, e senhas fracas. Mensagens claras melhoram UX.

4. **Sanitização do profile**: Garante que senha e tokens de reset nunca sejam retornados ao cliente.

5. **Caminhos estáticos**: O runtime em `dist/` precisa resolver para `src/config/web`. O caminho `../src/config/web` a partir de `dist/` resolve corretamente.

6. **JWT_SECRET obrigatório**: Em produção, uma chave JWT padrão é um risco crítico de segurança. O servidor agora aborta se não houver JWT_SECRET em produção.

7. **CORS restrito**: `origin: true` permite qualquer site fazer requisições à API. Agora aceita somente origens configuradas via `ALLOWED_ORIGINS`.

8. **Dependências não utilizadas**: `@prisma/client` e `firebase` aumentavam o tamanho do pacote sem benefício.

## 4. Testes Executados

Todos os testes foram executados localmente com o servidor rodando (`node dist/server.js`) e as credenciais Firebase do `.env`:

| Teste | Resultado |
|-------|-----------|
| Health check (`GET /health`) | ✅ OK |
| Cadastro válido (`POST /api/auth/register`) | ✅ 201 + token |
| Cadastro com nome curto | ✅ 400 "Nome deve ter no mínimo 2 caracteres" |
| Cadastro com email inválido | ✅ 400 "Email inválido" |
| Cadastro com senha curta | ✅ 400 "Senha deve ter no mínimo 6 caracteres" |
| Cadastro duplicado | ✅ 409 "Este email já está cadastrado" |
| Login válido | ✅ 200 + token + user (sem password) |
| Login com senha errada | ✅ 401 "Email ou senha incorretos" |
| Login com email inexistente | ✅ 401 "Email ou senha incorretos" |
| Profile autenticado | ✅ 200 + dados do usuário (sem password) |
| Profile sem token | ✅ 401 "Token inválido ou expirado" |
| Logout | ✅ 200 "Logout realizado com sucesso" |
| Connectivity autenticado | ✅ 200 + dados de conectividade |
| Connectivity sem token | ✅ 401 |
| Provedor inválido | ✅ 400 "Provedor inválido" |
| Build TypeScript (`tsc --noEmit`) | ✅ 0 erros |
| Build completo (`tsc`) | ✅ dist/ gerado com 14 arquivos |

## 5. Pendências Restantes

1. **`server/.env` com credenciais reais** — O arquivo existe localmente para desenvolvimento e está no `.gitignore`, mas seria ideal rotacionar a chave Firebase no console do Google Cloud, já que esteve exposta no repositório.

2. **Testes automatizados** — O projeto não possui suite de testes. Recomenda-se adicionar testes unitários com Jest ou Vitest para `authController.ts`.

3. **Rate limiting** — Não há limite de tentativas de login. Em produção, recomenda-se adicionar `@fastify/rate-limit` para prevenir brute force.

4. **Mobile (React Native)** — O app mobile não foi testado nesta auditoria. Verificar se `mobile/src/services/api.ts` (BOM corrigido) e demais arquivos funcionam após as alterações.

5. **HTTPS em produção** — O servidor não configura TLS. Em produção, usar reverse proxy (nginx, Cloudflare, etc.) ou `@fastify/https`.

6. **Variáveis de ambiente no deploy** — Verificar se Render/GitHub Pages estão configurados com as variáveis `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` e `JWT_SECRET`.

## 6. Comandos para Deploy Local

```bash
cd server
npm install
npm run build
npm start
```

O servidor iniciará em `http://localhost:3333` com as variáveis configuradas no `.env`.
