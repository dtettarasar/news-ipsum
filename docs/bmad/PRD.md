# Product Requirements Document (PRD)

*News Ipsum - Ilaria Digital School Project*

---

## 1. Vision Produit

### 1.1 Résumé

**News Ipsum** est une plateforme de publication d'actualités (articles, interviews, reportages) construite avec une stack moderne (Nuxt 4, MongoDB, Pinia). Ce projet est réalisé dans le cadre du programme final de la **Ilaria Digital School**, avec pour objectif de démontrer les compétences en développement web full-stack, en conception responsive et en accessibilité web.

### 1.2 Objectifs

| Objectif | Description | Priorité |
|----------|-------------|----------|
| **Portfolio** | Démontrer les compétences techniques modernes | Haute |
| **Apprentissage** | Maîtriser Nuxt 4, Composition API, SSR | Haute |
| **Responsive** | Expérience optimale sur tous les appareils (mobile, tablette, desktop) | Haute |
| **Accessibilité** | Respecter les principes WCAG pour un site utilisable par tous, y compris les personnes en situation de handicap | Haute |
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
| **Recent Articles** | 5 articles les plus récents (featured card + grille 2×2) | P1 | Medium |
| **Most Popular** | Articles par likes | P1 | Medium |
| **Article Detail Page** | Page complète d'un article | P1 | Large |
| **Inscription utilisateur** | Création de compte lecteur (publique) | P2 | Medium |
| **Tags** | Système de tags complémentaire aux catégories | P2 | Medium |
| **Admin User Management** | Gestion des comptes et rôles (admin) | P2 | Medium |
| **Search** | Recherche d'articles | P2 | Medium |
| **Comments** | Système de commentaires (nécessite inscription) | P2 | Large |
| **Admin Dashboard** | Interface admin complète | P2 | Large |
| **Récupération mot de passe** | Reset password par email | P3 | Medium |
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
│           RECENT ARTICLES                    │
│  5 articles récents (featured + grille 2×2) │
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

### 3.3 Section Recent Articles

**Description** : Affiche les 5 articles les plus récemment publiés (triés par `createdAt` DESC), sans filtre par catégorie.

**Layout desktop** : 2 colonnes
- **Colonne gauche** : Featured card (article le plus récent) — image en background, badge catégorie pill, titre en blanc en bas, overlay dégradé sombre
- **Colonne droite** : Grille 2×2 de petites cards (4 articles suivants) — image, badge catégorie pill, titre uniquement (pas d'auteur, pas de vues, pas de bouton)
- Les 2 colonnes font la même hauteur

**Layout mobile** : 1 colonne — featured card en haut (même hauteur que les petites cards, conserve son design distinctif), puis les 4 petites cards empilées

**Composants** :
- `RecentArticles.vue` : Section parent (fetch + layout)
- `FeaturedCard.vue` : Grande card article mis en avant
- `RecentCard.vue` : Petite card simplifiée

**API** : `GET /api/articles/recent?limit=5`

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

## 7. Évolutions futures (hors scope formation)

Les fonctionnalités suivantes sont envisagées comme des évolutions à long terme de la plateforme, au-delà du périmètre de la formation Ilaria Digital School :

| Feature | Description |
|---------|-------------|
| **Abonnements / Premium** | Système d'abonnement, contenu réservé aux abonnés, achat à la carte, intégration paiement |
| **Événementiel** | Pages événements, inscription en ligne, gestion admin |
| **VOD / Vidéo** | Player vidéo intégré, catalogue VOD, contenu gratuit et premium |

---

## 8. Historique des révisions

| Date | Version | Changements | Auteur |
|------|---------|-------------|--------|
| 2026-02-25 | 1.0 | Création initiale | Dylan |
| 2026-03-03 | 1.1 | Alignement cahier des charges Ilaria : contexte pédagogique, accessibilité, types de contenu, Recent Articles (ex Recent by Category), inscription utilisateur, récupération mdp, tags, gestion admin utilisateurs, évolutions futures | Dylan |

