# Backlog - User Stories

*News Ipsum - Sprint Backlog*

---

## Légende

| Label | Description |
|-------|-------------|
| **P0** | Critique - Bloquant |
| **P1** | Haute priorité |
| **P2** | Moyenne priorité |
| **P3** | Basse priorité - Nice to have |
| ✅ | Done |
| 🟡 | In Progress |
| ⬜ | To Do |

---

## Epic 1: Homepage

### US-001: Article Card Component ✅ P0

**En tant que** visiteur  
**Je veux** voir une card présentant un article  
**Afin de** comprendre rapidement le contenu et décider de lire

**Critères d'acceptance:**
- [x] Affiche l'image principale de l'article
- [x] Affiche un badge avec le nom de la catégorie
- [x] Affiche le titre (max 3 lignes, ellipsis via line-clamp-3)
- [x] Affiche l'avatar et le nom de l'auteur
- [x] Affiche le temps de lecture
- [x] Affiche le nombre de vues (formaté: 9k)
- [x] Bouton "Read Full Article" cliquable
- [x] Au clic → navigation vers `/article/read/:slug`

**Technical notes:**
- Composant: `components/article/Card.vue`
- Props typées: `title`, `slug`, `image`, `category`, `authorName`, `authorAvatar`, `readTime`, `views`
- Couleur de fond aléatoire SSR-safe via `useState`

---

### US-002: Top Stories Section ✅ P0

**En tant que** visiteur  
**Je veux** voir les articles les plus consultés  
**Afin de** découvrir le contenu populaire

**Critères d'acceptance:**
- [x] Affiche 4 articles triés par nombre de vues (DESC)
- [x] Utilise le composant ArticleCard
- [x] Grid responsive: 1 col mobile → 2 col tablet → 4 col desktop
- [x] État de chargement visible pendant le fetch ("Chargement des articles...")
- [x] Titre de section "Top Stories"
- [x] Composant extrait dans `components/article/TopStories.vue` (page index légère)
- [x] Contrôle d'affichage via `isReady` (v-if/v-else)

**Technical notes:**
- API: `GET /api/articles/top-stories?limit=4`
- Store: `articlesStore.fetchTopStories(4)`
- Composant: `components/article/TopStories.vue`
- Fetch SSR-safe via `useAsyncData`

---

### US-003: Articles Store Setup ✅ P0

**En tant que** développeur  
**Je veux** un store unifié pour les articles  
**Afin de** centraliser la gestion des données articles

**Critères d'acceptance:**
- [x] State: `topStories`, `recent`, `popular` (arrays)
- [x] State: `loading` (object avec flags par section)
- [x] Action: `fetchTopStories(limit)`
- [x] Action: `fetchRecentByCategory(category, limit)`
- [x] Action: `fetchPopular(limit)`
- [x] Cache pour éviter re-fetch inutiles (`cached` state + early return)
- [x] TypeScript interfaces définies (`Article`, `Author`, `LoadingState`, `CacheState`)
- [x] Getters utilitaires: `getArticleById`, `getTotalArticles`
- [x] Action `clearCache` pour reset

**Technical notes:**
- Fichier: `stores/articlesStore.ts`
- Pattern: Composition API (comme categoryStore)

---

### US-004: Recent Articles Section ⬜ P1

**En tant que** visiteur  
**Je veux** voir les articles les plus récemment publiés  
**Afin de** découvrir les dernières publications du site

**Description** : Section affichée sur la homepage, juste en dessous de "Top Stories". Affiche les 5 articles les plus récents dans un layout à 2 colonnes (desktop).

#### US-004a: Section Recent Articles (composant parent) ⬜ P1

**En tant que** visiteur  
**Je veux** voir une section "Recent Articles" sur la homepage  
**Afin de** accéder aux dernières publications

**Critères d'acceptance:**
- [ ] Titre de section "Recent Articles"
- [ ] Layout desktop : 2 colonnes (gauche = featured card, droite = grille 2×2 de small cards)
- [ ] Les 2 colonnes ont la même hauteur
- [ ] Affiche les 5 articles les plus récents (triés par `createdAt` DESC)
- [ ] Données récupérées depuis le store via `useAsyncData` (SSR-safe, comme TopStories)
- [ ] État de chargement visible pendant le fetch
- [ ] Composant extrait dans `components/article/RecentArticles.vue`

**Technical notes:**
- API: `GET /api/articles/recent?limit=5`
- Store: `articlesStore.fetchRecent(5)` (ou adaptation de `fetchRecentByCategory`)
- Pattern identique à TopStories : `useAsyncData` → `isReady` → v-if/v-else
- Responsive : 1 colonne en mobile (featured card en haut, puis les 4 small cards empilées)

---

#### US-004b: Featured Article Card (grande card) ⬜ P1

**En tant que** visiteur  
**Je veux** voir l'article le plus récent mis en avant dans une grande card  
**Afin de** identifier rapidement la dernière publication

**Critères d'acceptance:**
- [ ] Occupe la colonne gauche (environ 50% de la largeur desktop)
- [ ] Image principale de l'article en background (couvre toute la card)
- [ ] Badge catégorie en style "pill" (comme les cards TopStories)
- [ ] Titre de l'article en blanc, aligné à gauche, positionné en bas de la card
- [ ] Catégorie positionnée au-dessus du titre, en bas de la card
- [ ] La card fait la même hauteur que la grille 2×2 à droite
- [ ] Au clic → navigation vers `/article/read/:slug`

**Technical notes:**
- Composant: `components/article/FeaturedCard.vue`
- Props: `title`, `slug`, `image`, `category`
- Design : overlay sombre en dégradé sur l'image pour lisibilité du texte blanc
- Pas d'auteur, pas de durée de lecture, pas de nombre de vues, pas de bouton "Read Full Article"

---

#### US-004c: Recent Article Card (petite card) ⬜ P1

**En tant que** visiteur  
**Je veux** voir les articles récents dans des cards compactes  
**Afin de** parcourir rapidement les publications récentes

**Critères d'acceptance:**
- [ ] Affichée dans la colonne droite, grille 2×2 (4 cards)
- [ ] Image principale de l'article
- [ ] Badge catégorie en style "pill"
- [ ] Titre de l'article
- [ ] Design simplifié par rapport à la card TopStories : pas d'auteur, pas de durée de lecture, pas de nombre de vues, pas de bouton "Read Full Article"
- [ ] Au clic → navigation vers `/article/read/:slug`

**Technical notes:**
- Composant: `components/article/RecentCard.vue`
- Props: `title`, `slug`, `image`, `category`
- Design similaire aux ArticleCard TopStories, mais allégé (image + catégorie + titre uniquement)

---

### US-005: Most Popular Section ⬜ P1

**En tant que** visiteur  
**Je veux** voir les articles les plus appréciés  
**Afin de** découvrir le contenu recommandé par la communauté

**Critères d'acceptance:**
- [ ] Affiche 12 articles triés par likes (DESC)
- [ ] Grid responsive: adaptatif selon écran
- [ ] Titre "Most Popular"
- [ ] État de chargement

**Technical notes:**
- API: `GET /api/articles/popular?limit=12`
- Store: `articlesStore.fetchPopular(12)`

---

## Epic 2: Article Detail Page

### US-006: Article Detail Page ⬜ P1

**En tant que** visiteur  
**Je veux** lire un article complet  
**Afin de** consommer le contenu en détail

**Critères d'acceptance:**
- [ ] Route: `/articles/:slug`
- [ ] Affiche titre, image hero, contenu complet
- [ ] Affiche auteur (avatar, nom, bio)
- [ ] Affiche date de publication
- [ ] Affiche temps de lecture
- [ ] Affiche catégorie (lien vers filtre)
- [ ] Meta tags SEO dynamiques
- [ ] Related articles en bas

**Technical notes:**
- Page: `pages/articles/[slug].vue`
- API: `GET /api/articles/:slug` (à créer)

---

## Epic 3: Admin Dashboard

### US-007: Admin Article List ⬜ P2

**En tant qu'** admin  
**Je veux** voir la liste de tous les articles  
**Afin de** gérer le contenu

**Critères d'acceptance:**
- [ ] Tableau avec colonnes: titre, catégorie, auteur, date, status
- [ ] Pagination
- [ ] Recherche par titre
- [ ] Filtres par catégorie, status
- [ ] Actions: edit, delete, publish/unpublish

---

### US-008: Admin Article Editor ⬜ P2

**En tant qu'** admin  
**Je veux** créer/éditer un article  
**Afin de** publier du contenu

**Critères d'acceptance:**
- [ ] Formulaire: titre, slug (auto-généré), catégorie, contenu
- [ ] Éditeur rich text ou Markdown
- [ ] Upload image featured
- [ ] Preview avant publication
- [ ] Sauvegarde brouillon

---

## Epic 4: Search & Navigation

### US-009: Search Functionality ⬜ P2

**En tant que** visiteur  
**Je veux** rechercher des articles  
**Afin de** trouver du contenu spécifique

**Critères d'acceptance:**
- [ ] Barre de recherche dans header
- [ ] Recherche par titre, contenu, auteur
- [ ] Résultats en temps réel (debounce)
- [ ] Page résultats avec filtres

---

## Epic 5: User Engagement

### US-010: Like System ⬜ P3

**En tant que** visiteur connecté  
**Je veux** liker un article  
**Afin d'** exprimer mon appréciation

**Critères d'acceptance:**
- [ ] Bouton like sur article card et page detail
- [ ] Compteur de likes
- [ ] Un like par user par article
- [ ] Feedback visuel (animation)

---

### US-011: Comments System ⬜ P3

**En tant que** visiteur connecté  
**Je veux** commenter un article  
**Afin de** participer à la discussion

**Critères d'acceptance:**
- [ ] Section commentaires sous article
- [ ] Formulaire de commentaire
- [ ] Affichage chronologique
- [ ] Réponses imbriquées (1 niveau)
- [ ] Modération (admin)

---

## Epic 6: Code Quality & Conventions

### US-012: Harmoniser le nommage des composants ⬜ P2

**En tant que** développeur  
**Je veux** que tous les fichiers composants suivent les mêmes conventions de nommage  
**Afin de** garantir la cohérence du codebase et respecter les standards Nuxt

**Critères d'acceptance:**
- [ ] Tous les composants utilisent le format PascalCase (`SectionTitle.vue`, pas `section-title.vue`)
- [ ] Les dossiers de composants sont en kebab-case (convention Nuxt)
- [ ] Les auto-imports Nuxt fonctionnent correctement après renommage
- [ ] Les imports manuels (`import ... from`) sont mis à jour
- [ ] Les références dans les templates (`<text-section-title>` / `<TextSectionTitle>`) sont cohérentes
- [ ] Les tests unitaires existants sont mis à jour si impactés
- [ ] Aucune régression (tous les tests passent)

**Technical notes:**
- Fichiers concernés : `components/text/site-title.vue`, `section-title.vue`, `components/forms/SearchBar.vue`, `components/layout/nav-bar.vue`, `footer.vue`, `components/category-content/carrousel.vue`, `components/article/Card.vue`, `TopStories.vue`
- Convention cible : fichiers en PascalCase, dossiers en kebab-case
- Vérifier l'auto-import Nuxt (`components/article/Card.vue` → `<ArticleCard />`)

---

## Epic 7: Tests

### US-013: Test unitaire — Article Card ✅ P1

**En tant que** développeur  
**Je veux** un script de test unitaire pour le composant Article Card  
**Afin de** valider le rendu visuel et le comportement du composant de manière isolée

**Critères d'acceptance:**
- [x] Vérifie le rendu du titre via la prop `title`
- [x] Vérifie l'affichage du badge catégorie via la prop `category`
- [x] Vérifie l'affichage de l'auteur (nom + avatar)
- [x] Vérifie le formatage des vues (ex: 9000 → "9k")
- [x] Vérifie le temps de lecture affiché
- [x] Vérifie que le lien "Read Full Article" contient le bon slug
- [x] Vérifie le fallback quand `image` ou `authorAvatar` est vide
- [x] Vérifie le `line-clamp-3` sur le titre

**Technical notes:**
- Fichier: `tests/unit/frontend/article-card.test.ts`
- Outils: Vitest + Vue Test Utils
- Monter le composant avec des props mock

---

### US-014: Test unitaire — Top Stories ✅ Done

**En tant que** développeur  
**Je veux** un script de test unitaire pour le composant Top Stories  
**Afin de** valider le chargement conditionnel et l'affichage de la grille d'articles

**Critères d'acceptance:**
- [x] Vérifie l'affichage du message "Chargement des articles..." quand `isReady` est false
- [x] Vérifie l'affichage de la grille de cards quand `isReady` est true
- [x] Vérifie que le bon nombre de `<article-card>` est rendu selon les données du store
- [x] Vérifie que les props sont correctement passées à chaque card
- [x] Vérifie le titre de section "Top Stories"

**Technical notes:**
- Fichier: `tests/unit/frontend/top-stories.test.ts`
- Outils: Vitest + Vue Test Utils
- Nécessite un mock du store Pinia (`articlesStore`)
- Composant async setup (`useAsyncData`) → wrappé dans `<Suspense>` pour les tests
- 9 tests — tous passés ✅

---

### US-015: Test d'intégration — Articles Store ✅ Done

**En tant que** développeur  
**Je veux** un test d'intégration pour le store articles  
**Afin de** valider le cycle complet fetch → state → cache

**Critères d'acceptance:**
- [x] Vérifie que `fetchTopStories` appelle la bonne API et peuple `topStories`
- [x] Vérifie que `fetchRecentByCategory` appelle la bonne API et peuple `recent`
- [x] Vérifie que `fetchPopular` appelle la bonne API et peuple `popular`
- [x] Vérifie que le cache empêche un second fetch pour `topStories`
- [x] Vérifie les flags `loading` (true pendant le fetch, false après)
- [x] Vérifie la gestion d'erreur (API en échec → state inchangé, pas de crash)

**Technical notes:**
- Fichier: `tests/integration/frontend/articles-store.test.ts`
- Outils: Vitest + Pinia testing
- Mock de `$fetch` via `globalThis.$fetch` pour simuler les réponses API
- Tester en isolation sans composant Vue (environnement node)
- Projet Vitest dédié `integration-frontend` avec alias `@/` configuré
- 17 tests (fetchTopStories, fetchRecentByCategory, fetchPopular, clearCache, getters) — tous passés ✅

---

## Sprint actuel: Homepage MVP

**Objectif**: Homepage fonctionnelle avec Top Stories

| Story | Status | Assigné |
|-------|--------|---------|
| US-003: Articles Store | ✅ Done | - |
| US-001: Article Card | ✅ Done | - |
| US-002: Top Stories | ✅ Done | - |
| US-013: Article Card Tests | ✅ Done | - |
| US-014: Top Stories Tests | ✅ Done | - |
| US-015: Store Integration Tests | ✅ Done | - |

---

## Historique

| Date | Action |
|------|--------|
| 2026-02-25 | Création du backlog initial |
| 2026-02-26 | US-001, US-002, US-003 complétés (Sprint Homepage MVP) |
| 2026-02-27 | US-013, US-014, US-015 complétés (Tests unitaires & intégration) |

