import { Markup, Scenes, session, Telegraf } from 'telegraf'
import profileSetup from './scenes/profile-setup/index.ts'
import { type botContext } from './types/context.ts'
import User from '../db/models/User.ts'
import { config } from 'dotenv';

config(); // Загружает .env в process.env

// Проверка, что переменные существуют
const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  throw new Error('BOT_TOKEN не указан в .env!');
}

console.log('Bot ready with token:', botToken.slice(0, 5) + '...'); // Частичный вывод для безопасности

//TODO Реализовать /help
// bot.help((ctx) => ctx.reply('Send me a sticker'))

const bot = new Telegraf<botContext>(botToken)

// Настройка сцен
const stage = new Scenes.Stage([ profileSetup ])
bot.use(session())
bot.use(stage.middleware())

// Команда /start
bot.command('start', async (ctx) => {
  try {
    // Проверяем сохранен ли такой пользователь в базе данных
    let currentUser = await User.findByPk(ctx.update.message.from.id)
    if (!currentUser) {
      currentUser = await User.create({
        id: ctx.update.message.from.id,
        first_name: ctx.update.message.from.first_name,
        username: ctx.update.message.from.username
      })
    }
  } catch (e) {
    console.log('Error', e)
  }

  await ctx.reply(
    'Добро пожаловать! Давайте настроим ваш профиль.',
    Markup.keyboard([ 'Настроить профиль' ]).resize()
  )
})

// Обработка кнопки "Настроить профиль"
bot.hears('Настроить профиль', (ctx) => ctx.scene.enter('profile-setup'))
bot.hears('Редактировать профиль', (ctx) => ctx.scene.enter('profile-edit'))
bot.hears('Искать игры', (ctx) => ctx.reply('ПОИСК..'))


// Запуск бота
bot.launch()
console.log('Бот запущен!')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))