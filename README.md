# Ilaria Digital School - News Ipsum

This is a project designed for Ilaria School's Final Program: 

A news website featuring a variety of
content, such as articles, interviews, and reports. The site must offer an optimal user experience
on devices of different sizes (smartphones, tablets, desktop computers)
and comply with web accessibility principles so that it can be used by people
with various types of disabilities.

# Under the hood

I've built a basic structure using tools for creating modern applications: **Nuxt 3**, **MongoDB**, and **Docker**.  
It includes a complete, ready-to-use environment for development and production.

## 🧱 Technical stack

- **Nuxt 3 / Vue 3** — Integrated frontend + backend framework (server-side API)
- **Tailwind CSS** — Fast and modern styling
- **MongoDB** — NoSQL database
- **Mongoose** *(optional)* — ODM to simplify MongoDB model and query management
- **Docker & Docker Compose** — Containerization and orchestration
- **Node.js 18+** — JavaScript runtime environment

---

## ⚙️ Install & Start

### 1. Clone the repo

```bash
git clone https://github.com/dtettarasar/news-ipsum.git
cd news-ipsum
```

### 2. Setup the .env file

Before launching the project, you must create a .env file at the root of the project.This file contains all the variables needed to connect Docker services (MongoDB, Mongo Express, etc.).

#### Example of an .env file (development environment)

```bash
# --- MongoDB ---
MONGO_INITDB_ROOT_USERNAME="admin"
MONGO_INITDB_ROOT_PASSWORD="Ilaria1234!!"
MONGO_DB_NAME="new_ipsum"
MONGO_DB_URI="mongodb://admin:Ilaria1234!!@mongodb:27017/"

# --- Mongo Express (for dev mode) ---
ME_CONFIG_BASICAUTH_USERNAME="devadmin"
ME_CONFIG_BASICAUTH_PASSWORD="devsecret"
```

- MONGO_INITDB_ROOT_USERNAME : MongoDB root username used during initialization.
- MONGO_INITDB_ROOT_PASSWORD : MongoDB root account password.
- MONGO_DB_NAME : Name of the database used by the application.
- MONGO_DB_URI : Full connection URI to MongoDB. Used by dependent services (Nuxt, Mongo Express).
- ME_CONFIG_BASICAUTH_USERNAME : Mongo Express interface login ID.
- ME_CONFIG_BASICAUTH_PASSWORD : Mongo Express password.

#### Important notes

**Mongo Express is reserved for local development.**
It must never be activated in production (risk of security breach).
The service is configured to be deployed only in the development environment.

**The identifiers “devadmin / devsecret” are examples for local use.**
You can change them freely, but keep them simple for your local environment.

**In production**, the application does not depend on Mongo Express.
Only MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD, MONGO_DB_NAME, and MONGO_DB_URI are required.

### 3. Start Docker

```bash
docker compose up --build
```

This will start: 

- the Nuxt server on http://localhost:3000
- MongoDB Service on port 27017

## Useful Docker commands

**docker compose up**: start the containers

**docker compose down**: stop and delete containers

**docker ps**: list active containers

**docker exec -it mongodb bash**: open MongoDB container terminal

**docker exec -it nuxt-app bash**: open Nuxt App container terminal 

📝 Note: If `bash` is not available in the container, use `sh` instead:

```bash
docker exec -it mongodb sh
```


