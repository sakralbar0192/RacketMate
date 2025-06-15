-- Создаем нового пользователя
CREATE USER dukhov WITH PASSWORD 'dukhov';

-- Даем права на базу racket_mate
GRANT ALL PRIVILEGES ON DATABASE racket_mate TO dukhov;

-- Для существующих таблиц (выполнится после init.sql)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO dukhov;