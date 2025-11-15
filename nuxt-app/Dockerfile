# --- ÉTAPE 1: ÉTAPE DE BUILD (pour npm install et nuxt build) ---
FROM node:20 AS builder

# Définition de l'environnement
ARG NODE_ENV=production

# Définition des ARGs
ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD
ARG MONGO_DB_NAME

# Utilisation des ARGs comme ENVs (pour le build)
ENV MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
ENV MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
ENV MONGO_DB_NAME=${MONGO_DB_NAME}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copie et installation des dépendances
COPY package*.json ./
RUN npm install
RUN npm install -g nuxt # Installation globale de Nuxt CLI

# Copie du code source et build
COPY . .
RUN nuxt build

# --- ÉTAPE 2: ÉTAPE DE PRODUCTION (Image Légère) ---
FROM node:20-slim

# Définition de l'environnement
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

# Copie des fichiers essentiels depuis l'étape de build
COPY --from=builder /usr/src/app/.output /usr/src/app/.output
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY package*.json ./

# Définition du port
EXPOSE 3000

# Commande de lancement de production (Nuxt sert les fichiers construits)
CMD ["node", ".output/server/index.mjs"]