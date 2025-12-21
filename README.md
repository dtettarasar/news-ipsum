# Ilaria Digital School - News Ipsum

This is a project designed for Ilaria School's Final Program: 

A news website featuring a variety of
content, such as articles, interviews, and reports. The site must offer an optimal user experience
on devices of different sizes (smartphones, tablets, desktop computers)
and comply with web accessibility principles so that it can be used by people
with various types of disabilities.


## 🧩 Planned Features

- 🔐 **Authentication**: Secure back-office for administrators.
- 👨‍💻 **SuperUser CLI**: Dedicated script to create the first admin via terminal.
- 🧠 **Content**: Markdown-based management.
- 🖼️ Media upload and image optimization
- 🗃️ Project categories and filtering
- 🚀 **SEO-Friendly Architecture (thanks to Nuxt JS)** — Server-side rendering (SSR) for optimized search engine visibility.
- ♿ **Accessibility**: Full WCAG-compliant experience for inclusive reading.
- 🔗 **Web3 (Future)**: Blockchain-backed article authenticity and signatures.
- 📨 Mailer service integration (NodeMailer or similar)
- 🛡️ **Security**: Automated HTTPS via Caddy.

# Under the hood

I've built a basic structure using tools for creating modern applications: **Nuxt 3**, **MongoDB**, and **Docker**.  
It includes a complete, ready-to-use environment for development and production.

## 🧱 Technical stack

- **Nuxt 4 / Vue 3**: Integrated frontend + backend framework (server-side API)
- **Tailwind CSS**: Fast and modern styling
- **MongoDB**: NoSQL database
- **Mongoose** *(optional)*: ODM to simplify MongoDB model and query management
- **Docker & Docker Compose**: Containerization and orchestration
- **Node.js 18+**: JavaScript runtime environment
- **Caddy**: automated SSL

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
MONGO_INITDB_ROOT_PASSWORD="your_secure_password"
MONGO_DB_NAME="new_ipsum"
# Used by the app to connect to the DB container
MONGO_DB_URI="mongodb://admin:your_secure_password@mongodb:27017/"

# --- SEO Control ---
# Set to 'true' to allow search engines, 'false' for demo/dev (noindex)
NUXT_PUBLIC_SEO_INDEX="false"

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
- NUXT_PUBLIC_SEO_INDEX : allow search engines to index the website

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

## 🛠️ Usage with Makefile

The project uses a Makefile to simplify operations. Note: In production, we avoid rebuilding the entire stack frequently to prevent Let's Encrypt rate-limiting via Caddy.

### 💻 Development Mode

Includes Hot-Reload, Mongo Express (DB Admin), and standard HTTP.

| Command | Description |
|:-------- |:--------:|
| make dev    | Start the dev stack with logs and auto-rebuild.   |
| make dev-down     | Stop dev stack and delete all volumes (clean DB).   |

### 🚀 Production Mode

Optimized build, served via Caddy with automatic HTTPS.

| Command | Description |
|:-------- |:--------:|
| make prod-nuxt    | Recommended: Rebuild & restart only the Nuxt app (Fast & Safe).   |
| make prod-all     | Rebuild the entire stack (Nuxt, Mongo, Caddy). Use sparingly.   |
| make prod-all-log | Same as prod-all but keeps logs attached in the terminal.   |
| make down     | Gracefully stop the production stack (keeps data).   |

## 🔐 Reverse Proxy & SEO

### Caddy 

**Automatic HTTPS with Caddy**

Caddy handles SSL certificates automatically.

1. Update the Caddyfile with your domain:

~~~
your-domain.dev {
    reverse_proxy nuxt-app:3000
}
~~~

Caddy listens on ports **80/443** and forwards traffic to the internal Docker service nuxt-app running on port 3000.

2. Ensure your DNS (A/AAAA records) points to your server IP.

3. Caddy will provision certificates on the first run. **Avoid make prod-all repeatedly to stay under Let's Encrypt usage limits**.

#### Using Caddy in local development

In development, Caddy is optional.

You can simply run:

~~~
http://localhost:3000
~~~

But if you want to test Caddy locally:

**1. Create a local-only Caddyfile:**

~~~
localhost {
    reverse_proxy nuxt-app:3000
}
~~~

**2. Start with the dev Docker Compose:**

~~~
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
~~~

or

~~~
make dev
~~~

Then visit:

~~~
http://localhost
~~~

Mongo Express should be also available here: 

~~~
http://localhost:8081
~~~

### SEO

**Selective SEO Indexing**

To prevent your demo site from being indexed by Google while still showing SEO features:

- NUXT_PUBLIC_SEO_INDEX="false": Injects <meta name="robots" content="noindex, nofollow">.

- NUXT_PUBLIC_SEO_INDEX="true": Allows full indexing for production. This setting is handled via Nuxt RuntimeConfig and defaults to false for safety.

## 👤 Admin Management (CLI)

To create your first SuperUser (to access the future back-office), run this command once the containers are running:

~~~
docker compose exec nuxt-app npm run createsuperuser
~~~

*(This will prompt you for a username, email, and password directly in the terminal.)

## 📅 Project Status

This project is **currently under development**.
The structure and main components are being implemented progressively, and features will be added step by step.

## 💡 About the Author

I’m **Dylan Tettarasar**, a **Fullstack Developer** and former **Web Project Manager**, with a background in **digital marketing and communication**.
This project merges my experience in web management with modern development expertise to create a high-performance news platform.

## 📄 License

This project is released under the **MIT License** — feel free to fork, modify, and reuse it for your own projects.

