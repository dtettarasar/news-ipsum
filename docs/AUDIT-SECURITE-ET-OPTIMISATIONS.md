# Audit sécurité et optimisations – News Ipsum

*Rapport d’audit et suivi des corrections. Dernière mise à jour : après application de l’ensemble des corrections (sécurité + logs).*

---

## 1. SÉCURITÉ

### 1.1 Critique / Haute priorité

#### 1.1.1 Fuite d’informations sensibles dans les logs ✅ Corrigé

**Fichiers concernés :**
- `server/api/auth/me.get.ts` : `console.log('Token récupéré depuis le cookie :', token)` — **le JWT complet est loggé** (équivalent à un mot de passe de session).
- `server/api/auth/me.get.ts` : `console.log('Token valide. Utilisateur authentifié avec les données :', decoded)` — payload JWT (sub chiffré, role) en clair.
- `server/utils/auth.service.ts` : logs de debug avec **ID utilisateur** et **payload chiffré** (`ID Original (DB):`, `ID Crypté (JWT):`). En prod, même avec `drop: ['console']`, les logs peuvent être conservés ailleurs (PM2, Docker, etc.).

**Risque :** Vol de token ou d’identifiants si les logs sont exposés (accès serveur, agrégateur de logs, support).

**Correction appliquée :** Tous les logs sensibles ont été supprimés. Côté serveur, seuls des messages sûrs sont conservés (ex. type d'erreur JWT, message d'erreur DB sans URI). Voir section 4.

---

#### 1.1.2 Log du mot de passe côté client (LoginForm.vue) ✅ Corrigé

**Fichier :** `components/admin/LoginForm.vue`  
**Lignes :** `console.log('Password:', credentials.password);`

**Risque :** En dev, le mot de passe apparaît dans la console du navigateur (DevTools), pouvant être vu en pair programming ou sur des captures d’écran.

**Correction appliquée :** Tous les logs (email, mot de passe, réponse serveur) ont été retirés du formulaire de connexion admin.

---

#### 1.1.3 Mongoose debug activé en permanence ✅ Corrigé

**Fichier :** `server/database/database.ts`  
**Ligne :** `mongoose.set('debug', true)`

**Risque :** Toutes les requêtes MongoDB (et parfois les données) sont envoyées vers la console. En production, cela peut exposer des infos sur la structure des données et sur les requêtes.

**Correction appliquée :** `mongoose.set('debug', process.env.NODE_ENV === 'development')` — le debug n’est actif qu’en développement.

---

#### 1.1.4 Absence de validation des entrées (admin-login) ✅ Corrigé

**Fichier :** `server/api/auth/admin-login.post.ts`  
- Aucune vérification que `email` et `password` sont des chaînes.
- Pas de limite de longueur : body énorme possible (DoS, abus).
- Si `readBody` renvoie `null` ou un type inattendu, `authenticateUser` peut planter (ex. `User.findOne({ email: null })`).

**Risque :** Comportement imprévisible, erreurs 500, fuite d’infos via messages d’erreur, possibilité d’abus (body trop gros).

**Correction appliquée :** Validation du body (type, format email, longueurs max : email 320 car., password 1024 car.). Réponse 400 « Requête invalide » ou « Identifiants invalides » si invalide.

---

#### 1.1.5 Gestion fragile du payload JWT dans /api/auth/me ✅ Corrigé

**Fichier :** `server/api/auth/me.get.ts`  
- `decoded.sub.split(':')` : si `decoded.sub` est malformé (pas de `:`), `decryptString` reçoit des données invalides et peut **lever une exception** non gérée → 500.
- Aucun try/catch autour du décryptage et de l’accès à la base.

**Risque :** Erreur 500 sur token corrompu ou ancien format, possible fuite de stack trace.

**Correction appliquée :** Validation du format de `decoded.sub` (split en 2 parties) avant décryptage ; try/catch autour du décryptage et de `User.findById` ; retour systématique `{ authenticated: false }` en cas d’erreur, sans exposer de détail.

---

### 1.2 Moyenne priorité

#### 1.2.1 Pas de rate limiting sur les endpoints sensibles

**Endpoints :** `POST /api/auth/admin-login`, éventuellement `GET /api/auth/me` (vérification de token).

**Risque :** Brute force sur les mots de passe, énumération d’utilisateurs (réponses 401 vs 404), surcharge du serveur.

**Recommandation :** Mettre en place un rate limiting (par IP et/ou par body.email) sur le login (ex. 5–10 tentatives par fenêtre de 15 min). Utiliser un middleware Nitro ou un reverse proxy (Caddy peut le faire).

---

#### 1.2.2 Rôle requis pour l’admin : incohérence ✅ Corrigé

**Fichier :** `server/api/auth/admin-login.post.ts`  
- Commentaire : « On demande explicitement le rôle **admin** ».
- Code : `authenticateUser(email, password, 'editor')` → **editor ET admin** peuvent se connecter.

**Correction appliquée :** Commentaire aligné avec le code : « Accès back-office : rôle editor ou admin (hiérarchie) ».

---

#### 1.2.3 Message d’erreur trop précis (401 vs 403) ✅ Corrigé

**Fichier :** `server/api/auth/admin-login.post.ts`  
- Différenciation 401 / 403 selon que l’erreur « contient "autorisé" » (403) ou non (401).  
- Les messages renvoyés au client sont explicites : « Identifiants invalides » vs « Accès non autorisé pour ce rôle ».

**Risque :** Un attaquant peut distinguer « email inconnu / mauvais mot de passe » (401) de « bon compte mais rôle insuffisant » (403), ce qui aide l’énumération de comptes.

**Correction appliquée :** Un seul code 401 et un seul message « Identifiants invalides » pour tout échec de connexion (identifiants incorrects ou rôle insuffisant).

---

#### 1.2.4 Feedback d’erreur insuffisant côté front (LoginForm) ✅ Corrigé

**Fichier :** `components/admin/LoginForm.vue`  
- En cas d’erreur (401/403/500), seul `console.error` est utilisé ; l’utilisateur ne voit pas de message à l’écran.

**Correction appliquée :** Affichage d’un message d’erreur générique à l’écran (« Identifiants incorrects ou accès non autorisé ») via une ref `errorMessage` et un bloc `v-if` avec `role="alert"`.

---

### 1.3 Basse priorité / Bonnes pratiques

- **Cookie `path`** : Pour `logout`, `deleteCookie` utilise `path: '/'`. Vérifier que `setCookie` pour `auth_token` utilise le même `path` (Nuxt/H3 utilise `'/'` par défaut) pour cohérence.
- **HTTPS en prod** : Caddy gère le TLS ; s’assurer que `secure: true` est bien appliqué en production (déjà conditionné par `NODE_ENV`).
- **Secrets** : `.env` est dans `.gitignore` ; pas de secret en dur dans le code. Garder `generate-secrets` et documenter qu’il ne faut pas réutiliser les secrets entre environnements.
- **CSP / headers** : Aucune CSP ou header de sécurité (X-Frame-Options, etc.) visible dans la config. À considérer pour renforcer la défense en profondeur.

---

## 2. OPTIMISATIONS ET QUALITÉ

### 2.1 Configuration

- **`runtimeConfig.public.seoIndex`** : Fixé à `false` en dur. Pour que `NUXT_PUBLIC_SEO_INDEX` du `.env` soit pris en compte, lier la valeur à l’env, par ex. :  
  `seoIndex: process.env.NUXT_PUBLIC_SEO_INDEX === 'true'` (ou équivalent selon la doc Nuxt 4).

### 2.2 Code

- **Nav-bar et état connecté** : `userIsLogged` est un `ref(false)` jamais synchronisé avec le store `auth` ou `/api/auth/me`. Connecter la nav au store (ou à un `useFetch('/api/auth/me')`) pour afficher correctement « connecté » / « Login ».
- **LoginForm** : ✅ Logs supprimés, état d’erreur + message utilisateur en place.
- **Carrousel** : ✅ Tous les `console.log` retirés de `carrousel.vue` et `test-carrousel.vue` (setStep, afterTransition).
- **Cohérence de nommage** : Le fichier `cypher.ts` (orthographe « cypher ») ; le commentaire en tête parle de `cipher.ts`. Renommer ou corriger le commentaire pour éviter la confusion.

### 2.3 Base de données

- **URI MongoDB** : Construite dans le plugin à partir de `mongoUser`, `mongoPass`, `mongoDbName`. Si l’un est `undefined`, l’URI peut être invalide. Ajouter une vérification au démarrage (ou une validation du `runtimeConfig`) et une erreur claire si des variables manquent.
- **Index** : Le modèle `User` a `email` en `unique: true` (index côté Mongoose). Vérifier que les index sont bien créés en prod (Mongoose les crée à la première utilisation ; pour un déploiement propre, un script d’init peut être utile).

### 2.4 Dépendances

- **bcrypt vs bcryptjs** : Les deux sont présents dans `package.json`. `bcrypt` est natif (C++), `bcryptjs` est pur JS. Le code utilise `bcryptjs`. Pour alléger et éviter la confusion, retirer `bcrypt` si tout le code utilise `bcryptjs`.
- Tenir à jour les dépendances (npm audit, Dependabot) pour corriger les CVE connues.

---

## 3. SYNTHÈSE DES ACTIONS RECOMMANDÉES

| Priorité | Action | Statut |
|----------|--------|--------|
| Critique | Supprimer les logs contenant token, cookie, password, ID utilisateur. | ✅ |
| Critique | Désactiver Mongoose debug en production. | ✅ |
| Critique | Valider le body de `admin-login` (types, format email, longueur max). | ✅ |
| Critique | Protéger `/api/auth/me` (try/catch, validation du format de `decoded.sub`). | ✅ |
| Haute | Supprimer le log du mot de passe dans LoginForm.vue. | ✅ |
| Haute | Rate limiting sur POST /api/auth/admin-login. | À faire |
| Moyenne | Aligner rôle requis et commentaire (admin seul ou editor+admin). | ✅ |
| Moyenne | Message d’erreur de login générique (client + serveur). | ✅ |
| Moyenne | Afficher un message d’erreur dans LoginForm en cas d’échec. | ✅ |
| Basse | Lier `seoIndex` à NUXT_PUBLIC_SEO_INDEX. | À faire |
| Basse | Brancher la nav-bar au store auth. | À faire |
| Basse | Nettoyer les dépendances (bcrypt inutilisé). | À faire |

---

## 4. CORRECTIONS DÉJÀ APPLIQUÉES (suite à cet audit)

Toutes les modifications listées ci-dessous ont été committées et sont prêtes pour la mise en production.

### 4.1 Sécurité (auth, validation, messages)

- **server/api/auth/admin-login.post.ts** : Validation du body (types, format email, longueurs max : email 320 car., password 1024 car.) ; réponse 400 si body invalide ; message d'erreur unique 401 « Identifiants invalides » pour tout échec (évite l'énumération de comptes) ; commentaire aligné (accès back-office : editor ou admin).
- **server/api/auth/me.get.ts** : Suppression de tous les `console.log` (token, decoded, user) ; validation du format de `decoded.sub` avant split ; try/catch autour du décryptage et de `User.findById` ; import explicite de `verifyAuthToken` ; retour `{ authenticated: false }` en cas d'erreur sans exposer de détail.
- **server/utils/auth.service.ts** : Suppression des logs de debug (ID utilisateur, payload chiffré) dans `createAuthToken` ; dans `verifyAuthToken`, un seul `console.warn('[Auth] JWT verification failed:', errorName)` pour le diagnostic serveur (pas de token ni payload loggé).
- **components/admin/LoginForm.vue** : Suppression de tous les logs (email, mot de passe, réponse serveur) ; affichage d'un message d'erreur générique à l'écran (« Identifiants incorrects ou accès non autorisé ») via `errorMessage` et `role="alert"`.

### 4.2 Logs backend (serveur)

- **server/database/database.ts** : `mongoose.set('debug', process.env.NODE_ENV === 'development')` ; unhandledRejection : log uniquement du message d'erreur (plus de `promise`/`reason` bruts) ; erreur de connexion / fermeture : log uniquement `error.message` (plus l'objet complet ni `console.trace`) pour éviter toute fuite d'URI ou stack.
- **server/api/categories.get.ts** : Log de seed remplacé par `console.warn('[Categories] Database empty, seeding initial categories')` (aucune donnée sensible).
- **scripts/create-admin.ts** : En cas d'erreur, log de `err.message` uniquement (plus l'objet complet, qui pourrait contenir l'URI MongoDB).

### 4.3 Logs frontend (supprimés)

- **stores/categoryStore.ts** : Suppression du `console.error` dans le catch (l'erreur est déjà exposée via `this.error`).
- **components/forms/SearchBar.vue** : Suppression des `console.log` ; TODO laissé pour la future logique de recherche.
- **components/category-content/carrousel.vue** et **test-carrousel.vue** : Suppression de tous les `console.log` (setStep, afterTransition).

### 4.4 Configuration (nuxt.config.ts)

- **vite.esbuild.drop** : En production, `['console', 'debugger']` retire tout `console.*` et `debugger` du bundle **client et serveur**. Les logs serveur ajoutés pour le diagnostic ne s'affichent qu'en dev ; en prod, aucune sortie console = pas de fuite. Commentaire dans le config mis à jour pour expliquer ce comportement.

---

*Fin du rapport d’audit.*

