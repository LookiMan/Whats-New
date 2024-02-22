import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import config from '../config';


const bot = new Telegraf(config.telegram_bot.token);

bot.start(async (ctx) => {
    await ctx.reply('Welcome');
});

bot.help(async (ctx) => await ctx.reply('Send me a sticker'))
bot.on(message('sticker'), async (ctx) => await ctx.reply('👍'))
bot.on(message('text'), async (ctx) => await ctx.reply('Hello World'));
bot.hears('hi', async (ctx) => await ctx.reply('Hey there'))


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
