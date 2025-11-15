# Makefile
COMPOSE_FILES = -f docker-compose.yml -f docker-compose.dev.yml

# Commande par défaut pour le développement (utilise les deux fichiers)
dev:
	docker compose $(COMPOSE_FILES) up --build

# Commande pour la production (utilise SEULEMENT la base)
# Note: Sur le serveur, vous pouvez utiliser 'docker compose up --build' sans le -f.
prod-no-log:
	docker compose -f docker-compose.yml up --build -d

prod-log:
	docker compose -f docker-compose.yml up --build

# Commande pour arrêter tous les services
down:
	docker compose $(COMPOSE_FILES) down -v