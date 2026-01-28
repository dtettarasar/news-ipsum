# --- ÉTAPE 1: ÉTAPE DE BUILD (pour npm install et nuxt build) ---
FROM node:20 AS builder

# Définition de l'environnement
ARG NODE_ENV=production

# AJOUTER LES ARGUMENTS ICI POUR LA PROD
ARG JWT_SECRET
ARG ENCRYPTION_KEY
ARG SESSION_PASSWORD
ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD
ARG MONGO_DB_NAME

# LES TRANSFORMER EN VARIABLES D'ENVIRONNEMENT
ENV JWT_SECRET=${JWT_SECRET}
ENV ENCRYPTION_KEY=${ENCRYPTION_KEY}
ENV SESSION_PASSWORD=${SESSION_PASSWORD}
ENV MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
ENV MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
ENV MONGO_DB_NAME=${MONGO_DB_NAME}

WORKDIR /usr/src/app

# Copie et installation des dépendances
COPY package*.json ./
RUN npm install --include=dev
# RUN npm install -g nuxt # Installation globale de Nuxt CLI

# Copie du code source et build
COPY . .
RUN npm run build

# --- ÉTAPE 2: ÉTAPE DE PRODUCTION (Image Légère) ---
FROM node:20-slim

# Définition de l'environnement
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

# 1. Copie des fichiers compilés
COPY --from=builder /usr/src/app/.output /usr/src/app/.output
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

# 2. AJOUT : On récupère aussi le dossier server pour avoir accès aux modèles !
COPY --from=builder /usr/src/app/server /usr/src/app/server

# 3. On garde les scripts et la config
COPY --from=builder /usr/src/app/scripts /usr/src/app/scripts
COPY package*.json ./

# Définition du port
EXPOSE 3000

# Commande de lancement de production (Nuxt sert les fichiers construits)
CMD ["node", ".output/server/index.mjs"]