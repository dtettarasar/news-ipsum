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

### US-001: Article Card Component ⬜ P0

**En tant que** visiteur  
**Je veux** voir une card présentant un article  
**Afin de** comprendre rapidement le contenu et décider de lire

**Critères d'acceptance:**
- [ ] Affiche l'image principale de l'article
- [ ] Affiche un badge avec le nom de la catégorie
- [ ] Affiche le titre (max 2 lignes, ellipsis)
- [ ] Affiche l'avatar et le nom de l'auteur
- [ ] Affiche le temps de lecture
- [ ] Affiche le nombre de vues (formaté: 1.2K)
- [ ] Bouton "See Details" cliquable
- [ ] Au clic → navigation vers `/articles/:slug`
- [ ] Effet hover (élévation + shadow)

**Technical notes:**
- Composant: `components/article/article-card.vue`
- Props: `article` (Object)
- Utilise `<NuxtLink>` pour la navigation

---

### US-002: Top Stories Section ⬜ P0

**En tant que** visiteur  
**Je veux** voir les articles les plus consultés  
**Afin de** découvrir le contenu populaire

**Critères d'acceptance:**
- [ ] Affiche 5 articles triés par nombre de vues (DESC)
- [ ] Utilise le composant ArticleCard
- [ ] Grid responsive: 1 col mobile → 2 col tablet → 5 col desktop
- [ ] État de chargement visible (spinner)
- [ ] Titre de section "Top Stories"
- [ ] Sous-titre "Most viewed articles this month"

**Technical notes:**
- API: `GET /api/articles/top-stories?limit=5`
- Store: `articlesStore.fetchTopStories(5)`
- Section dans `pages/index.vue`

---

### US-003: Articles Store Setup ⬜ P0

**En tant que** développeur  
**Je veux** un store unifié pour les articles  
**Afin de** centraliser la gestion des données articles

**Critères d'acceptance:**
- [ ] State: `topStories`, `recent`, `popular` (arrays)
- [ ] State: `loading` (object avec flags par section)
- [ ] Action: `fetchTopStories(limit)`
- [ ] Action: `fetchRecentByCategory(category, limit)`
- [ ] Action: `fetchPopular(limit)`
- [ ] Cache pour éviter re-fetch inutiles
- [ ] TypeScript interfaces définies

**Technical notes:**
- Fichier: `stores/articlesStore.ts`
- Pattern: Composition API (comme categoryStore)

---

### US-004: Recent by Category Section ⬜ P1

**En tant que** visiteur  
**Je veux** voir les articles récents d'une catégorie  
**Afin de** explorer le contenu par thème

**Critères d'acceptance:**
- [ ] Dropdown pour sélectionner la catégorie
- [ ] Affiche 6 articles de la catégorie sélectionnée
- [ ] Triés par date (récents en premier)
- [ ] Changement de catégorie recharge les articles
- [ ] État de chargement

**Technical notes:**
- API: `GET /api/articles/recent?category=X&limit=6`
- Store: `articlesStore.fetchRecentByCategory(cat, 6)`

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

## Sprint actuel: Homepage MVP

**Objectif**: Homepage fonctionnelle avec Top Stories

| Story | Status | Assigné |
|-------|--------|---------|
| US-003: Articles Store | ⬜ To Do | - |
| US-001: Article Card | ⬜ To Do | - |
| US-002: Top Stories | ⬜ To Do | - |

---

## Historique

| Date | Action |
|------|--------|
| 2026-02-25 | Création du backlog initial |

