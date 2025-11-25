.PHONY: help build start stop restart logs status clean setup wp-shell db-shell

# Default target
help:
	@echo "WordPress + Next.js Headless Stack"
	@echo ""
	@echo "Available commands:"
	@echo "  make build      - Build all images"
	@echo "  make start      - Start all services"
	@echo "  make stop       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - Show logs"
	@echo "  make status     - Show status"
	@echo "  make clean      - Remove all containers and volumes"
	@echo "  make setup      - Run WordPress setup"
	@echo "  make wp-shell   - Open shell in WordPress container"
	@echo "  make db-shell   - Open MySQL shell"
	@echo ""

# Build all images
build:
	docker compose build

# Start services
start:
	docker compose up -d mariadb
	@echo "Waiting for MariaDB..."
	@sleep 10
	docker compose up -d wordpress
	@echo "Waiting for WordPress..."
	@sleep 15
	docker compose up wordpress-init
	@echo "Setup complete! Credentials in shared/.env.nextjs"

# Start with Next.js
start-all:
	docker compose --profile with-nextjs up -d

# Stop services
stop:
	docker compose --profile with-nextjs down

# Restart services
restart: stop start

# Show logs
logs:
	docker compose logs -f

# Show logs for specific service
logs-wp:
	docker compose logs -f wordpress

logs-db:
	docker compose logs -f mariadb

logs-next:
	docker compose logs -f nextjs

# Show status
status:
	docker compose ps

# Clean everything
clean:
	docker compose --profile with-nextjs down -v
	rm -rf shared/.env.nextjs

# Run setup only
setup:
	docker compose up wordpress-init

# Open shell in WordPress container
wp-shell:
	docker compose exec wordpress bash

# Open MySQL shell
db-shell:
	docker compose exec mariadb mysql -uwordpress -p

# WP-CLI commands
wp-cli:
	docker compose exec wordpress wp --allow-root $(CMD)

# Create production env file
prod-env:
	@echo "Creating production environment..."
	@cp .env.example .env.production
	@echo "Please edit .env.production with your production values"

# Backup database
backup:
	@mkdir -p backups
	docker compose exec mariadb mysqldump -uroot -p$$(grep DB_ROOT_PASSWORD .env | cut -d= -f2) wordpress > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/"

# Restore database
restore:
	@if [ -z "$(FILE)" ]; then echo "Usage: make restore FILE=backups/backup.sql"; exit 1; fi
	docker compose exec -T mariadb mysql -uroot -p$$(grep DB_ROOT_PASSWORD .env | cut -d= -f2) wordpress < $(FILE)
	@echo "Database restored from $(FILE)"
