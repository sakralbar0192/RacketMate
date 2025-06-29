import { Sequelize } from 'sequelize'
import { config } from 'dotenv';

config(); // Загружает .env в process.env

// Проверка, что переменные существуют
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL не указан в .env!');
}

const sequelize = new Sequelize(databaseUrl)

try {
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

export default sequelize