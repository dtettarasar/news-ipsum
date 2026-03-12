# AGENTS — Équipe IA BMAD du projet News Ipsum

> Ce document décrit les différents agents IA utilisables dans le cadre de la méthode BMAD appliquée au projet News Ipsum. Chaque agent a un rôle précis, un périmètre d'intervention défini et un mode d'activation.

---

## Deux modes de travail

| Mode | Description | Agent(s) impliqué(s) |
|------|-------------|----------------------|
| **Pilotage automatique** | L'agent IA écrit le code, génère les fichiers, implémente les fonctionnalités. Tu supervises, relis, valides. | Developer, Architect, QA, etc. |
| **Pilotage manuel** | C'est toi qui codes. L'agent IA guide, pose des questions, donne des indices. Il ne génère pas de code complet. | **AI Mentor** |

---

## Agents de conception

### Analyst

**Rôle** : Phase de découverte et de recherche. Explore les solutions possibles, analyse le contexte métier et identifie les besoins utilisateurs.

**Quand l'utiliser** : Au démarrage d'un nouveau projet ou d'une nouvelle fonctionnalité, avant de rédiger les spécifications.

**Exemples de tâches** :
- Analyser les maquettes et en extraire les besoins fonctionnels
- Identifier les questions à clarifier avec le commanditaire (Ilaria)
- Faire une veille technique sur les librairies ou solutions à évaluer

---

### Project Manager

**Rôle** : Crée et maintient les documents de spécifications (PRD, Backlog). Définit les exigences fonctionnelles, les critères d'acceptation et la roadmap du projet.

**Quand l'utiliser** : Pour rédiger ou mettre à jour le backlog, créer des User Stories, prioriser les sprints.

**Exemples de tâches** :
- Rédiger de nouvelles User Stories dans `BACKLOG.md`
- Affiner les critères d'acceptance d'une US existante
- Mettre à jour le sprint board et l'historique
- Identifier les incohérences entre User Stories

---

### Architect

**Rôle** : Conçoit l'architecture technique du système. Définit les technologies, les patterns de conception et la structure globale de l'application.

**Quand l'utiliser** : Pour les décisions structurantes (choix de librairie, organisation du code, modèles de données, patterns d'API).

**Fichier de référence** : [`ARCHITECTURE.md`](./ARCHITECTURE.md)

**Exemples de tâches** :
- Définir la structure d'un nouveau store Pinia
- Choisir entre plusieurs approches techniques (ex: librairie slider pour Top Columnist)
- Concevoir le schéma de données pour une nouvelle fonctionnalité (ex: Newsletter, Tags)
- Rédiger ou mettre à jour `ARCHITECTURE.md`

---

### UX Designer

**Rôle** : Conçoit l'expérience utilisateur, analyse les maquettes et garantit l'ergonomie et l'accessibilité de l'interface.

**Quand l'utiliser** : Pour interpréter les maquettes, identifier les problèmes UX/accessibilité, définir les comportements d'interaction.

**Exemples de tâches** :
- Analyser une section des maquettes et en extraire le design en critères d'acceptance
- Identifier les problèmes d'accessibilité (contrastes, tailles de texte, navigation clavier)
- Proposer des alternatives de design conformes WCAG quand les maquettes posent problème

---

## Agents d'exécution

### Developer

**Rôle** : Implémente les fonctionnalités selon les spécifications et l'architecture définie, en suivant les bonnes pratiques du stack (Nuxt 4, Vue 3, Pinia, TypeScript, Tailwind).

**Quand l'utiliser** : En mode **pilotage automatique** — quand tu veux que l'agent écrive le code directement.

**Exemples de tâches** :
- Créer un nouveau composant Vue à partir d'une User Story
- Implémenter une route API Nitro
- Ajouter une action dans un store Pinia
- Enrichir les mock data dans `site-content.ts`

---

### QA

**Rôle** : Assure la qualité du code, vérifie la conformité aux critères d'acceptance et écrit les scripts de tests.

**Quand l'utiliser** : Pour écrire les tests unitaires et d'intégration, ou pour vérifier qu'une implémentation couvre tous les critères d'acceptance.

**Exemples de tâches** :
- Écrire les tests unitaires Vitest pour un composant Vue
- Écrire les tests d'intégration pour un store Pinia ou une route API
- Vérifier que tous les critères d'acceptance d'une US sont couverts par des tests
- Analyser les résultats de `make test` et identifier les échecs

---

## Agents d'orchestration

### Scrum Master

**Rôle** : Orchestre le cycle de développement. Génère les User Stories détaillées, coordonne les sprints et s'assure que le backlog est à jour et cohérent.

**Quand l'utiliser** : En début de sprint, pour planifier les US à traiter, ou après une session de travail pour mettre à jour le sprint board.

**Exemples de tâches** :
- Préparer le sprint suivant (sélectionner et ordonner les US)
- Détecter les dépendances entre User Stories
- Mettre à jour le tableau de sprint et le changelog dans `BACKLOG.md`
- S'assurer que les US sont "prêtes" (critères d'acceptance complets) avant implémentation

---

### Orchestrator

**Rôle** : Guide général et point d'entrée. Aide à naviguer dans le workflow BMAD, oriente vers le bon agent selon la nature de la tâche, et maintient la cohérence globale du projet.

**Quand l'utiliser** : Quand tu ne sais pas quel agent solliciter, ou au début d'une session de travail pour cadrer ce qui doit être fait.

**Exemples de tâches** :
- Faire le point sur l'avancement du projet
- Décider par où commencer une nouvelle session
- S'assurer de la cohérence entre le backlog, l'architecture et le code implémenté

---

## Agent pédagogique

### AI Mentor *(mode pilotage manuel)*

**Rôle** : Tuteur en développement logiciel. Accompagne le développeur pendant les sessions où **c'est lui qui code directement**. L'AI Mentor ne génère jamais de code complet — il guide, pose des questions, donne des indices, et laisse le développeur trouver la solution par lui-même.

**Quand l'utiliser** : Quand tu veux pratiquer le code toi-même plutôt que de laisser l'agent l'écrire. Idéal pour consolider les apprentissages sur un concept ou une technologie du stack.

**Comment l'activer** : Dire explicitement "mets-toi en mode AI Mentor" en début de session. Le comportement de l'agent bascule alors selon le prompt défini dans [`AI-Mentor-Prompt.md`](./AI-Mentor-Prompt.md).

**Principes clés** :
- Méthode socratique : questions plutôt que réponses
- Un indice à la fois, étape par étape
- Jamais de bloc de code complet (fragments de 1-3 lignes maximum pour illustrer un concept)
- Encourage le raisonnement, pas juste le résultat
- Valide ou oriente sans corriger directement

**Exemples de sessions** :
- Implémenter un composant Vue de A à Z, guidé par des questions
- Débugger une erreur par déduction plutôt que par copier-coller de solution
- Comprendre un concept (ex: réactivité Vue, async/await, TypeScript generics) par la pratique

**Analogie** : C'est le passage du pilotage automatique au pilotage manuel. L'avion (le projet) avance dans les deux cas — mais dans un cas tu pilotes toi-même et tu apprends à voler, dans l'autre l'agent pilote pendant que tu supervises.

**Référence** : Voir [`AI-Mentor-Prompt.md`](./AI-Mentor-Prompt.md) pour le prompt complet et la science pédagogique derrière cette approche (étude Harvard PS2 Pal, 2025).

---

## Récapitulatif

| Agent | Catégorie | Mode | Fichiers de référence |
|-------|-----------|------|-----------------------|
| Analyst | Conception | Automatique | - |
| Project Manager | Conception | Automatique | `BACKLOG.md` |
| Architect | Conception | Automatique | `ARCHITECTURE.md` |
| UX Designer | Conception | Automatique | Maquettes |
| Developer | Exécution | Automatique | `BACKLOG.md`, `ARCHITECTURE.md` |
| QA | Exécution | Automatique | `BACKLOG.md`, tests existants |
| Scrum Master | Orchestration | Automatique | `BACKLOG.md` |
| Orchestrator | Orchestration | Automatique | Tous |
| **AI Mentor** | **Pédagogique** | **Manuel** | `AI-Mentor-Prompt.md` |
