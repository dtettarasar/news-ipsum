# Architecture Decisions

*News Ipsum - Technical Architecture Record*

---

## 1. Vue d'ensemble

### 1.1 Stack technique

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│  Nuxt 4 (Vue 3) + Pinia + TypeScript            │
├─────────────────────────────────────────────────┤
│                   SERVER                         │
│  Nitro (Nuxt Server) + H3                       │
├─────────────────────────────────────────────────┤
│                  DATABASE                        │
│  MongoDB + Mongoose                             │
├─────────────────────────────────────────────────┤
│                INFRASTRUCTURE                    │
│  Docker + Caddy (reverse proxy)                 │
└─────────────────────────────────────────────────┘
```

### 1.2 Architecture des dossiers

```
nuxt-app/
├── components/          # Composants Vue réutilisables
│   ├── article/         # Composants liés aux articles
│   ├── category-content/# Composants catégories
│   ├── admin/           # Composants admin
│   └── forms/           # Composants formulaires
├── pages/               # Routes (file-based routing)
├── stores/              # Pinia stores
├── server/
│   ├── api/             # Routes API (Nitro)
│   ├── database/        # Connexion DB + données mock
│   ├── models/          # Mongoose models
│   └── utils/           # Services (auth, crypto)
├── middleware/          # Route middleware
└── tests/               # Tests (Vitest)
```

### 1.3 Infrastructure Docker

Le projet est entièrement containerisé avec Docker Compose. L'architecture permet deux modes d'exécution : **développement** et **production**.

#### Architecture des conteneurs

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK                            │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│   ┌─────────┐   │   ┌─────────┐   │   ┌─────────────────────┐   │
│   │  CADDY  │   │   │  NUXT   │   │   │      MONGODB        │   │
│   │         │◄──┼───│  APP    │───┼──►│                     │   │
│   │ :80/443 │   │   │  :3000  │   │   │  mongo:8.0          │   │
│   └─────────┘   │   └─────────┘   │   │  Volume: ./data/db  │   │
│                 │                 │   └─────────────────────┘   │
│                 │                 │                             │
│                 │   ┌─────────┐   │   (Dev only)                │
│                 │   │ MONGO   │   │                             │
│                 │   │ EXPRESS │   │                             │
│                 │   │  :8081  │   │                             │
│                 │   └─────────┘   │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

#### Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| `docker-compose.yml` | Configuration de base (production) |
| `docker-compose.dev.yml` | Surcharge pour le développement |
| `nuxt-app/Dockerfile` | Build multi-stage de l'app Nuxt |
| `Caddyfile` | Configuration du reverse proxy |
| `Makefile` | Commandes raccourcies |

#### Services Docker

**1. nuxt-app** (Application Nuxt)
```yaml
# Production : Image optimisée multi-stage
build:
  context: ./nuxt-app
  dockerfile: Dockerfile
expose:
  - "3000"

# Dev : Hot reload avec volumes
volumes:
  - ./nuxt-app:/usr/src/app
entrypoint: ["npm", "run", "dev"]
```

**2. mongodb** (Base de données)
```yaml
image: mongo:8.0
volumes:
  - ./data/news-ipsum-db:/data/db  # Persistance locale
environment:
  - MONGO_INITDB_ROOT_USERNAME
  - MONGO_INITDB_ROOT_PASSWORD
```

**3. caddy** (Reverse Proxy / SSL)
```yaml
image: caddy:2.8.4
ports:
  - "80:80"
  - "443:443"
volumes:
  - ./Caddyfile:/etc/caddy/Caddyfile:ro
```

**4. mongo-express** (Dev only - GUI MongoDB)
```yaml
image: mongo-express
ports:
  - "8081:8081"
```

#### Dockerfile (Multi-stage build)

```dockerfile
# ÉTAPE 1: BUILD
FROM node:20 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build

# ÉTAPE 2: PRODUCTION (Image légère)
FROM node:20-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.output ./.output
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/scripts ./scripts
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

#### Commandes Makefile

| Commande | Description |
|----------|-------------|
| **Développement** | |
| `make dev` | Lance le stack dev (hot reload + mongo-express) |
| `make dev-down` | Arrête le stack dev |
| **Production** | |
| `make prod-nuxt` | Rebuild et lance nuxt-app uniquement |
| `make prod-all` | Rebuild tout le stack |
| `make down` | Arrête le stack production |
| **Logs** | |
| `make logs` | Tous les logs |
| `make nuxt-logs` | Logs de nuxt-app |
| `make caddy-logs` | Logs de Caddy |
| **Tests** | |
| `make test` | Tous les tests (unit + integration) |
| `make test-unit` | Tests unitaires uniquement |
| `make test-integration` | Tests d'intégration (nécessite MongoDB) |
| `make test-coverage` | Tests avec couverture |
| **Utilitaires** | |
| `make create-admin` | Créer un utilisateur admin |
| `make generate-secrets` | Générer les secrets (JWT, encryption) |
| **Maintenance** | |
| `make df` | Espace disque Docker |
| `make clean` | Nettoyage sécurisé |
| `make clean-all` | Nettoyage profond (images, cache) |

#### Environnement Dev vs Prod

| Aspect | Dev | Prod |
|--------|-----|------|
| **Hot Reload** | ✅ Oui (volume mount) | ❌ Non |
| **Build** | À la volée | Multi-stage optimisé |
| **Mongo Express** | ✅ Port 8081 | ❌ Non exposé |
| **Console logs** | ✅ Visibles | ❌ Supprimés (esbuild drop) |
| **Source maps** | ✅ Oui | ❌ Non |
| **Commande** | `npm run dev` | `node .output/server/index.mjs` |

#### Variables d'environnement

Les secrets sont injectés via `.env` (non versionné) :

```bash
# MongoDB
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_DB_NAME=

# Auth & Security
JWT_SECRET=
ENCRYPTION_KEY=
SESSION_PASSWORD=

# SEO
NUXT_PUBLIC_SEO_INDEX=false

# Mongo Express (dev only)
ME_CONFIG_BASICAUTH_USERNAME=
ME_CONFIG_BASICAUTH_PASSWORD=
```

---

## 2. Décisions d'architecture (ADR)

### ADR-001: Composition API pour les stores Pinia

**Contexte**: Choix entre Options API et Composition API pour les stores.

**Décision**: Utiliser **Composition API** pour tous les stores.

**Raisons**:
- Cohérence avec Vue 3 Composition API
- Meilleur support TypeScript
- Plus flexible (composables réutilisables)
- Meilleur tree-shaking

**Pattern standardisé**:
```typescript
export const useMyStore = defineStore('myStore', () => {
  // ===== STATE =====
  const data = ref<MyType[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ===== ACTIONS =====
  async function fetchData(): Promise<void> { ... }

  // ===== GETTERS =====
  function getById(id: string): MyType | undefined { ... }

  // ===== RETURN =====
  return { data, loading, error, fetchData, getById }
})
```

---

### ADR-002: Stratégie de données pour les articles

**Contexte**: Comment charger les articles pour la homepage (100+ articles potentiels).

**Décision**: **Endpoints spécialisés + sections dans un store unifié**.

**Raisons**:
- Performance: Ne charger que ce qui s'affiche
- Scalabilité: Fonctionne avec 1000+ articles
- Cache granulaire: Chaque section indépendante
- Logique métier côté serveur: Tri et filtres dans l'API

**Pattern**:
```
GET /api/articles/top-stories?limit=5    → store.topStories
GET /api/articles/recent?category=X      → store.recent
GET /api/articles/popular?limit=12       → store.popular
```

**Rejeté**:
- Charger tous les articles en store (trop lourd)
- Stores séparés par section (duplication possible)

---

### ADR-003: Authentification JWT sans rôle dans le token

**Contexte**: Comment gérer les rôles utilisateur de manière sécurisée.

**Décision**: Token JWT contient uniquement `sub` (user ID chiffré). Le **rôle est toujours lu depuis la base de données**.

**Raisons**:
- Sécurité: Un token volé ne donne pas le rôle
- Consistance: Changement de rôle en base = effet immédiat
- Simplicité: Pas de gestion de refresh token pour les rôles

**Flow**:
```
1. Login → createAuthToken(userId) → JWT avec sub chiffré
2. Request protégée → verifyAuthToken → déchiffre sub → User.findById → rôle en base
3. Middleware → vérifie rôle depuis base (pas depuis JWT)
```

---

### ADR-004: CSS Scoped sans framework

**Contexte**: Choix d'approche CSS (Tailwind, UnoCSS, CSS modules, scoped).

**Décision**: Utiliser **CSS scoped** natif de Vue.

**Raisons**:
- Contrôle total sur le design
- Pas de dépendance externe
- Apprentissage CSS pur (objectif pédagogique)
- Bundle léger

**Règles**:
- Variables CSS globales dans `assets/css/`
- Styles scopés dans chaque composant
- Mobile-first approach
- Nommage BEM-light pour les classes

---

### ADR-005: Données mock en dur pour le développement

**Contexte**: Comment développer sans base de données complète.

**Décision**: Fichier `server/database/site-content.ts` avec données statiques.

**Raisons**:
- Développement rapide du frontend
- Pas de dépendance à la DB pour les features UI
- Données variées pour tester les filtres

**Migration future**:
```
Actuel:  API → site-content.ts (mock)
Futur:   API → MongoDB (real)
```

Les routes API restent identiques — seule la source change.

---

## 3. Patterns de code

### 3.1 Pattern Store (Composition API)

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Item {
  _id: string
  name: string
}

export const useItemStore = defineStore('item', () => {
  // State
  const data = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchData(): Promise<Item[]> {
    if (data.value.length > 0) return data.value
    loading.value = true
    try {
      const response = await $fetch<Item[]>('/api/items')
      data.value = response
      return data.value
    } catch (err: any) {
      error.value = err?.message ?? 'Error'
      return []
    } finally {
      loading.value = false
    }
  }

  // Getters
  function getById(id: string): Item | undefined {
    return data.value.find(item => item._id === id)
  }

  return { data, loading, error, fetchData, getById }
})
```

### 3.2 Pattern API Route

```typescript
// server/api/items/index.get.ts
import { itemsData } from '~/server/database/site-content'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 10

  const items = itemsData
    .slice(0, limit)
    .map(({ _id, name, image }) => ({ _id, name, image }))

  return items // ou return { success: true, data: items }
})
```

### 3.3 Pattern Composant avec Store

```vue
<script setup>
import { useItemStore } from '~/stores/itemStore'

const store = useItemStore()

// SSR + Client hydration
useAsyncData('items', () => store.fetchData())

// Fallback client-side
onMounted(() => {
  if (store.data.length === 0) {
    store.fetchData()
  }
})
</script>

<template>
  <div v-if="store.loading">Loading...</div>
  <div v-else-if="store.data.length > 0">
    <ItemCard v-for="item in store.data" :key="item._id" :item="item" />
  </div>
  <div v-else>No items found</div>
</template>
```

---

## 4. Conventions de nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | kebab-case | `article-card.vue` |
| Stores | camelCase + Store | `articlesStore.ts` |
| API routes | kebab-case.method | `top-stories.get.ts` |
| Types/Interfaces | PascalCase | `ArticleItem` |
| Variables | camelCase | `topStories` |
| Constantes | UPPER_SNAKE | `MAX_ARTICLES` |

---

## 5. Historique

| Date | ADR | Décision |
|------|-----|----------|
| 2026-02-25 | ADR-001 | Composition API pour stores |
| 2026-02-25 | ADR-002 | Endpoints spécialisés pour articles |
| 2026-02-25 | ADR-003 | JWT sans rôle dans le token |
| 2026-02-25 | ADR-004 | CSS scoped sans framework |
| 2026-02-25 | ADR-005 | Données mock en dur |

