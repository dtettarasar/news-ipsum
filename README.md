# Ilaria Digital School - News Ipsum

This is a project designed for Ilaria School's Final Program: 

A news website featuring a variety of
content, such as articles, interviews, and reports. The site must offer an optimal user experience
on devices of different sizes (smartphones, tablets, desktop computers)
and comply with web accessibility principles so that it can be used by people
with various types of disabilities.


## 🧩 Planned Features

- 🔐 Authentication system for the back office
- 🧠 Markdown-based content management
- 🖼️ Media upload and image optimization
- 🗃️ Project categories and filtering
- 🚀 **SEO-Friendly Architecture (thanks to Nuxt JS)** — Server-side rendering (SSR) for optimized search engine visibility.
- ♿ **Accessibility**: Full WCAG-compliant experience for inclusive reading.
- 🔗 **Web3 (Future)**: Blockchain-backed article authenticity and signatures.
- 📨 Mailer service integration (NodeMailer or similar)

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

**Prerequisites**

- **Docker & Docker Compose** installed
- **Node.js** (optional, if you want to run Nuxt locally, but recommended for tooling)
- **Make** (Required for executing development/production commands via the `Makefile`)

### Installing Make

The project uses a `Makefile` to simplify Docker commands. You must have **Make** installed on your system.

| OS | Installation Instructions |
| :--- | :--- |
| **macOS** | Included with **Xcode Command Line Tools**. If the `make` command fails, run: `xcode-select --install` |
| **Linux** | Usually pre-installed. If not, install the build tools, e.g., on Ubuntu: `sudo apt install build-essential` |
| **Windows** | Recommended via **WSL 2** (Windows Subsystem for Linux), or available through **Git Bash** (included with Git for Windows). |


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

## 🐳 Docker Environments and Deployment

This project uses Docker Compose with two separate configuration files for clear separation:
* **`docker-compose.yml`**: Defines the essential services for **Production** (Nuxt App, MongoDB).
* **`docker-compose.dev.yml`**: A configuration override that adds **Development** features (Hot Reload volumes, Mongo Express).

### ⚙️ Local Development (Hot Reload & DB Admin)

Use the `make dev` command to run the environment locally. It automatically uses both configuration files.

**Command:**

~~~
make dev
~~~

### 🚀 Production Deployment (Secure & Optimized)

In production, Mongo Express is disabled, the Nuxt application is served from its compiled .output files, and code volumes are omitted for security and performance.

You can launch the production environment using the Makefile (recommended for logs) or directly via Docker Compose.

**1. Launch and Attach Logs (Foreground)**

~~~
make prod-log
~~~

*Use this to check for runtime errors, typically during the first deployment.*

**2. Launch in Detached Mode (Background)**

~~~
make prod-no-log
~~~

*Use this for continuous operation on a remote server.*

### 🔄 Other Useful Docker commands

~~~
# List running containers
docker compose ps

# Stream logs from the production stack (use this if prod-no-log is running)
docker compose -f docker-compose.yml logs -f

# Stop and remove containers and volumes for the full DEV stack
# (This includes mongo-express, even if it's currently down)
make down

# Rebuild all images from scratch (uses the DEV stack)
docker compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
~~~

## 📅 Project Status

This project is **currently under development**.
The structure and main components are being implemented progressively, and features will be added step by step.

## 💡 About the Author

I’m **Dylan Tettarasar**, a **Fullstack Developer** and former **Web Project Manager**, with a background in **digital marketing and communication**.
My goal with this project is to merge my experience in web management with my growing expertise in development — and to create a personal site that reflects my technical journey and creative side.

## 📄 License

This project is released under the **MIT License** — feel free to fork, modify, and reuse it for your own projects.

