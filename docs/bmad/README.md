# BMAD - BMad Agentic Development Method

*Documentation BMAD pour le projet News Ipsum (Ilaria Digital School)*

---

## Qu'est-ce que BMAD ?

BMAD est une méthodologie de développement qui structure la collaboration entre un développeur et une IA en définissant des **personas**, des **documents** et des **workflows** clairs.

---

## Structure des documents

| Document | Description | Statut |
|----------|-------------|--------|
| [PRD.md](./PRD.md) | Product Requirements Document - Vision produit et features | 🟡 En cours |
| [BACKLOG.md](./BACKLOG.md) | User Stories et tâches priorisées | 🟡 En cours |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Décisions techniques et patterns | 🟡 En cours |

---

## Personas IA disponibles

Lors des sessions de développement, l'IA peut adopter différents rôles :

### 🎯 Product Manager (PM)
- Définir les requirements
- Prioriser les features
- Rédiger les user stories
- Valider les critères d'acceptance

### 🏗️ Architect
- Designer l'architecture
- Choisir les patterns
- Documenter les décisions techniques
- Anticiper la scalabilité

### 💻 Developer
- Implémenter les features
- Écrire le code
- Résoudre les bugs
- Refactorer

### 🧪 QA Engineer
- Écrire les tests
- Valider les critères d'acceptance
- Identifier les edge cases
- Documenter les bugs

---

## Workflow BMAD pour News Ipsum

```
1. DISCOVERY (PM mode)
   └── Définir la feature dans PRD.md
   
2. DESIGN (Architect mode)
   └── Documenter l'approche dans ARCHITECTURE.md
   
3. PLANNING (PM mode)
   └── Créer les user stories dans BACKLOG.md
   
4. DEVELOPMENT (Developer mode)
   └── Implémenter story par story
   
5. TESTING (QA mode)
   └── Valider et documenter
```

---

## Comment utiliser BMAD dans ce projet

### Démarrer une nouvelle feature

1. **Décrire le besoin** (mode PM)
   ```
   "Je veux ajouter [feature]. Peux-tu m'aider à définir les requirements ?"
   ```

2. **Designer la solution** (mode Architect)
   ```
   "Comment architecturer cette feature ? Quels sont les composants nécessaires ?"
   ```

3. **Planifier les tâches** (mode PM)
   ```
   "Crée les user stories pour cette feature"
   ```

4. **Implémenter** (mode Developer)
   ```
   "Implémente la story [X]"
   ```

### Changer de persona explicitement

```
"Passe en mode [PM/Architect/Developer/QA] et [demande]"
```

---

## Historique

| Date | Action | Auteur |
|------|--------|--------|
| 2026-02-25 | Création de la structure BMAD | Dylan |

