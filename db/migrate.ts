import { Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

// Инициализация Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL!);

async function runMigrations() {
  const migrationsPath = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsPath).sort();

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;
        
    // Динамический импорт для Bun
    const { up } = await import(path.join(migrationsPath, file));
    if (up) {
        await up(sequelize.getQueryInterface(), Sequelize);
    }
  }
}

runMigrations()
  .then(() => {
    console.log('All migrations completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });