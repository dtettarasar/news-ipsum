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

### US-004: Recent Articles Section ✅ P1

**En tant que** visiteur  
**Je veux** voir les articles les plus récemment publiés  
**Afin de** découvrir les dernières publications du site

**Description** : Section affichée sur la homepage, juste en dessous de "Top Stories". Affiche les 5 articles les plus récents dans un layout à 2 colonnes (desktop).

#### US-004a: Section Recent Articles (composant parent) ✅ P1

**En tant que** visiteur  
**Je veux** voir une section "Recent Articles" sur la homepage  
**Afin de** accéder aux dernières publications

**Critères d'acceptance:**
- [x] Titre de section "Recent Articles"
- [x] Layout desktop : 2 colonnes (gauche = featured card, droite = grille 2×2 de small cards)
- [x] Les 2 colonnes ont la même hauteur
- [x] Affiche les 5 articles les plus récents (triés par `createdAt` DESC)
- [x] Données récupérées depuis le store via `useAsyncData` (SSR-safe, comme TopStories)
- [x] État de chargement visible pendant le fetch
- [x] Composant extrait dans `components/article/Recent.vue`

**Technical notes:**
- API: `GET /api/articles/recent?limit=5`
- Store: `articlesStore.fetchRecent(5)`
- Pattern identique à TopStories : `useAsyncData` → `isReady` → v-if/v-else
- Responsive : 1 colonne en mobile (featured card en haut, puis les 4 small cards empilées)
- En mobile, la featured card conserve son design (image background + titre blanc) et les small cards passent en 1 colonne

---

#### US-004b: Featured Article Card (grande card) ✅ P1

**En tant que** visiteur  
**Je veux** voir l'article le plus récent mis en avant dans une grande card  
**Afin de** identifier rapidement la dernière publication

**Critères d'acceptance:**
- [x] Occupe la colonne gauche (environ 50% de la largeur desktop)
- [x] Image principale de l'article en background (couvre toute la card)
- [x] Badge catégorie en style "pill" (comme les cards TopStories)
- [x] Titre de l'article en blanc, aligné à gauche, positionné en bas de la card
- [x] Catégorie positionnée au-dessus du titre, en bas de la card
- [x] Desktop : la card fait la même hauteur que la grille 2×2 à droite
- [x] Mobile : la card fait la même hauteur que les petites cards (layout 1 colonne)
- [x] Au clic → navigation vers `/article/read/:slug`

**Technical notes:**
- Composant: `components/article/FeaturedCard.vue`
- Props: `title`, `slug`, `image`, `category`
- Design : overlay sombre en dégradé sur l'image pour lisibilité du texte blanc
- Pas d'auteur, pas de durée de lecture, pas de nombre de vues, pas de bouton "Read Full Article"
- Hover néo-brutaliste : `translate(-3px, -3px)` + `box-shadow: 3px 3px 0px #000`
- Overlay dégradé sombre (`from-black/80 via-black/30 to-transparent`) pour lisibilité du texte blanc
- Tailles de texte responsive : pill `text-sm md:text-base lg:text-lg`, titre `text-lg md:text-2xl lg:text-3xl`

---

#### US-004c: Recent Article Card (petite card) ✅ P1

**En tant que** visiteur  
**Je veux** voir les articles récents dans des cards compactes  
**Afin de** parcourir rapidement les publications récentes

**Critères d'acceptance:**
- [x] Affichée dans la colonne droite, grille 2×2 (4 cards)
- [x] Image principale de l'article
- [x] Badge catégorie en style "pill"
- [x] Titre de l'article
- [x] Design simplifié par rapport à la card TopStories : pas d'auteur, pas de durée de lecture, pas de nombre de vues, pas de bouton "Read Full Article"
- [x] Au clic → navigation vers `/article/read/:slug`

**Technical notes:**
- Composant: `components/article/RecentCard.vue`
- Props: `title`, `slug`, `image`, `category`
- Design similaire aux ArticleCard TopStories, mais allégé (image + catégorie + titre uniquement)
- Hover néo-brutaliste : `translate(-3px, -3px)` + `box-shadow: 3px 3px 0px #000`
- Couleurs de fond aléatoires SSR-safe via `useState` (même pattern que Card.vue)
- Tailles de texte responsive : pill `text-xs md:text-sm`, titre `text-sm md:text-base lg:text-lg`

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

### US-006: Top Video Section ⬜ P1

**En tant que** visiteur
**Je veux** voir les vidéos ayant le plus de vues
**Afin de** découvrir le contenu vidéo le plus consulté sur le site

**Description** : Section affichée sur la homepage, juste en dessous de "Recent Articles". Affiche les 5 vidéos les plus vues dans un layout à 2 colonnes (desktop), similaire à la section Recent Articles (US-004), avec des variations de design propres au contenu vidéo.

#### US-006a: Section Top Video (composant parent) ⬜ P1

**En tant que** visiteur
**Je veux** voir une section "Top Video" sur la homepage
**Afin de** accéder aux vidéos les plus populaires

**Critères d'acceptance:**
- [ ] Titre de section "Top Video"
- [ ] Layout desktop : 2 colonnes (gauche = featured video card, droite = grille 2×2 de small video cards)
- [ ] Les 2 colonnes ont la même hauteur
- [ ] Affiche les 5 vidéos les plus vues (triées par `views` DESC)
- [ ] Données récupérées depuis le store via `useAsyncData` (SSR-safe)
- [ ] État de chargement visible pendant le fetch
- [ ] Composant extrait dans `components/video/TopVideo.vue`

**Technical notes:**
- API: `GET /api/videos/popular?limit=5`
- Store: `videosStore.fetchTopVideos(5)` (nouveau store dédié)
- Pattern identique à `Recent.vue` : `useAsyncData` → `isReady` → v-if/v-else
- Responsive : 1 colonne en mobile (featured video card en haut, puis les 4 small cards empilées)

---

#### US-006b: Featured Video Card (grande card) ⬜ P1

**En tant que** visiteur
**Je veux** voir la vidéo la plus vue mise en avant dans une grande card
**Afin de** identifier rapidement la vidéo la plus populaire

**Critères d'acceptance:**
- [ ] Occupe la colonne gauche (∼60% de la largeur desktop)
- [ ] Colonne droite (SmallVideoCards) : ∼40% de la largeur desktop
- [ ] Mobile : la card prend 100% de la largeur, la colonne droite se place en dessous
- [ ] Thumbnail de la vidéo en background (couvre toute la card)
- [ ] Icône play clairement visible et centrée sur la card
- [ ] Badge catégorie en style "pill"
- [ ] Titre de la vidéo en blanc, positionné en bas de la card
- [ ] Sous le titre : nom de l'auteur | (icône horloge) durée | (icône œil) nombre de vues
- [ ] Séparateurs verticaux entre chaque info (même design que les cards TopStories)
- [ ] Nombre de vues formaté (`9000` → `9k`)
- [ ] Desktop : la card fait la même hauteur que la grille 2×2 à droite
- [ ] Mobile : la card prend toute la largeur (hauteur adaptée)
- [ ] Au clic → navigation vers la page de la vidéo (`/video/watch/:slug`)

**Technical notes:**
- Composant: `components/video/FeaturedVideoCard.vue`
- Props: `title`, `slug`, `thumbnail`, `category`, `authorName`, `duration`, `views`
- Design similaire à `FeaturedCard.vue` : overlay sombre en dégradé, hover néo-brutaliste
- Layout desktop : CSS `grid-cols` ou `flex` avec `basis-[60%]` / `basis-[40%]` sur le parent `TopVideo.vue`
- Barre d'infos (auteur + durée + vues) : même pattern que `Card.vue` TopStories (séparateurs `|`, icônes SVG inline ou icon library)
- `duration` : string formaté côté mock data (ex: `"4:32"`) — voir note backend (section "Notes techniques à explorer")
- `views` : nombre entier, formaté en `k` via un helper (même utilitaire que `Card.vue`)
- Overlay dégradé sombre pour lisibilité du texte blanc

---

#### US-006c: Small Video Card (petite card) ⬜ P1

**En tant que** visiteur
**Je veux** voir les vidéos populaires dans des cards compactes
**Afin de** parcourir rapidement le contenu vidéo populaire

**Critères d'acceptance:**
- [ ] Affichée dans la colonne droite, grille 2×2 (4 cards)
- [ ] Thumbnail de la vidéo
- [ ] Icône play visible
- [ ] Badge catégorie en style "pill"
- [ ] Titre de la vidéo
- [ ] Durée de la vidéo affichée
- [ ] Au clic → navigation vers la page de la vidéo (`/video/watch/:slug`)

**Technical notes:**
- Composant: `components/video/SmallVideoCard.vue`
- Props: `title`, `slug`, `thumbnail`, `category`, `duration`
- Design similaire à `RecentCard.vue` mais adapté au contenu vidéo (icône play, durée)
- Hover néo-brutaliste identique aux autres cards
- Couleurs de fond aléatoires SSR-safe via `useState` (même pattern que Card.vue et RecentCard.vue)

---

#### US-006d: Mock data — Vidéos ⬜ P1

**En tant que** développeur
**Je veux** avoir des données de vidéos simulées
**Afin de** développer et tester la section Top Video sans backend réel

**Critères d'acceptance:**
- [ ] Interface TypeScript `Video` définie (`title`, `slug`, `thumbnail`, `category`, `views`, `duration`, `url`)
- [ ] Au moins 10 vidéos mock avec des données réalistes
- [ ] Les vidéos couvrent plusieurs catégories
- [ ] Les thumbnails utilisent des URLs de ressources libres de droits
- [ ] Données intégrées dans `server/database/site-content.ts`

**Note sur les ressources vidéo libres de droits :**
Pour les thumbnails et les URLs de vidéos, plusieurs plateformes offrent du contenu libre de droits exploitable pour le développement frontend (équivalent vidéo d'Unsplash) :
- **Pexels** (https://www.pexels.com/videos/) — vidéos HD libres de droits, API disponible, pas d'inscription requise pour les embeds
- **Pixabay** (https://pixabay.com/videos/) — similaire à Pexels, large catalogue
- **Coverr** (https://coverr.co/) — vidéos de lifestyle de qualité, sans inscription requise

---

#### US-006e: API route & Store — Vidéos ⬜ P1

**En tant que** développeur
**Je veux** une route API et un store Pinia pour les vidéos populaires
**Afin de** alimenter les composants frontend en données

**Critères d'acceptance:**
- [ ] Route API `GET /api/videos/popular?limit=5` retournant les vidéos triées par vues (DESC)
- [ ] Store Pinia `videosStore` avec action `fetchTopVideos(limit)`
- [ ] State: `topVideos` (array), `loading` (flag), `cached.topVideos` (boolean)
- [ ] Cache pour éviter les re-fetch inutiles (`cached` state + early return)
- [ ] Flag `loading` (true pendant le fetch, false après)
- [ ] TypeScript interfaces définies (`Video`)
- [ ] Action `clearCache` pour reset

**Technical notes:**
- Fichier API: `server/api/videos/popular.get.ts`
- Store: `stores/videosStore.ts`
- Pattern identique à `articlesStore.ts` (Composition API)
- Données issues de `site-content.ts` (mock), même pattern que les articles

---

#### US-006f: Tests — Top Video Section ⬜ P1

**En tant que** développeur
**Je veux** des tests unitaires et d'intégration pour la section Top Video
**Afin de** garantir la fiabilité des composants et du store

**Critères d'acceptance:**
- [ ] Tests unitaires `FeaturedVideoCard.vue` : rendu titre, badge catégorie, thumbnail background, icône play, durée, vues, href
- [ ] Tests unitaires `SmallVideoCard.vue` : rendu titre, badge catégorie, thumbnail, icône play, durée, href
- [ ] Tests unitaires `TopVideo.vue` : titre de section, état de chargement, featured card = vidéo 1, 4 small cards = vidéos 2-5, `fetchTopVideos` appelé au mount
- [ ] Tests d'intégration `fetchTopVideos` : endpoint correct, limit, flag loading, cache, gestion erreur, clearCache

**Technical notes:**
- Fichiers tests : `tests/unit/frontend/featured-video-card.test.ts`, `tests/unit/frontend/small-video-card.test.ts`, `tests/unit/frontend/top-video.test.ts`
- Test store : `tests/integration/frontend/videos-store.test.ts`
- Patterns identiques aux tests US-004 (Suspense wrapper pour async setup, dual stubs kebab/PascalCase)

---

## Epic 2: Article Detail Page

### US-034: Article Detail Page ⬜ P1

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
- Affichage frontend : badges cliquables sur la page article (US-034)

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
- [ ] Section commentaires sous article (page détail US-034)
- [ ] Formulaire de commentaire (visible uniquement si connecté)
- [ ] Message invitant à se connecter/s'inscrire si visiteur non authentifié
- [ ] Affichage chronologique
- [ ] Réponses imbriquées (1 niveau)
- [ ] Modération par admin (ajout, modification, suppression)
- [ ] Notification à l'auteur de l'article quand un nouveau commentaire est posté (optionnel)

**Technical notes:**
- Prérequis : US-034 (page détail), US-018 (inscription lecteur)

---

### US-023: Inscription Newsletter ⬜ P2

**En tant que** visiteur (avec ou sans compte)  
**Je veux** m'inscrire à la newsletter du site  
**Afin de** recevoir par email les dernières actualités et publications

**Contexte** : Les maquettes incluent un composant d'inscription à la newsletter sur la homepage — fonctionnalité non mentionnée dans le cahier des charges Ilaria (voir section "Points à clarifier"). Deux scénarios d'inscription doivent être gérés : visiteurs anonymes (email seul) et utilisateurs connectés (lié au compte).

**Critères d'acceptance:**

_Inscription sans compte :_
- [ ] Composant formulaire visible sur la homepage (champ email + bouton)
- [ ] Validation de l'email côté client et serveur
- [ ] Message de confirmation après inscription
- [ ] Stockage de l'email en base (collection dédiée ou modèle `NewsletterSubscriber`)
- [ ] Lien de désinscription fonctionnel dans chaque email de newsletter reçu

_Inscription avec compte :_
- [ ] L'utilisateur connecté peut s'inscrire depuis le même composant (email pré-rempli)
- [ ] L'inscription est liée à son compte utilisateur (référence `userId`)
- [ ] Gestion de l'inscription/désinscription depuis les réglages du compte (US-024)
- [ ] Le lien de désinscription dans les emails fonctionne également

_Gestion des données :_
- [ ] Gestion en base des deux types d'abonnés (avec et sans compte) — architecture à définir
- [ ] Pas de doublon : si un visiteur inscrit sans compte crée ensuite un compte avec le même email, les entrées doivent être fusionnées
- [ ] Conformité RGPD : consentement explicite, possibilité de désinscription à tout moment

**Technical notes:**
- Composant : `components/newsletter/SubscribeForm.vue`
- API : `POST /api/newsletter/subscribe`, `POST /api/newsletter/unsubscribe`
- Modèle possible : `NewsletterSubscriber { email, userId? (ref User), subscribedAt, active, unsubscribeToken }`
- Alternative : champ `newsletterSubscribed: Boolean` sur le modèle User + collection séparée pour les abonnés sans compte
- Architecture de données à affiner (à explorer ensemble)
- Service d'envoi d'email nécessaire (même infra que US-019 récupération mdp)

---

### US-024: Page réglages du compte utilisateur ⬜ P3

**En tant que** utilisateur connecté  
**Je veux** accéder à une page de réglages de mon compte  
**Afin de** gérer mes préférences, mon profil et mes abonnements

**Contexte** : Cette page centralisera les paramètres utilisateur. Initialement focalisée sur le profil et la newsletter, elle sera enrichie au fil du temps avec de nouvelles fonctionnalités.

**Critères d'acceptance:**

_V1 (scope formation) :_
- [ ] Page accessible depuis le menu utilisateur (header)
- [ ] Section profil : modifier nom, avatar, bio
- [ ] Section newsletter : activer/désactiver l'inscription
- [ ] Section commentaires : voir et gérer ses commentaires postés
- [ ] Section sécurité : changer son mot de passe

_Évolutions futures (hors scope) :_
- Articles sauvegardés / favoris
- Gestion d'un abonnement premium
- Historique des contenus achetés à la carte

**Technical notes:**
- Page : `pages/account/settings.vue`
- API : `GET/PUT /api/account/settings`, `GET /api/account/comments`
- Middleware : authentification requise
- Prérequis : US-018 (inscription), US-016 (auth migration)

---

### US-025: Widget Météo (sidebar page article) ⬜ P3

**En tant que** visiteur  
**Je veux** voir la météo actuelle dans la sidebar de la page article  
**Afin de** consulter rapidement les conditions météorologiques locales

**Contexte** : Les maquettes de la page article incluent un widget météo dans la sidebar. Cette fonctionnalité n'est **pas mentionnée dans le cahier des charges** Ilaria (voir section "Points à clarifier"). Ce n'est pas une fonctionnalité principale du site, mais un élément d'enrichissement de l'expérience utilisateur.

**Critères d'acceptance:**
- [ ] Widget affiché dans la sidebar de la page article
- [ ] Affiche les conditions météo actuelles : température, icône météo, description, localité
- [ ] Géolocalisation de l'utilisateur via l'API Geolocation du navigateur
- [ ] Requête vers une API météo externe avec les coordonnées obtenues
- [ ] **Cas de refus géolocalisation** : comportement de fallback à définir (masquer le widget, ou afficher la météo d'un lieu par défaut, ex: Paris)
- [ ] Gestion des erreurs (API indisponible, timeout) : le widget ne doit pas bloquer le chargement de la page
- [ ] Données météo cachées côté client pour éviter les appels API répétés (ex: durée de cache 30 min ou 1h)
- [ ] L'autorisation de géolocalisation ne doit pas être redemandée à chaque article — exploiter la persistance du navigateur (permission API) et/ou stocker les coordonnées en `localStorage`/`sessionStorage`
- [ ] Stratégie de cache : stocker localement les dernières données météo + timestamp, ne re-fetch que si les données sont expirées

**Technical notes:**
- Composant : `components/widgets/WeatherWidget.vue`
- API géolocalisation : `navigator.geolocation.getCurrentPosition()` (côté client uniquement). Note : le navigateur gère la persistance de la permission (grant/deny) par domaine — une fois accordée, il ne repropose pas la popup. Mais les coordonnées ne sont pas conservées entre les pages → les stocker dans `localStorage` avec un TTL.
- Stratégie de performance recommandée :
  1. Vérifier `localStorage` pour des coordonnées récentes (< 1h)
  2. Si absent/expiré → appel `getCurrentPosition()`
  3. Vérifier `localStorage` pour des données météo récentes (< 30 min)
  4. Si absent/expiré → appel API météo via proxy Nitro
  5. Stocker le résultat avec timestamp
- API météo à explorer : OpenWeatherMap (gratuit, clé API requise), WeatherAPI, Open-Meteo (gratuit sans clé)
- Proxy des appels API météo via le serveur Nitro (évite d'exposer la clé API côté client)
- Chargement lazy / client-only (`<ClientOnly>`) car dépend de la géolocalisation navigateur
- Non bloquant : le widget se charge indépendamment du contenu article

---

## Epic 10: Contact Page

### US-026: Page Contact (layout) ⬜ P2

**En tant que** visiteur  
**Je veux** accéder à une page de contact  
**Afin de** pouvoir contacter l'équipe du site par différents moyens

**Contexte** : Les maquettes présentent une page contact complète avec plusieurs composants : formulaire de contact, FAQ, localisation (map), appel téléphonique, live chat et inscription newsletter. Cette US décrit le layout parent de la page.

**Critères d'acceptance:**
- [ ] Page accessible depuis la navigation principale
- [ ] Route : `/contact`
- [ ] Layout organisant les différents composants de la page (formulaire, FAQ, map, etc.)
- [ ] Responsive : adaptation mobile/desktop
- [ ] Meta tags SEO

**Technical notes:**
- Page : `pages/contact.vue`
- Composants enfants : US-027 à US-030 + composant newsletter (US-023, réutilisé)

---

### US-027: Formulaire de contact ⬜ P2

**En tant que** visiteur  
**Je veux** envoyer un message à l'équipe du site via un formulaire  
**Afin de** poser une question ou signaler un problème

**Critères d'acceptance:**
- [ ] Champs : nom, email, sujet, message
- [ ] Validation côté client (champs requis, email valide)
- [ ] Validation côté serveur (sanitisation des inputs)
- [ ] Message de confirmation après envoi réussi
- [ ] Gestion des erreurs (affichage message d'erreur)
- [ ] Protection anti-spam (à définir : honeypot, rate limiting, ou captcha)

**Technical notes:**
- Composant : `components/contact/ContactForm.vue`
- API : `POST /api/contact` (envoi d'email ou stockage en base)
- Service d'email nécessaire (même infra que US-019 et US-023)

---

### US-028: FAQ Accordéon ⬜ P2

**En tant que** visiteur  
**Je veux** consulter les questions fréquentes sur la page contact  
**Afin de** trouver rapidement une réponse sans contacter l'équipe

**Critères d'acceptance:**
- [ ] Composant accordéon (expand/collapse)
- [ ] Chaque item : question (titre cliquable) + réponse (contenu dépliable)
- [ ] Un seul item ouvert à la fois (ou plusieurs, à définir)
- [ ] Animation fluide à l'ouverture/fermeture
- [ ] Accessibilité : navigation clavier, `aria-expanded`, `aria-controls`, rôle `button`
- [ ] Données FAQ : statiques (hardcodées ou fichier de contenu) ou dynamiques (API admin)

**Technical notes:**
- Composant : `components/contact/FaqAccordion.vue`
- Données : initialement hardcodées dans un fichier de contenu (type `site-content.ts`), avec possibilité d'évolution vers un CRUD admin
- Accessibilité : pattern WAI-ARIA Accordion

---

### US-029: Widget localisation (Google Maps) ⬜ P3

**En tant que** visiteur  
**Je veux** voir l'emplacement des bureaux du site sur une carte  
**Afin de** localiser physiquement l'équipe

**Critères d'acceptance:**
- [ ] Intégration d'une carte interactive (Google Maps ou alternative)
- [ ] Marqueur positionné sur l'adresse des bureaux
- [ ] Adresse affichée en texte à côté ou en dessous de la carte
- [ ] Responsive : carte adaptée aux différentes tailles d'écran
- [ ] Fallback si la carte ne charge pas (affichage de l'adresse seule)

**Technical notes:**
- Composant : `components/contact/LocationMap.vue`
- Options d'intégration : iframe Google Maps embed (gratuit, sans clé API), Google Maps JS API (clé requise), ou alternative open-source (Leaflet + OpenStreetMap)
- Chargement lazy (`<ClientOnly>` + intersection observer ou `loading="lazy"` sur iframe)
- L'adresse sera configurable (variable d'environnement ou fichier de contenu)

---

### US-030: Bouton appel téléphonique ⬜ P3

**En tant que** visiteur  
**Je veux** lancer un appel téléphonique depuis la page contact  
**Afin de** contacter directement l'équipe par téléphone

**Critères d'acceptance:**
- [ ] Composant affichant le numéro de téléphone et un bouton d'appel
- [ ] Lien `tel:` fonctionnel (ouvre l'app téléphone sur mobile, Skype/Teams/etc. sur desktop)
- [ ] Numéro formaté lisiblement
- [ ] Icône téléphone + label accessible
- [ ] Horaires de disponibilité affichés (optionnel)

**Technical notes:**
- Composant : `components/contact/PhoneCall.vue`
- Simple lien `<a href="tel:+33XXXXXXXXX">` — implémentation légère
- Numéro configurable (fichier de contenu ou variable d'environnement)

---

## Epic 11: About Page

### US-031: Page About (contenu éditorial) ⬜ P2

**En tant que** visiteur  
**Je veux** consulter la page À propos du site  
**Afin de** découvrir l'histoire, la mission et l'équipe derrière le média

**Contexte** : Les maquettes présentent une page About avec 4 sections de contenu éditorial. Le contenu sera initialement hardcodé puis éditable depuis l'interface admin.

**Critères d'acceptance:**
- [ ] Page accessible depuis la navigation principale
- [ ] Route : `/about`
- [ ] Meta tags SEO
- [ ] Responsive : adaptation mobile/desktop

_Section 1 — "Our Story" :_
- [ ] Layout 2 colonnes : texte à gauche, image à droite
- [ ] Mobile : empilé (image puis texte, ou inverse)

_Section 2 — "The Professional Business Platform" :_
- [ ] Layout 2 colonnes : image à gauche, texte à droite
- [ ] Mobile : empilé

_Section 3 — "Our Growing News Network" :_
- [ ] Layout 2 colonnes : texte à gauche, image à droite
- [ ] Mobile : empilé

_Section 4 — "Meet Our Team" :_
- [ ] Grille de cartes présentant les membres de l'équipe
- [ ] Par carte : photo, prénom + nom, titre/rôle, liens réseaux sociaux
- [ ] Responsive : adapté selon le nombre de membres

**Technical notes:**
- Page : `pages/about.vue`
- Composants possibles : `components/about/TeamMemberCard.vue` (carte équipe), sections réutilisables texte+image
- Données initialement hardcodées (fichier `site-content.ts` ou directement dans le template)
- Les sections texte+image suivent un pattern alterné (image droite / image gauche) — envisager un composant générique `ContentSection.vue` avec une prop `imagePosition: 'left' | 'right'`

---

### US-032: Admin — Édition du contenu des pages statiques ⬜ P3

**En tant qu'** admin  
**Je veux** éditer le contenu des pages statiques (About, Contact FAQ) depuis l'interface admin  
**Afin de** mettre à jour le contenu éditorial sans toucher au code

**Critères d'acceptance:**
- [ ] Interface admin pour éditer les textes des sections de la page About
- [ ] Interface admin pour gérer les membres de l'équipe (CRUD : ajouter, modifier, supprimer, réordonner)
- [ ] Upload/modification des images des sections
- [ ] Interface admin pour gérer les entrées FAQ de la page Contact (CRUD)
- [ ] Preview des modifications avant publication
- [ ] Les pages frontend affichent le contenu depuis la base de données au lieu du hardcodé

**Technical notes:**
- Modèles Mongoose possibles :
  - `PageContent { pageSlug, sectionKey, title, body, image, order }` (contenu générique)
  - `TeamMember { name, title, photo, socialLinks: { twitter?, linkedin?, instagram? }, order }`
  - `FaqEntry { question, answer, order }` (utilisé par US-028)
- API : `GET/PUT /api/admin/pages/:slug`, `GET/POST/PUT/DELETE /api/admin/team-members`, `GET/POST/PUT/DELETE /api/admin/faq`
- Dépend de : US-017 (Nuxt UI), US-031 (page About), US-028 (FAQ)
- À détailler davantage lors de la phase d'implémentation admin

---

## Epic 7: Code Quality & Conventions

### US-033: Script de génération de secrets exécutable hors conteneur ⬜ P3

**En tant que** développeur  
**Je veux** pouvoir générer les secrets cryptographiques avant de lancer les conteneurs Docker  
**Afin de** pouvoir initialiser le fichier `.env` correctement lors d'un premier déploiement sur une nouvelle machine

**Contexte** : Le script actuel `nuxt-app/scripts/generate-secrets.ts` est conçu pour être exécuté *à l'intérieur* du conteneur (`make generate-secrets` → `docker compose exec nuxt-app npm run generate-secrets`). Cela crée un problème de bootstrap : pour lancer les conteneurs, il faut un `.env` avec des secrets valides, mais pour générer ces secrets, il faut que les conteneurs soient déjà en cours d'exécution. Ce cycle bloquant a été contourné manuellement lors du premier déploiement (génération via Python ou copier-coller).

**Pistes d'implémentation envisagées :**

1. **Déplacer le script à la racine du dépôt** et l'exposer via une commande `make` dédiée :
   - Exécution via `node` / `tsx` installé localement si disponible
   - Ou exécution via un conteneur Docker éphémère (`docker run --rm node:20-alpine npx tsx ...`) pour ne pas dépendre d'une installation locale de Node

2. **Sortie du script :**
   - Option A (actuelle) : affichage dans la console → copier-coller manuel dans le `.env`
   - Option B : génération d'un fichier texte temporaire (ex: `.env.secrets.tmp`) contenant uniquement les lignes à copier, à supprimer après usage
   - Option C (non retenue) : modification directe du `.env` — trop risqué (écrasement de variables existantes, pas de contrôle)

**Critères d'acceptance:**
- [ ] Le script peut être lancé depuis la racine du dépôt, sans que les conteneurs Docker soient actifs
- [ ] Une commande `make generate-secrets` à la racine exécute le script (via Node local ou conteneur éphémère)
- [ ] Le README est mis à jour pour documenter cette étape dans le guide d'installation initiale
- [ ] L'exécution via conteneur Docker éphémère est la méthode de référence (pas de dépendance à un Node local)
- [ ] Si Node est disponible localement, une méthode alternative est documentée

**Technical notes:**
- Script à déplacer ou dupliquer : `nuxt-app/scripts/generate-secrets.ts` → `scripts/generate-secrets.ts` (racine)
- Commande `make` cible : `docker run --rm node:20-alpine sh -c "npx tsx /scripts/generate-secrets.ts"` avec volume mount
- Conserver l'ancienne commande `make generate-secrets` (dans le conteneur) pour compatibilité une fois les conteneurs actifs

---

### US-022: Audit accessibilité des maquettes ⬜ P1

**En tant que** développeur  
**Je veux** auditer et ajuster les composants par rapport aux normes d'accessibilité WCAG  
**Afin de** garantir que le site est utilisable par tous les utilisateurs, y compris ceux en situation de handicap

**Contexte** : Le cahier des charges Ilaria insiste sur l'accessibilité comme axe majeur du projet. Cependant, les maquettes fournies présentent plusieurs éléments qui posent potentiellement des problèmes d'accessibilité. Il faudra ajuster l'implémentation par rapport aux maquettes pour respecter les normes WCAG AA, tout en restant aussi fidèle que possible au design.

**Écarts identifiés sur les maquettes :**
- **Taille du texte** : certains composants utilisent du texte de petite taille, problématique pour les personnes malvoyantes. Vérifier que les tailles minimales sont respectées (16px base recommandé).
- **Contrastes insuffisants** : sur la page article, la section citation utilise du texte gris clair sur fond pêche pastel — contraste potentiellement insuffisant (WCAG AA exige un ratio ≥ 4.5:1 pour le texte normal, ≥ 3:1 pour le texte large).
- **Icônes de petite taille** : la page article contient de nombreuses petites icônes dont la lisibilité et la zone de clic (min 44×44px) doivent être vérifiées.
- **Absence d'option d'ajustement** : pas de mécanisme pour agrandir la taille du texte (optionnel mais recommandé).
- **Boutons et liens sociaux** : nombreux boutons et liens avec des zones interactives à vérifier.
- **Section Instagram en footer** : images avec boutons superposés — complexe pour la navigation clavier et la lisibilité (voir US-023).

**Critères d'acceptance:**
- [ ] Audit de contraste sur tous les composants implémentés (outils : axe DevTools, Lighthouse)
- [ ] Tailles de texte minimales respectées (≥ 14px, idéalement 16px pour le body)
- [ ] Toutes les zones interactives font au minimum 44×44px (WCAG 2.5.5)
- [ ] Navigation clavier fonctionnelle sur l'ensemble du site (focus visible, ordre logique)
- [ ] Tous les éléments non-textuels ont des alternatives (alt text, aria-label)
- [ ] Les contrastes respectent WCAG AA (ratio ≥ 4.5:1 texte normal, ≥ 3:1 texte large)
- [ ] Les ajustements de design par rapport aux maquettes sont documentés et justifiés

**Technical notes:**
- Outils de vérification : axe DevTools, Google Lighthouse, WAVE
- Les écarts avec les maquettes doivent être signalés à Ilaria si le design compromet l'accessibilité
- Cette US est transversale : s'applique à chaque composant au fil de l'implémentation
- Focus prioritaire sur les composants déjà implémentés (ArticleCard, TopStories) puis les nouveaux

---

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

---

## Points à clarifier avec Ilaria

> Éléments issus des maquettes qui nécessitent une discussion/validation. Les maquettes suggèrent des fonctionnalités ou des designs qui ne sont pas mentionnés dans le cahier des charges ou qui posent des questions de faisabilité/accessibilité.

### 1. Section Instagram Feed (footer)

**Constat** : Les maquettes montrent une section en bas de page avec un feed Instagram intégré. Le design présente les photos des posts dans des carrés de couleur avec un bouton "Follow" superposé sur les images.

**Questions :**
- [ ] Cette fonctionnalité est-elle attendue par Ilaria ? Elle n'est pas mentionnée dans le cahier des charges.
- [ ] L'API Instagram (Instagram Basic Display API) impose des contraintes : authentification OAuth, tokens à renouveler, limites de requêtes. Est-ce réaliste dans le cadre du projet ?
- [ ] Le design des maquettes semble éloigné du format standard d'un embed Instagram — est-ce un design custom souhaité, ou peut-on utiliser un embed officiel Instagram ?
- [ ] Alternative possible : un faux feed avec des images statiques pour la démo, en documentant la solution cible en production.
- [ ] **Accessibilité** : les images avec boutons superposés posent des problèmes pour la navigation clavier et les lecteurs d'écran.

**Statut** : ❓ À clarifier avant implémentation

### 2. Ajustements accessibilité vs maquettes

**Constat** : Plusieurs éléments des maquettes ne respectent pas les normes WCAG AA que le cahier des charges exige.

**Questions :**
- [ ] Est-ce acceptable de modifier certains aspects visuels des maquettes (contrastes, tailles de texte) pour respecter l'accessibilité ? En cas de conflit entre maquette et accessibilité, quelle est la priorité ?
- [ ] Faut-il documenter les écarts entre maquettes et implémentation finale ?

**Statut** : ❓ À clarifier — l'accessibilité est mentionnée comme prioritaire dans le cahier des charges, ce qui devrait primer sur la fidélité pixel-perfect aux maquettes.

### 3. Liens / boutons sociaux

**Constat** : Les maquettes montrent de nombreux boutons de partage social (Facebook, Twitter, etc.) et liens vers les réseaux sociaux du média.

**Questions :**
- [ ] S'agit-il de liens simples vers les profils sociaux, ou de boutons de partage fonctionnels (Share API) ?
- [ ] Les icônes de réseaux sociaux doivent-elles ouvrir dans un nouvel onglet ?
- [ ] Quels réseaux sont prioritaires ?

**Statut** : ❓ À clarifier — ne bloque pas l'implémentation frontend (on peut mettre des liens placeholder)

### 4. Option d'ajustement de la taille du texte

**Constat** : Aucune option de personnalisation de la taille du texte n'est prévue dans les maquettes, mais le cahier des charges insiste sur l'accessibilité.

**Questions :**
- [ ] Faut-il implémenter un mécanisme d'accessibilité (barre d'accessibilité type widget, ou simplement s'assurer que le zoom navigateur fonctionne bien) ?

**Statut** : ❓ À clarifier — au minimum, vérifier que le zoom navigateur jusqu'à 200% ne casse pas le layout

### 5. Newsletter

**Constat** : Les maquettes incluent un composant d'inscription à la newsletter sur la homepage. Cependant, **aucune fonctionnalité relative à la newsletter n'est mentionnée dans le cahier des charges** fourni par Ilaria.

**Questions :**
- [ ] La newsletter fait-elle partie du périmètre attendu par Ilaria pour la formation, ou est-ce un ajout des maquettes non requis ?
- [ ] Si oui, quel est le niveau d'attente ? Juste le composant d'inscription frontend, ou le système complet (envoi d'emails, gestion des abonnés, désinscription) ?
- [ ] Y a-t-il un outil d'emailing imposé ou recommandé par Ilaria ?
- [ ] La gestion RGPD (consentement, désinscription) est-elle évaluée ?

**Statut** : ❓ À clarifier — une US-023 est créée dans le backlog avec les deux scénarios (avec/sans compte) en prévision

### 6. Widget Météo (sidebar page article)

**Constat** : Les maquettes de la page article affichent un widget météo dans la sidebar. Cette fonctionnalité **n'est pas mentionnée dans le cahier des charges**.

**Questions :**
- [ ] Le widget météo fait-il partie du périmètre attendu par Ilaria ?
- [ ] Si oui, quelle API météo utiliser ? (OpenWeatherMap, Open-Meteo, autre ?)
- [ ] Quel comportement en cas de refus de géolocalisation par l'utilisateur ? (masquer le widget vs lieu par défaut)
- [ ] La précision de la localisation est-elle importante (ville exacte vs région) ?

**Statut** : ❓ À clarifier — une US-025 est créée dans le backlog en P3

### 7. Page Contact — fonctionnalités des maquettes

**Constat** : Les maquettes présentent une page contact riche avec plusieurs composants. Certains sont classiques (formulaire, FAQ, localisation), mais d'autres ne sont pas mentionnés dans le cahier des charges.

**Questions :**
- [ ] La page contact fait-elle partie du périmètre évalué par Ilaria ? (le cahier des charges ne la mentionne pas explicitement)
- [ ] Le **live chat** est-il attendu ? C'est une fonctionnalité complexe (temps réel, interface opérateur). Une alternative serait d'intégrer un service tiers.
- [ ] Pour la **carte de localisation** : Google Maps (clé API payante au-delà d'un seuil) ou alternative open-source (Leaflet/OpenStreetMap) ?
- [ ] Les données FAQ doivent-elles être gérées dynamiquement depuis l'admin, ou un contenu statique suffit ?

**Statut** : ❓ À clarifier — US-026 à US-030 créées dans le backlog, live chat classé en évolution future (US-F04)

---

## Notes techniques à explorer

> Cette section regroupe des réflexions et questions techniques transversales qui ne sont pas encore formalisées en User Stories mais qui méritent d'être documentées pour orienter les choix d'architecture futurs.

### NT-001: Comptage des vues vidéo

**Contexte** : Pour la section Top Video (US-006), les vues des vidéos sont actuellement hardcodées dans `site-content.ts`. Il faudra à terme un mécanisme automatique de comptage.

**Pistes à évaluer :**

1. **Tracker maison** : incrémenter un compteur en base pour chaque clic sur "play" (appel API `POST /api/videos/:slug/view`). Simple, sans dépendance externe. Consultable depuis l'interface admin.
2. **Google Analytics / GA4** : exploitation des événements GA4 (event `video_play`). Nécessite une intégration GA4 et une API de lecture des données (Google Analytics Data API). Plus complexe mais offre des métriques enrichies (taux de completion, engagement).
3. **Solution hybride** : tracker maison pour l'admin + GA4 pour l'analyse marketing.

**Questions ouvertes :**
- [ ] Quel niveau de précision est attendu ? (vues uniques par user vs total des clics)
- [ ] Les stats de vues doivent-elles être visibles dans l'interface admin ?
- [ ] Un tableau de bord analytics (genre récap hebdo) est-il prévu ?

**Statut** : 💭 À explorer — pas de US créée à ce stade

---

### NT-002: Récupération automatique de la durée des vidéos

**Contexte** : La durée des vidéos est actuellement hardcodée (ex: `"4:32"`). Pour un vrai système, il faudrait l'extraire automatiquement depuis le fichier vidéo au moment de l'upload.

**Pistes à évaluer :**

1. **Librairie JS côté serveur** : récupérer les métadonnées du fichier vidéo lors de l'upload (ex: `ffprobe` via `fluent-ffmpeg`, ou librairie pure JS comme `get-video-duration`). Retourne la durée en secondes, à formater en `mm:ss`.
2. **API de la plateforme d'hébergement** : si les vidéos sont hébergées sur Vimeo, YouTube ou Mux, leur API fournit la durée et d'autres métadonnées directement.
3. **Lecture côté client** : l'élément HTML `<video>` expose `videoElement.duration` une fois le fichier chargé. Utilisable pour un affichage client-side mais pas pour stocker en base.

**Questions ouvertes :**
- [ ] Les vidéos seront-elles hébergées en self-hosted (sur le serveur Gandi) ou chez une plateforme tier (Vimeo, Mux, Cloudflare Stream) ?
- [ ] La récupération de durée se fait-elle à l'upload (process admin) ou automatiquement via une tâche planifiée ?

**Statut** : 💭 À explorer — lié à la décision d'infrastructure vidéo (US-F03 VOD)

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

### US-F04: Live Chat ⬜ Future

**En tant que** visiteur  
**Je veux** communiquer en temps réel avec l'équipe du site  
**Afin d'** obtenir une réponse rapide à mes questions

**Contexte** : Les maquettes de la page contact incluent un composant de live chat. Cette fonctionnalité n'est **pas mentionnée dans le cahier des charges** Ilaria et représente une complexité significative (WebSocket, gestion de sessions, interface opérateur). Probablement hors scope de la formation.

**Périmètre envisagé :**
- Widget de chat intégré sur la page contact (ou flottant sur tout le site)
- Communication en temps réel (WebSocket / Server-Sent Events)
- Interface opérateur côté admin pour répondre aux messages
- Historique des conversations
- Alternative : intégrer un service tiers (Crisp, Intercom, Tawk.to)

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
| US-004a: Section Recent Articles | ✅ Done | - |
| US-004b: Featured Card | ✅ Done | - |
| US-004c: Recent Card | ✅ Done | - |
| US-004: Tests (FeaturedCard, RecentCard, Recent, fetchRecent store) | ✅ Done | - |

---

## Historique

| Date | Action |
|------|--------|
| 2026-02-25 | Création du backlog initial |
| 2026-02-26 | US-001, US-002, US-003 complétés (Sprint Homepage MVP) |
| 2026-02-27 | US-013, US-014, US-015 complétés (Tests unitaires & intégration) |
| 2026-03-03 | Alignement cahier des charges Ilaria : US-004 réécrite, US-016 à US-032 ajoutées, Epic 9 à 11, points à clarifier avec Ilaria |
| 2026-03-06 | US-004a/b/c complétés : Recent.vue, FeaturedCard.vue, RecentCard.vue — layout 2 colonnes, hover néo-brutaliste, tailles responsive. Tests restent à faire. |
| 2026-03-10 | US-004 ✅ : tests unitaires écrits (featured-card, recent-card, recent-articles), tests intégration store fetchRecent ajoutés. Mock data enrichi (64 articles, 9 catégories). US-033 ajoutée au backlog (Epic 7). |
| 2026-03-12 | US-006 Top Video Section ajoutée au backlog (Epic 1) avec 6 sous-US (006a à 006f) : composant parent, FeaturedVideoCard, SmallVideoCard, mock data, API+Store, tests. US-006 Article Detail Page renommée US-034 pour éviter le conflit de numérotation. US-006b affinée : largeur 60/40, auteur + durée + vues avec séparateurs, layout mobile. Section "Notes techniques à explorer" ajoutée (NT-001 comptage vues vidéo, NT-002 récupération durée). |

