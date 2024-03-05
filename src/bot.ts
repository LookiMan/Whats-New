import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { db } from "./data-source";
import { Summary } from "./models/Summary";
import { SummaryReaction } from "./models/SummaryReaction";
import { SummaryTheme } from "./models/SummaryTheme";
import { User } from "./models/User";

import config from "./config";


const bot = new Telegraf(config.telegram_bot.token);

bot.start(async (ctx) => {
    let user = await db.manager.findOneBy(User, { userId: ctx.from.id });

    if (!user) {
        user = new User();
        user.userId = ctx.from.id;
        user.firstName = ctx.from.first_name;
        user.lastName = ctx.from.last_name;
        user.username = ctx.from.username;
        await db.manager.save(user);
    }
    
    ctx.reply("Привіт 👋 Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00");
});

bot.on(message("text"), (ctx) => ctx.reply("Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00")); // NOTE: Можна підраховувати час до найближчих новин і його відображати типу: ⚠️ До обідніх новин залишилось 1 година 27 хвилин

bot.on("callback_query", async (ctx) => {
    const [action, id] = ctx.update.callback_query.data.split(":");

    console.log(action, id)

    if (action === "approve") {
        const summary = await db.manager.findOneBy(Summary, {id});
        if (!summary ) {
            return;
        }

        summary.isApproved = true;

        await db.manager.save(summary);

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
    } else if (action === "approved") {
        await bot.telegram.answerCbQuery(ctx.update.callback_query.id, "⚠️ Публікацію вже підтверджено");
    } else if (action === "reaction") {
        const [status, themeId] = id.split("-");

        let user = await db.manager.findOneBy(User, { userId: ctx?.from?.id });
        if (!user) {
            user = new User();
            user.userId = ctx?.from?.id;
            user.firstName = ctx?.from?.first_name;
            user.lastName = ctx?.from?.last_name;
            user.username = ctx?.from?.username;
            await db.manager.save(user);
        }

        const theme = await db.manager.findOneBy(SummaryTheme, { id: themeId });
        if (!theme) {
            return
        }

        await bot.telegram.answerCbQuery(ctx.update.callback_query.id, "😎 Дякуємо за зворотний зв'язок");

        const reaction = new SummaryReaction(user, theme, status);
        await db.manager.save(reaction);
    }
});


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


export { bot }
