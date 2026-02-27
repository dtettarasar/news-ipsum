# Product Requirements Document (PRD)

*News Ipsum - Ilaria Digital School Project*

---

## 1. Vision Produit

### 1.1 Résumé

**News Ipsum** est une plateforme de publication d'articles de type magazine/blog, construite avec une stack moderne (Nuxt 4, MongoDB, Pinia) pour démontrer les compétences en développement web full-stack.

### 1.2 Objectifs

| Objectif | Description | Priorité |
|----------|-------------|----------|
| **Portfolio** | Démontrer les compétences techniques modernes | Haute |
| **Apprentissage** | Maîtriser Nuxt 4, Composition API, SSR | Haute |
| **Production-ready** | Code sécurisé, testé, documenté | Haute |
| **Évolutif** | Architecture scalable pour futures features | Moyenne |

### 1.3 Public cible

- Recruteurs / Employeurs potentiels (démo technique)
- Utilisateurs finaux (lecteurs d'articles)
- Administrateurs (gestion de contenu)

---

## 2. Features

### 2.1 Features implémentées ✅

| Feature | Description | Status |
|---------|-------------|--------|
| **Auth système** | Login/logout, JWT, rôles (admin/editor/user) | ✅ Done |
| **Middleware auth** | Protection des routes admin | ✅ Done |
| **Catégories** | Affichage en carrousel, données depuis API | ✅ Done |
| **API Categories** | CRUD catégories avec MongoDB | ✅ Done |
| **Store Pattern** | Pinia avec Composition API | ✅ Done |
| **Tests** | Unitaires + intégration (Vitest) | ✅ Done |

### 2.2 Features en cours 🟡

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| **Homepage** | Layout complet avec sections | 🟡 En cours | P0 |
| **Article Cards** | Composant card pour articles | 🟡 En cours | P0 |
| **Top Stories** | Section articles les plus vus | 🟡 En cours | P0 |
| **Articles Store** | Store avec top/recent/popular | 🟡 En cours | P0 |

### 2.3 Features planifiées 📋

| Feature | Description | Priority | Effort |
|---------|-------------|----------|--------|
| **Recent by Category** | Articles récents par catégorie | P1 | Medium |
| **Most Popular** | Articles par likes | P1 | Medium |
| **Article Detail Page** | Page complète d'un article | P1 | Large |
| **Search** | Recherche d'articles | P2 | Medium |
| **Comments** | Système de commentaires | P2 | Large |
| **Admin Dashboard** | Interface admin complète | P2 | Large |
| **User Profile** | Page profil utilisateur | P3 | Medium |
| **Newsletter** | Inscription newsletter | P3 | Small |

---

## 3. Homepage - Spécifications détaillées

### 3.1 Structure de la page

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │
│  Logo | Navigation | Search | Login         │
├─────────────────────────────────────────────┤
│                  HERO                        │
│  Titre principal + Tagline                  │
├─────────────────────────────────────────────┤
│              CATEGORIES                      │
│  Carrousel des catégories                   │
├─────────────────────────────────────────────┤
│              TOP STORIES                     │
│  5 articles les plus vus (cards)            │
├─────────────────────────────────────────────┤
│           RECENT BY CATEGORY                 │
│  6 articles récents - filtre par catégorie  │
├─────────────────────────────────────────────┤
│              MOST POPULAR                    │
│  12 articles les plus likés (cards)         │
├─────────────────────────────────────────────┤
│                FOOTER                        │
│  Links | Social | Copyright                 │
└─────────────────────────────────────────────┘
```

### 3.2 Section Top Stories

**Description** : Affiche les 5 articles les plus consultés (triés par `views` DESC)

**Composants** :
- `ArticleCard.vue` : Card individuelle d'article
- Grid responsive : 1 col (mobile) → 2 col (tablet) → 5 col (desktop)

**Données affichées par card** :
- Image principale
- Badge catégorie
- Titre article
- Avatar + nom auteur
- Temps de lecture
- Nombre de vues
- Bouton "See Details"

**API** : `GET /api/articles/top-stories?limit=5`

### 3.3 Section Recent by Category

**Description** : 6 articles récents, filtrable par catégorie

**Comportement** :
- Dropdown pour sélectionner la catégorie
- Au changement : recharge les articles de cette catégorie
- Tri par `createdAt` DESC

**API** : `GET /api/articles/recent?category=Technologie&limit=6`

### 3.4 Section Most Popular

**Description** : 12 articles les plus likés (triés par `likes` DESC)

**API** : `GET /api/articles/popular?limit=12`

---

## 4. Article Card - Spécifications

### 4.1 Layout

```
┌───────────────────────────┐
│         IMAGE             │
│  ┌─────────┐              │
│  │CATEGORY │              │
│  └─────────┘              │
├───────────────────────────┤
│  Article Title            │
│  (3 lines max)            │
├───────────────────────────┤
│  👤 Author Name           │
│  ⏱️ 5 min • 👁️ 1.2K views │
├───────────────────────────┤
│  [ See Details ]          │
└───────────────────────────┘
```

### 4.2 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `article` | Object | Yes | Données de l'article |
| `article._id` | String | Yes | ID unique |
| `article.title` | String | Yes | Titre |
| `article.slug` | String | Yes | URL slug |
| `article.image` | String | Yes | URL image |
| `article.category` | String | Yes | Nom catégorie |
| `article.author` | Object | Yes | `{ name, avatar }` |
| `article.readTime` | Number | Yes | Minutes de lecture |
| `article.views` | Number | Yes | Nombre de vues |

### 4.3 Comportement

- **Hover** : Légère élévation + shadow
- **Click** : Navigation vers `/articles/:slug`
- **Image loading** : Placeholder pendant chargement
- **Responsive** : S'adapte à la grille parente

---

## 5. Critères d'acceptance généraux

### 5.1 Performance

- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Time to Interactive (TTI) < 3s
- [ ] Cumulative Layout Shift (CLS) < 0.1

### 5.2 Accessibilité

- [ ] Navigation clavier fonctionnelle
- [ ] Contrastes WCAG AA
- [ ] Alt text sur images
- [ ] Aria labels sur boutons icon

### 5.3 Responsive

- [ ] Mobile-first design
- [ ] Breakpoints : 320px, 768px, 1024px, 1400px
- [ ] Touch-friendly (min 44px tap targets)

### 5.4 SEO

- [ ] Meta tags dynamiques par page
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] Robots.txt

---

## 6. Contraintes techniques

| Contrainte | Valeur |
|------------|--------|
| Framework | Nuxt 4 |
| State Management | Pinia (Composition API) |
| Database | MongoDB |
| Styling | CSS Scoped (pas de framework CSS) |
| Testing | Vitest + Vue Test Utils |
| Node | >= 18 |

---

## 7. Historique des révisions

| Date | Version | Changements | Auteur |
|------|---------|-------------|--------|
| 2026-02-25 | 1.0 | Création initiale | Dylan |

