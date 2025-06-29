# Базовый образ с предустановленным Git
FROM oven/bun:latest AS base

# Установка Git в базовый образ
RUN apt-get update && \
    apt-get install -y git ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    git --version

# Этап 1: Сборка (общий для dev и prod)
FROM base AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

# Этап 2: Development (с исходниками и watcher)
FROM base AS dev
WORKDIR /app
COPY --from=builder /app .
CMD ["bun", "run", "dev"]

# Этап 3: Production
FROM base AS prod
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .
CMD ["bun", "run", "start"]