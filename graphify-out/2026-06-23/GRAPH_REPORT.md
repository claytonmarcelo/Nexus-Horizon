# Graph Report - .  (2026-06-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 463 nodes · 480 edges · 62 communities (33 shown, 29 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `39f596c0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]

## God Nodes (most connected - your core abstractions)
1. `expo` - 13 edges
2. `expo` - 13 edges
3. `compilerOptions` - 12 edges
4. `SatelliteProvider` - 8 edges
5. `CellularProvider` - 8 edges
6. `LiFiProvider` - 8 edges
7. `DirectToCellProvider` - 8 edges
8. `register()` - 7 edges
9. `requireAuth()` - 6 edges
10. `forgotPassword()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `CRM Dashboard` --references--> `Mobile API Service`  [INFERRED]
  server/src/config/web/admin/crm/pages/dashboard.html → mobile/src/services/api.ts
- `Relatório de Auditoria e Correção` --references--> `Mobile API Service`  [EXTRACTED]
  AUDITORIA_RELATORIO.md → mobile/src/services/api.ts
- `Relatório de Auditoria e Correção` --references--> `Auth Controller`  [EXTRACTED]
  AUDITORIA_RELATORIO.md → server/src/controllers/authController.ts
- `Relatório de Auditoria e Correção` --references--> `Firebase Config`  [EXTRACTED]
  AUDITORIA_RELATORIO.md → server/src/config/firebase.ts
- `Relatório de Auditoria e Correção` --references--> `Server Entry (server.ts)`  [EXTRACTED]
  AUDITORIA_RELATORIO.md → server/src/server.ts

## Import Cycles
- None detected.

## Communities (62 total, 29 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (30): db, missingVars, privateKey, AuthBody, buildResetPasswordLink(), ClientContext, createMailTransporter(), deleteAccount() (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): dependencies, axios, expo, expo-linear-gradient, expo-secure-store, expo-status-bar, firebase, localstorage-polyfill (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (7): CellularProvider, DirectToCellProvider, IConnectivityProvider, LiFiProvider, SatelliteProvider, authMiddleware(), connectivityRoutes()

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (29): dependencies, axios, expo, expo-linear-gradient, expo-secure-store, react, react-dom, react-native (+21 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, edgeToEdgeEnabled, predictiveBackGestureEnabled, expo, android, icon (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, edgeToEdgeEnabled, predictiveBackGestureEnabled, expo, android, icon (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (23): dependencies, bcryptjs, dotenv, fastify, @fastify/cors, @fastify/jwt, @fastify/static, firebase-admin (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (14): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, outDir, resolveJsonModule, rootDir (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.27
Nodes (9): apiFetch(), checkConnectionQuality(), getToken(), requireAuth(), showToast(), startClock(), startHeartbeat(), stopHeartbeat() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (9): api, defaultUrl, detectApiUrl(), envApiUrl, getCandidateApiUrls(), getHealthUrl(), removeAuthToken(), restoreAuthSession() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.27
Nodes (9): api, defaultUrl, detectApiUrl(), envApiUrl, getCandidateApiUrls(), getHealthUrl(), removeAuthToken(), restoreAuthSession() (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.31
Nodes (9): byIp(), byIpAndEmail(), cleanupExpiredEntries(), createRateLimiter(), getRequestBody(), normalizeValue(), RateLimitEntry, RateLimitOptions (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (7): child, cliPath, { existsSync }, mobileDir, projectRoot, { resolve }, { spawn }

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (4): bootStyles, Drawer, drawerStyles, Stack

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (4): bootStyles, Drawer, drawerStyles, Stack

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (6): buildCommand, headers, outputDirectory, public, rewrites, $schema

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (6): Relatório de Auditoria e Correção, Mobile API Service, Auth Controller, CRM Dashboard, Firebase Config, Server Entry (server.ts)

### Community 17 - "Community 17"
Cohesion: 0.53
Nodes (6): Dashboard Screenshot, Login Screenshot, Satellite Map Screenshot, Open RAN Screenshot, Mobile Nexus Horizon README, Nexus Horizon README

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (5): bin, expo, name, private, version

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (4): SatelliteNode, satellites, SatelliteStatus, styles

### Community 20 - "Community 20"
Cohesion: 0.60
Nodes (5): ClientContext, getClientContext(), getViewportWidth(), getWebBrowserInfo(), getWebSystemInfo()

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (4): SatelliteNode, satellites, SatelliteStatus, styles

### Community 22 - "Community 22"
Cohesion: 0.60
Nodes (5): ClientContext, getClientContext(), getViewportWidth(), getWebBrowserInfo(), getWebSystemInfo()

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (3): highlights, quickSteps, styles

### Community 25 - "Community 25"
Cohesion: 0.40
Nodes (3): highlights, quickSteps, styles

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): compilerOptions, strict, extends

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (3): compilerOptions, strict, extends

## Knowledge Gaps
- **231 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+226 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `slug`, `version` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09841269841269841 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08735632183908046 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._