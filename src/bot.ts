import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { AppDataSource } from "./data-source";
import { User } from "./models/User";

import config from "./config";


const bot = new Telegraf(config.telegram_bot.token);

bot.start(async (ctx) => {
    const user = await AppDataSource.manager.findOneBy(User, { userId: ctx.from.id });

    if (!user) {
        const user = new User();
        user.userId = ctx.from.id;
        user.firstName = ctx.from.first_name;
        user.lastName = ctx.from.last_name;
        user.username = ctx.from.username;
        await AppDataSource.manager.save(user);
    }
    
    ctx.reply("Welcome");
});

bot.on(message("text"), (ctx) => ctx.reply("Hello World"));


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


export { bot }
