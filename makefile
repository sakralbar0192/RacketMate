# Используем := для immediate assignment
DOCKER_COMPOSE := docker compose

# Phony-таргеты (не связаны с реальными файлами)
.PHONY: up stop down tear-down help

# Таргет по умолчанию (выводит help)
default: help

# Запуск контейнеров
up-dev:
	@echo "==> Building and starting docker containers..."
	$(DOCKER_COMPOSE) up -d --build

# Остановка контейнеров
stop:
	@echo "==> Stopping docker containers..."
	$(DOCKER_COMPOSE) stop

# Удаление контейнеров
down:
	@echo "==> Removing docker containers..."
	$(DOCKER_COMPOSE) down

# Показать логи
logs:
	@echo "==> Starting logs..."
	$(DOCKER_COMPOSE) logs -f bot
	
# Полная очистка
tear-down: stop down

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