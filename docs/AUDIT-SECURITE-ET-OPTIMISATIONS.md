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


#### 1.1.6 Route de test exposée (GET /api/test-mongo) ✅ Corrigé

**Fichiers concernés :** `server/api/test-mongo.get.ts`, `components/other/test-mongo-db.vue`

**Problème :** Une route GET publique (`/api/test-mongo`) permettait de **créer des documents dans MongoDB** (modèle TestMessage) à chaque appel, sans authentification, sans validation ni quota. Un attaquant ou un robot pouvait en appeler l'URL pour polluer la base ou surcharger le serveur.

**Risque :** Écriture non contrôlée en base, pollution des données, abus (appels massifs), fuite d'information sur la structure des modèles.

**Correction appliquée :** Route et composant supprimés. Les vérifications « création + lecture » du modèle TestMessage sont désormais couvertes par des **tests Vitest** (unitaire avec mocks + intégration avec vraie DB). Voir section 4.5.

**Règle à respecter :** Ne pas exposer de route API (GET, POST, etc.) dont le seul but est de tester la base de données ou de créer/manipuler des objets en base sans contrôle (auth, validation, usage légitime). Les tests de persistance doivent rester dans la suite de tests (ex. Vitest, tests d'intégration), pas dans une route appelable en production.

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

### 4.5 Routes de test / base de données

- **Suppression de `server/api/test-mongo.get.ts`** : Route GET publique qui créait un document TestMessage à chaque appel, sans aucun contrôle. Risque de pollution de la base et d'abus. La route a été retirée.
- **Suppression de `components/other/test-mongo-db.vue`** : Composant qui appelait cette route ; plus utilisé.
- **Remplacement par des tests Vitest** : Un test unitaire (mocks) et un test d'intégration (vraie MongoDB) couvrent désormais le modèle TestMessage (création + findById), dans `tests/unit/backend/test-message.test.ts` et `tests/integration/backend/test-message.integration.test.ts`.
- **Règle pour la suite** : Ne pas créer de route API dont le but est uniquement de tester la base ou de créer/manipuler des objets en base sans authentification, validation ou usage métier légitime. Privilégier les tests automatisés (unitaires + intégration) pour ce type de vérifications.

## 5. AUTHENTIFICATION ET CONTRÔLE D'ACCÈS (refactor)

Cette section documente l'architecture actuelle de l'authentification et du contrôle d'accès par rôle (middleware, routes, service), telle que mise en place après refactor.

### 5.1 Flux global

1. **Connexion** : `LoginForm.vue` envoie `email`, `password` et `role` (ex. `editor`) vers `POST /api/auth/login`. La route appelle `createAuthCookie(event, email, password, role)` dans `auth.service.ts` (validation, `authenticateUser`, création du JWT, `setCookie`). En succès : réponse 200 avec `{ success: true }` ; en échec : 200 avec `{ success: false, message: '...' }` (pas de 401 pour éviter les problèmes d'affichage du message côté front).
2. **Accès aux pages admin** : Les pages protégées (`admin/index.vue`, `admin/settings.vue`) déclarent le middleware `auth` et une meta `auth: { requiredRole: 'editor' | 'admin' }`. Le middleware appelle `/api/auth/me` (cookie transmis), vérifie `authenticated` puis la hiérarchie des rôles. Si échec : redirection vers `/admin/login` avec rechargement complet (`external: true`) pour éviter les erreurs d'hydration.
3. **Données utilisateur pour l'affichage** : Les pages admin font un `useFetch('/api/auth/me', { key: 'admin-session' })` et synchronisent le store Pinia pour afficher nom, email, rôle. Le contrôle d'accès est fait uniquement par le middleware ; le store sert à l'affichage.

### 5.2 Middleware `middleware/auth.ts`

- **Meta `auth` (type `AuthMeta`)** : Chaque page protégée doit définir dans `definePageMeta` :
  - **`redirectTo`** (recommandé, sinon valeur par défaut) : URL du formulaire de connexion pour cette zone (ex. `/admin/login`, plus tard `/account/login`). Utilisé lorsque l'utilisateur n'est pas authentifié, et en fallback si rôle insuffisant sans `insufficientRoleRedirect`.
  - **`requiredRole`** (optionnel) : Rôle minimum requis (ex. `editor`, `admin`). Si absent, seule l'authentification est vérifiée.
  - **`insufficientRoleRedirect`** (optionnel) : Si authentifié mais rôle insuffisant, redirection vers cette URL (ex. `/admin`). Sinon on utilise `redirectTo`.
- **Valeur par défaut** : `DEFAULT_LOGIN_PATH = '/admin/login'`. Si une page utilise le middleware sans `auth.redirectTo`, cette valeur est utilisée ; en dev, un `console.warn` rappelle de définir `redirectTo` (le log apparaît côté serveur en SSR ou dans la console navigateur en navigation client).
- **Hiérarchie des rôles** : `ROLE_LEVEL = { admin: 3, editor: 2, user: 1 }` (répliquée côté client, sans importer le serveur). Tout rôle non listé (ex. `subscriber`) vaut 0 → accès refusé.
- **SSR** : En `import.meta.server`, le cookie est récupéré via `useRequestHeaders(['cookie'])` et transmis à `$fetch('/api/auth/me')` pour que l'appel interne reçoive le cookie (sans quoi l'API renverrait `authenticated: false` et l'utilisateur resterait bloqué sur login après un rechargement).
- **Client** : `$fetch('/api/auth/me', { credentials: 'include', headers: { 'Cache-Control': 'no-store' } })` pour éviter le cache et voir les changements de rôle (ex. admin → subscriber en base).
- **Redirection** : Une seule helper `redirect(target)` fait `navigateTo(target, { replace: true, external: true })`. Non authentifié → `redirect(redirectTo)`. Rôle insuffisant → `redirect(insufficientRoleRedirect ?? redirectTo)`. Plus aucune URL en dur dans la logique (sauf `DEFAULT_LOGIN_PATH` en secours).
- **Logique** : Si `!data.authenticated` → `redirect(redirectTo)`. Si `requiredRole` et `userLevel < requiredLevel` → `redirect(insufficientRoleRedirect ?? redirectTo)`. Sinon la navigation continue.

### 5.3 Routes API auth

- **GET /api/auth/me** : Lit le cookie `auth_token`, appelle `getUserByToken(token)` (dans `auth.service.ts`). Retourne `{ authenticated: true, user: { name, email, role } }` ou `{ authenticated: false }`. Le rôle est toujours lu depuis la base (via `getUserByToken`), pas depuis le JWT.
- **POST /api/auth/login** : Body `email`, `password`, `role`. Délègue à `createAuthCookie`. En erreur : retour 200 avec `{ success: false, message }` pour que le front affiche le message sans dépendre du rejet de la promesse.
- **POST /api/auth/logout** : Appelle `deleteAuthToken(event)` (suppression du cookie), retourne `{ success: true }`.

### 5.4 Service `server/utils/auth.service.ts`

- **ROLE_HIERARCHY** : Même hiérarchie que le middleware (`admin`, `editor`, `user`). À garder synchronisée avec `ROLE_LEVEL` dans le middleware si de nouveaux rôles sont ajoutés.
- **createAuthToken(userId)** : JWT avec uniquement `sub` (userId chiffré), pas de `role` dans le token ; le rôle est toujours récupéré en base.
- **getUserByToken(token)** : Vérifie le token, déchiffre le `sub`, charge l'utilisateur en base, retourne `{ authenticated, user }` ou `{ authenticated: false }`. Utilisé par `me.get.ts` ; permet de centraliser la logique et de la réutiliser.
- **createAuthCookie** : Validation email/password (auth.validation), `authenticateUser` (avec `requiredRole`), `createAuthToken`, `setCookie`. Gère tout le flux login côté serveur.
- **deleteAuthToken(event)** : Supprime le cookie avec les mêmes options qu'à la création (path, httpOnly, sameSite, secure).

### 5.5 Pages admin

- **admin/index.vue** : `auth: { requiredRole: 'editor', redirectTo: '/admin/login' }`. Accès : editor et admin. Pas de `insufficientRoleRedirect` : un utilisateur avec un rôle inférieur (ex. subscriber) est renvoyé vers `redirectTo` (login).
- **admin/settings.vue** : `auth: { requiredRole: 'admin', redirectTo: '/admin/login', insufficientRoleRedirect: '/admin' }`. Accès : admin uniquement. Un editor authentifié est redirigé vers `/admin` (index admin) au lieu du login.
- **admin/login.vue** : Pas de middleware auth (éviter une boucle de redirection).

Aucune redirection conditionnelle dans `onMounted` basée sur le store ; le contrôle d'accès est uniquement dans le middleware.

### 5.6 Points d'attention

- **Synchronisation des rôles** : Si un nouveau rôle est ajouté en base (ex. `subscriber`), l'ajouter dans `ROLE_LEVEL` (middleware) et dans `ROLE_HIERARCHY` (auth.service) pour que le login et le middleware restent cohérents.
- **Hydration** : En cas de redirection « accès refusé » depuis le middleware, utiliser une navigation avec `external: true` vers la page de login pour éviter un décalage entre le DOM (ancienne page / bfcache) et le composant Vue (login).

---

## 6. TESTS : MISE À JOUR ET NOUVELLES CIBLES

Cette section recense les scripts de tests existants liés à l’auth et au contrôle d’accès, et définit les **nouvelles fonctions ou comportements à couvrir** (ou à mettre à jour) suite aux changements décrits en section 5.

### 6.1 État actuel des tests

- **Intégration** : `tests/integration/backend/auth_integration.test.ts`
  - Connexion à la base de test, création d’un utilisateur admin via `generateTestUserData('admin')`.
  - **authenticateUser** : succès avec bons identifiants + rôle admin ; échec mot de passe incorrect ; échec email inconnu ; hiérarchie (admin peut accéder avec requiredRole `editor` ; editor refusé avec requiredRole `admin`).
  - **createAuthToken** : génération d’un JWT (format 3 parties), pas de vérification du payload (anciennement `sub` + `role`, désormais `sub` seul).
  - **verifyAuthToken** : payload avec `sub` au format `iv:encryptedStr`, décryptage et comparaison avec l’ID utilisateur ; rejet d’un token modifié.
- **Unitaires** : Aucun test unitaire dédié à `auth.service.ts` ; la logique est couverte par les tests d’intégration ci‑dessus. `cypher.test.ts` et `database.test.ts` couvrent d’autres couches.

### 6.2 Nouvelles fonctions à tester (auth.service.ts)

| Fonction / comportement | Type de test recommandé | Description |
|-------------------------|-------------------------|-------------|
| **getUserByToken(token)** | Intégration | Token vide ou undefined → `{ authenticated: false }`. Token invalide ou expiré → `{ authenticated: false }`. Token valide (créé via createAuthToken) → `{ authenticated: true, user: { name, email, role } }`. Token avec `sub` malformé (pas de `:`, ou parties manquantes) → `{ authenticated: false }`. Utilisateur supprimé en base après émission du token → `{ authenticated: false }`. |
| **createAuthCookie(event, email, password, role)** | Intégration (ou E2E) | Dépend de `H3Event` et de `setCookie` ; peut être testé via une requête POST vers `/api/auth/login` (intégration API) : body valide + rôle suffisant → cookie présent dans la réponse ; body invalide ou rôle insuffisant → pas de cookie, réponse 200 avec `success: false` ou throw. Les tests actuels de `authenticateUser` et `createAuthToken` couvrent déjà la logique métier ; l’intégration login.post + createAuthCookie peut être couverte par des tests d’intégration des routes. |
| **deleteAuthToken(event)** | Intégration (route) | Via POST `/api/auth/logout` : après login, appel logout → cookie `auth_token` absent ou supprimé dans la réponse. |
| **createAuthToken** (payload sans role) | Intégration (déjà partiellement couvert) | S’assurer que le payload vérifié ne contient que `sub` (et iat/exp), plus de clé `role`. Les tests existants vérifient déjà `payload.sub` ; ajouter si besoin une assertion explicite sur l’absence de `role` dans le payload. |

### 6.3 Comportements à couvrir (routes API)

| Route / comportement | Type de test | Description |
|----------------------|--------------|-------------|
| **GET /api/auth/me** | Intégration | Sans cookie → `{ authenticated: false }`. Avec cookie valide (token créé pour un user en base) → `{ authenticated: true, user: { name, email, role } }`. Avec cookie invalide ou expiré → `{ authenticated: false }`. Le rôle doit être celui en base (pas celui du JWT, le JWT ne contient plus le rôle). |
| **POST /api/auth/login** | Intégration | Body `{ email, password, role }` valide et rôle suffisant → 200, `{ success: true }`, cookie `auth_token` présent. Body invalide (email malformé, password vide, etc.) ou identifiants incorrects / rôle insuffisant → 200, `{ success: false, message: '...' }`, pas de cookie. |
| **POST /api/auth/logout** | Intégration | Avec cookie auth valide → 200, `{ success: true }`, cookie supprimé (ou absent dans la réponse). |

### 6.4 Middleware auth (optionnel)

Le middleware `auth.ts` s’exécute dans un contexte Nuxt (SSR + client) et dépend de `navigateTo`, `useRequestHeaders`, `$fetch`. Les options de couverture :

- **Tests E2E** (Playwright, Cypress) : navigation vers une page protégée sans cookie → redirection vers `redirectTo` ; avec cookie mais rôle insuffisant → redirection vers `insufficientRoleRedirect` ou `redirectTo` ; avec cookie et rôle suffisant → accès à la page. Vérifier que la cible de redirection dépend bien de la meta (ex. settings → `/admin`, index → `/admin/login`).
- **Tests unitaires du middleware** : possible en mockant `$fetch`, `navigateTo`, `to.meta.auth`, mais lourd ; priorité moindre si les routes API et le service sont bien couverts.

### 6.5 Synthèse des priorités

1. **À ajouter en priorité** : Tests d’intégration pour **getUserByToken** (token vide, invalide, valide, sub malformé, user supprimé).
2. **À vérifier / mettre à jour** : **auth_integration.test.ts** — s’assurer que les assertions sur le payload JWT (verifyAuthToken) ne supposent plus la présence de `role` ; couvrir explicitement le fait que le token ne contient que `sub`.
3. **Recommandé** : Tests d’intégration des routes **GET /api/auth/me**, **POST /api/auth/login** (réponse + cookie), **POST /api/auth/logout** (suppression du cookie), pour valider le flux complet avec `createAuthCookie` et `getUserByToken`.
4. **Optionnel** : Tests E2E du middleware (redirections selon meta) ; tests unitaires du middleware avec mocks.

---

