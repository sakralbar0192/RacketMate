# Базовый образ с Bun
FROM oven/bun:latest

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package.json .
RUN bun install

# Копируем остальные файлы
COPY . .

# Запускаем бота
CMD ["bun", "run", "dev"]