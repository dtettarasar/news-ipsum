# ----- DEV MODE -----

COMPOSE_DEV = -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE_PROD = -f docker-compose.yml

dev:
	docker compose $(COMPOSE_DEV) up --build

dev-down:
	docker compose $(COMPOSE_DEV) down -v


# ----- PROD MODE -----

# Rebuild uniquement Nuxt (flow normal, recommandé)
prod-nuxt:
	docker compose $(COMPOSE_PROD) up -d --build nuxt-app

prod-nuxt-log:
	docker compose $(COMPOSE_PROD) up --build nuxt-app


# Rebuild tout le stack (rare, uniquement en cas de MAJ Caddy/Mongo)
prod-all:
	docker compose $(COMPOSE_PROD) up -d --build

prod-all-log:
	docker compose $(COMPOSE_PROD) up --build


# ----- DOWN -----

down:
	docker compose $(COMPOSE_PROD) down