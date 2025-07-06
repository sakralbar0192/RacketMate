# Используем := для immediate assignment
DOCKER_COMPOSE := docker compose

# Phony-таргеты (не связаны с реальными файлами)
.PHONY: up dev stop down tear-down help reset dev-no-cache

# Таргет по умолчанию (выводит help)
default: help

# Запуск контейнеров в режиме разработки
dev:
	@echo "==> Building and starting docker containers..."
	$(DOCKER_COMPOSE) --profile dev up --build

dev-no-cache:
	@echo "==> Building and starting docker containers..."
	$(DOCKER_COMPOSE) --profile dev up --build --force-recreate

# Запуск контейнеров в режиме деплоя
up:
	@echo "==> Building and starting docker containers..."
	$(DOCKER_COMPOSE) --profile prod up --build -d

# Остановка контейнеров
stop:
	@echo "==> Stopping docker containers..."
	$(DOCKER_COMPOSE) --profile dev stop
	$(DOCKER_COMPOSE) --profile prod stop

# Удаление контейнеров
down:
	@echo "==> Removing docker containers..."
	$(DOCKER_COMPOSE) --profile dev down
	$(DOCKER_COMPOSE) --profile prod down

# Показать логи
logs:
	@echo "==> Starting logs..."
	$(DOCKER_COMPOSE) logs -f bot-dev
	
# Полная очистка
tear-down: stop down

# Сброс всех томов и приложений
reset:
	@echo "==> Starting reset..."
	$(MAKE) tear-down
	$(MAKE) clean-docker
	$(MAKE) dev-no-cache
	$(MAKE) logs

# Сброс докера
clean-docker:
	@echo "==> Removing Racketmate containers..."
	@docker ps -a | grep racketmate | awk '{print $$1}' | xargs -r docker rm -fv || true
	@echo "==> Removing Racketmate images..."
	@docker images | grep "racketmate" | awk '{print $$3}' | xargs -r docker rmi -f || true
    
	@echo "==> Removing Racketmate volumes..."
	@docker volume ls | grep "racketmate" | awk '{print $$2}' | xargs -r docker volume rm -f || true

# Помощь
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Available targets:"
	@echo "  up         - Build and start containers"
	@echo "  stop       - Stop running containers"
	@echo "  down       - Remove containers"
	@echo "  tear-down  - Stop and remove containers"
	@echo "  help       - Show this help"