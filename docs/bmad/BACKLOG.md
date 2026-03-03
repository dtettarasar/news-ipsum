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
- En mobile, la featured card conserve son design (image background + titre blanc) mais fait la même hauteur que les petites cards

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
- [ ] Desktop : la card fait la même hauteur que la grille 2×2 à droite
- [ ] Mobile : la card fait la même hauteur que les petites cards (layout 1 colonne)
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

## Epic 3: Auth — Migration vers nuxt-auth-utils

### US-016: Migration du système d'authentification vers nuxt-auth-utils ⬜ P2

**En tant que** développeur  
**Je veux** remplacer le système d'authentification maison par le module `nuxt-auth-utils`  
**Afin de** bénéficier d'une solution standard, maintenue par l'écosystème Nuxt, plus fiable et plus simple à maintenir

**Contexte** : Le système actuel (JWT maison, cookie manuel, middleware custom, chiffrement/déchiffrement du sub) a été construit à partir de code issu de projets précédents en JavaScript. Il fonctionne mais présente une complexité élevée et un risque de failles comparé à un module dédié. Le module `nuxt-auth-utils` (https://nuxt.com/modules/auth-utils) fournit des utilitaires serveur et client pour la gestion de session, l'authentification par credentials, et les providers OAuth.

**Critères d'acceptance:**
- [ ] Installation et configuration du module `nuxt-auth-utils` dans `nuxt.config.ts`
- [ ] Remplacement du login admin (`POST /api/auth/admin-login` ou `/api/auth/login`) par le mécanisme de session du module
- [ ] Remplacement de `GET /api/auth/me` par les utilitaires de session du module (`useUserSession`, `getUserSession`)
- [ ] Remplacement de `POST /api/auth/logout` par `clearUserSession` du module
- [ ] Suppression du code maison devenu inutile : `createAuthToken`, `verifyAuthToken`, `getUserByToken`, `createAuthCookie`, `deleteAuthToken` dans `auth.service.ts`
- [ ] Suppression du chiffrement/déchiffrement du `sub` JWT (`cypher.ts`) si plus nécessaire
- [ ] Le middleware `auth.ts` utilise la session du module au lieu de `$fetch('/api/auth/me')`
- [ ] Les rôles (admin, editor, user) restent gérés et vérifiés (hiérarchie conservée)
- [ ] Les pages admin protégées fonctionnent comme avant (redirection si non authentifié ou rôle insuffisant)
- [ ] Le composant `LoginForm.vue` fonctionne avec le nouveau système
- [ ] Les tests existants (auth unitaires + intégration) sont mis à jour ou remplacés
- [ ] Aucune régression sur les fonctionnalités existantes

**Technical notes:**
- Module: `nuxt-auth-utils` — https://nuxt.com/modules/auth-utils
- À installer : `npx nuxi module add auth-utils`
- Côté serveur : `setUserSession(event, { user })`, `getUserSession(event)`, `clearUserSession(event)`
- Côté client : `useUserSession()` composable (remplace le fetch manuel de `/api/auth/me`)
- Fichiers impactés : `server/utils/auth.service.ts`, `server/api/auth/*.ts`, `middleware/auth.ts`, `components/admin/LoginForm.vue`, `server/utils/cypher.ts`
- Prérequis : à implémenter **avant** les US du dashboard admin (US-007, US-008)
- Le script `create-admin.ts` reste nécessaire (création du premier admin en base)

---

### US-018: Inscription utilisateur (lecteur) ⬜ P2

**En tant que** visiteur
**Je veux** créer un compte lecteur sur le site
**Afin de** pouvoir commenter des articles et accéder aux fonctionnalités réservées aux membres

**Contexte** : Le formulaire de connexion actuel est réservé aux rôles administratifs (admin, editor). Il faut un système d'inscription publique permettant aux visiteurs de créer un compte avec le rôle "user" (lecteur). Ce compte servira de base pour les fonctionnalités d'engagement (commentaires, likes) et, à terme, pour des fonctionnalités avancées (abonnements, contenu premium).

**Critères d'acceptance:**
- [ ] Page d'inscription publique accessible depuis le header
- [ ] Formulaire : nom, email, mot de passe, confirmation mot de passe
- [ ] Validation côté client (email valide, mot de passe min 8 caractères, confirmation identique)
- [ ] Validation côté serveur (email unique, sanitisation des inputs)
- [ ] Création du compte avec le rôle `user` (lecteur) par défaut
- [ ] Connexion automatique après inscription réussie
- [ ] Message d'erreur si l'email est déjà utilisé
- [ ] Redirection vers la page d'origine après inscription

**Technical notes:**
- Page : `pages/auth/register.vue`
- API : `POST /api/auth/register` (à créer)
- Utilise `nuxt-auth-utils` pour la session (dépend de US-016)
- Hashage du mot de passe côté serveur (bcrypt)
- Prérequis : US-016 (migration auth)

---

### US-019: Récupération de mot de passe ⬜ P3

**En tant que** utilisateur enregistré
**Je veux** pouvoir réinitialiser mon mot de passe si je l'ai oublié
**Afin de** récupérer l'accès à mon compte

**Critères d'acceptance:**
- [ ] Lien "Mot de passe oublié" sur la page de connexion
- [ ] Formulaire de saisie de l'email
- [ ] Envoi d'un email avec un lien de réinitialisation (token temporaire)
- [ ] Page de réinitialisation : nouveau mot de passe + confirmation
- [ ] Le token expire après un délai (ex: 1h)
- [ ] Message de confirmation après réinitialisation réussie
- [ ] Redirige vers la page de connexion

**Technical notes:**
- Pages : `pages/auth/forgot-password.vue`, `pages/auth/reset-password.vue`
- API : `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- Token stocké en base avec expiration
- Service d'envoi d'email à configurer (ex: Resend, Nodemailer)
- Prérequis : US-016, US-018

---

## Epic 4: Admin Dashboard

### US-017: Intégration de Nuxt UI pour l'interface d'administration ⬜ P2

**En tant que** développeur  
**Je veux** remplacer PreBuilt UI par Nuxt UI pour l'interface d'administration  
**Afin de** bénéficier d'une librairie de composants standard, maintenue par l'écosystème Nuxt, cohérente avec le reste du stack

**Contexte** : L'interface admin actuelle utilise des composants de PreBuilt UI (https://prebuiltui.com). Nuxt UI (https://ui.nuxt.com/) offre une librairie complète de composants (formulaires, tableaux, modals, notifications, etc.) intégrée nativement à Nuxt, avec support TypeScript, theming, et accessibilité. La migration vers Nuxt UI permettra de construire le dashboard admin plus rapidement et de manière plus maintenable.

**Critères d'acceptance:**
- [ ] Installation et configuration de Nuxt UI dans `nuxt.config.ts`
- [ ] Migration du `LoginForm.vue` : remplacement des composants PreBuilt UI par les équivalents Nuxt UI (UInput, UButton, UForm, etc.)
- [ ] Suppression des dépendances PreBuilt UI du `package.json`
- [ ] Le formulaire de login fonctionne comme avant (soumission, affichage erreur, redirection)
- [ ] Les pages admin existantes utilisent Nuxt UI
- [ ] Base de composants Nuxt UI prête pour la construction du dashboard (US-007, US-008)
- [ ] Aucune régression sur les fonctionnalités existantes

**Technical notes:**
- Librairie: Nuxt UI — https://ui.nuxt.com/
- À installer : `npx nuxi module add ui`
- Composants clés : `UForm`, `UInput`, `UButton`, `UTable`, `UModal`, `UNotification`
- Fichiers impactés initialement : `components/admin/LoginForm.vue`, pages admin
- Prérequis : à implémenter **avant** ou **en parallèle** des US du dashboard admin (US-007, US-008)
- Nuxt UI inclut son propre système de theming (compatible Tailwind) — vérifier la cohérence avec le CSS existant du site public

---

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

### US-020: Système de Tags ⬜ P2

**En tant qu'** admin
**Je veux** gérer des tags sur les articles
**Afin de** permettre une classification fine du contenu, complémentaire aux catégories

**Contexte** : Le cahier des charges mentionne l'affichage des articles par "catégories et tags". Les catégories sont déjà implémentées (CRUD + carrousel). Les tags apportent une granularité supplémentaire (un article peut avoir plusieurs tags transversaux, indépendants de sa catégorie).

**Critères d'acceptance:**
- [ ] Modèle `Tag` en base (nom, slug)
- [ ] API CRUD pour les tags (`/api/tags`)
- [ ] Champ `tags` (array de références) ajouté au modèle Article
- [ ] Interface admin pour gérer les tags (ajout, modification, suppression)
- [ ] Sélection de tags lors de la création/édition d'un article (multi-select)
- [ ] Affichage des tags sur la page détail d'un article
- [ ] Recherche/filtre par tag côté frontend

**Technical notes:**
- Modèle Mongoose : `Tag { name, slug, createdAt }`
- Relation many-to-many : `Article.tags: [ObjectId]` → ref Tag
- API : `GET/POST/PUT/DELETE /api/tags`
- Composant admin : intégré au formulaire d'édition d'article (US-008)
- Affichage frontend : badges cliquables sur la page article (US-006)

---

### US-021: Admin — Gestion des utilisateurs ⬜ P2

**En tant qu'** admin
**Je veux** voir et gérer les comptes utilisateurs
**Afin de** contrôler les accès et les rôles sur la plateforme

**Critères d'acceptance:**
- [ ] Page admin listant tous les utilisateurs (tableau)
- [ ] Colonnes : nom, email, rôle, date d'inscription, statut
- [ ] Pagination et recherche par nom/email
- [ ] Modification du rôle d'un utilisateur (user → editor, editor → admin, etc.)
- [ ] Désactivation/suppression d'un compte
- [ ] Seul un admin peut accéder à cette page

**Technical notes:**
- Page : `pages/admin/users.vue`
- API : `GET /api/admin/users`, `PUT /api/admin/users/:id`, `DELETE /api/admin/users/:id`
- Middleware : vérification rôle admin
- Utilise les composants Nuxt UI (UTable, UModal) — dépend de US-017

---

## Epic 5: Search & Navigation

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

## Epic 6: User Engagement

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

**En tant que** utilisateur connecté (lecteur, editor ou admin)  
**Je veux** commenter un article  
**Afin de** participer à la discussion

**Contexte** : Nécessite que les visiteurs puissent créer un compte (US-018) pour s'authentifier avant de commenter.

**Critères d'acceptance:**
- [ ] Section commentaires sous article (page détail US-006)
- [ ] Formulaire de commentaire (visible uniquement si connecté)
- [ ] Message invitant à se connecter/s'inscrire si visiteur non authentifié
- [ ] Affichage chronologique
- [ ] Réponses imbriquées (1 niveau)
- [ ] Modération par admin (ajout, modification, suppression)
- [ ] Notification à l'auteur de l'article quand un nouveau commentaire est posté (optionnel)

**Technical notes:**
- Prérequis : US-006 (page détail), US-018 (inscription lecteur)

---

## Epic 7: Code Quality & Conventions

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

## Epic 8: Tests

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

## Epic 9: Évolutions futures (hors scope formation)

> Les fonctionnalités ci-dessous sont identifiées comme des évolutions potentielles de la plateforme, mais **ne font pas partie du périmètre de la formation Ilaria Digital School**. Elles sont documentées ici pour anticiper l'architecture et faciliter leur implémentation future.

### US-F01: Abonnements et contenu premium ⬜ Future

**En tant que** lecteur  
**Je veux** souscrire à un abonnement  
**Afin d'** accéder à des contenus exclusifs ou premium

**Périmètre envisagé :**
- Système d'abonnement (gratuit / premium)
- Contenus réservés aux abonnés (articles payants, accès anticipé)
- Achat de contenu à la carte
- Intégration paiement (Stripe ou équivalent)

---

### US-F02: Événementiel ⬜ Future

**En tant que** visiteur  
**Je veux** consulter et m'inscrire à des événements  
**Afin de** participer aux activités proposées par le média

**Périmètre envisagé :**
- Pages de présentation d'événements
- Système d'inscription en ligne
- Gestion admin des événements (CRUD)
- Rappels / notifications

---

### US-F03: VOD / Contenu vidéo ⬜ Future

**En tant que** visiteur  
**Je veux** regarder du contenu vidéo  
**Afin de** consommer du contenu multimédia proposé par le média

**Périmètre envisagé :**
- Player vidéo intégré
- Catalogue VOD avec catégorisation
- Contenu vidéo gratuit et/ou premium
- Hébergement vidéo (externe type Vimeo/YouTube ou self-hosted)

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

