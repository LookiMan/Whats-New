import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { Summary } from "./models/Summary";
import { SummaryReaction } from "./models/SummaryReaction";
import { SummaryTheme } from "./models/SummaryTheme";
import { User } from "./models/User";

import config from "./config";
import dataSource from "./data-source";


const bot = new Telegraf(config.telegram_bot.token);


bot.start(async (ctx) => {
    let user = await dataSource.manager.findOneBy(User, { userId: ctx.from?.id });

    if (!user) {
        user = new User(
            ctx.from?.id,
            ctx.from?.first_name,
            ctx.from?.last_name,
            ctx.from?.username,
        );
        await dataSource.manager.save(user);
    }
    
    ctx.reply("Привіт 👋 Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00");
});


bot.on(message("text"), async (ctx) => {
    await ctx.reply("Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00")
});


bot.on("callback_query", async (ctx) => {
    // @ts-ignore: Property 'data' does not exist on type 'CallbackQuery'.
    if (!ctx.update.callback_query || !ctx.update.callback_query.data) {
        return;
    }

    // @ts-ignore: Property 'data' does not exist on type 'CallbackQuery'.
    const [action, id] = ctx.update.callback_query.data.split(":");

    if (action === "approve") {
        const summary = await dataSource.manager.findOneBy(Summary, {id});
        if (!summary) {
            return;
        }

        summary.isApproved = true;

        await dataSource.manager.save(summary);

        if (ctx.update.callback_query.message && ctx.update.callback_query.message.message_id) {
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
    } else if (action === "approved") {
        await bot.telegram.answerCbQuery(ctx.update.callback_query.id, "⚠️ Публікацію вже підтверджено");
    } else if (action === "reaction") {
        const [status, themeId] = id.split("-");
        const userId = ctx.from?.id;

        if (!userId) {
            return;
        }

        let user = await dataSource.manager.findOneBy(User, { userId });
        if (!user) {
            user = new User(
                ctx.from?.id,
                ctx.from?.first_name,
                ctx.from?.last_name,
                ctx.from?.username,
            );
            await dataSource.manager.save(user);
        }

        const theme = await dataSource.manager.findOneBy(SummaryTheme, { id: themeId });
        if (!theme) {
            return;
        }

        await bot.telegram.answerCbQuery(ctx.update.callback_query.id, "😎 Дякуємо за зворотний зв'язок");

        const reaction = new SummaryReaction(user, theme, status);
        await dataSource.manager.save(reaction);
    }
});


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


export { bot }
