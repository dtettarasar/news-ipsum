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

---

## ⚙️ Install & Start

### 1. Clone the repo

```bash
git clone https://github.com/dtettarasar/news-ipsum.git
cd news-ipsum
```

### 2. Start Docker

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


