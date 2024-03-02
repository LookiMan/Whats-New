import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { AppDataSource } from "./data-source";
import { Summary } from "./models/Summary";
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
    
    ctx.reply("Привіт 👋 Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00");
});

bot.on(message("text"), (ctx) => ctx.reply("Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00")); // NOTE: Можна підраховувати час до найближчих новин і його відображати типу: ⚠️ До обідніх новин залишилось 1 година 27 хвилин

bot.on("callback_query", async (ctx) => {
    const [action, id] = ctx.update.callback_query.data.split(":");

    if (action === "approve") {
        const summary = await AppDataSource.manager.findOneBy(Summary, {id});
        if (!summary ) {
            return;
        }

        summary.isApproved = true;

        await AppDataSource.manager.save(summary);

        await bot.telegram.editMessageReplyMarkup(
            config.telegram_channel.id,
            ctx.update.callback_query.message.message_id,
            ctx.update.callback_query.id,
            {
                inline_keyboard: [
                    [{ text: "Публікацію підтверджено ✅", callback_data: "approved" }]
                ]
            }
        );
    }
});


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


export { bot }
