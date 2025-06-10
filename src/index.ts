import { Context, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import User from './db/models/User.ts';

const bot = new Telegraf<Context>('7986827251:AAF0HnS8eDolSIzlz-19GJs5MzYIlSOh008')
bot.start(async (ctx) => {
    console.log('currentUser1');
    try {
        // Проверяем сохранен ли такой пользователь в базе данных
        let currentUser = await User.findOne({
            where: { id: ctx.update.message.from.id }
        });
        if (currentUser) {
            ctx.reply('Nice to meet you, AGAIN')
        } else {
            ctx.reply('Nice to meet you!')
            
            currentUser = await User.create({
                id: ctx.update.message.from.id,
                first_name: ctx.update.message.from.first_name,
                username: ctx.update.message.from.username
            });
        }
        console.log('currentUser', currentUser);
    } catch(e) {
        console.log('Error', e);
    }
    
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))