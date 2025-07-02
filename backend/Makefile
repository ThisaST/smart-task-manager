.PHONY: help dev prod build up down clean logs db pgadmin test lint

# Default target
help: ## Show this help message
	@echo "Task Manager Backend - Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker commands
dev: ## Start development environment with hot reload
	docker compose up postgres api-dev

prod: ## Start production environment
	docker compose --profile production up postgres api

build: ## Build Docker images
	docker compose build

up: ## Start all services
	docker compose up

down: ## Stop all services
	docker compose down

clean: ## Clean up containers, volumes, and images
	docker compose down -v --rmi all
	docker system prune -f

logs: ## Show logs from all services
	docker compose logs -f

db: ## Start only PostgreSQL database
	docker compose up postgres

pgadmin: ## Start database with pgAdmin
	docker compose --profile tools up postgres pgadmin

# Development commands
install: ## Install dependencies
	npm install

test: ## Run tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-coverage: ## Run tests with coverage
	npm run test:coverage

lint: ## Run linter
	npm run lint

lint-fix: ## Run linter with auto-fix
	npm run lint:fix

# Database commands
db-generate: ## Generate Prisma client
	npx prisma generate

db-migrate: ## Run database migrations
	npx prisma migrate dev

db-push: ## Push schema to database
	npx prisma db push

db-studio: ## Open Prisma studio
	npx prisma studio

# Utility commands
setup: install db-generate ## Setup project (install + generate)

reset: clean install build ## Reset everything and rebuild

status: ## Show Docker container status
	docker compose ps

shell: ## Open shell in API container
	docker compose exec api-dev sh

db-shell: ## Open PostgreSQL shell
	docker compose exec postgres psql -U postgres -d task_manager_dev 