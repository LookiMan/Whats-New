import { Context } from "telegraf";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { SummaryChunk } from "./models/SummaryChunk";
import { SummaryChunkItem } from "./models/SummaryChunkItem";
import { User } from "./models/User";

import { createMessage } from "./utils";
import { getNextHour } from "./utils";
import { getTimeDiff } from "./utils";
import { notifyAdmins } from "./utils";
import { renderAdminSummaryChunkMessage } from "./utils";

import config from "./config";
import dataSource from "./data-source";
import Logger from "./logger";


const bot = new Telegraf(config.telegram_bot.token);
const logger = Logger.getInstance("bot");


bot.start(async (ctx: Context) => {
    if (!ctx.from) {
        return;
    }

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

    ctx.reply(`Привіт ${ctx.from?.first_name} 👋 Очікуй короткі підсумки новин кожен день о 9:00, 12:00, 15:00 та 21:00`);
});


bot.on(message("text"), async (ctx: Context) => {
    const nextHour = getNextHour();
    const timeDiff = getTimeDiff(nextHour);
    const message = createMessage(timeDiff);
    await ctx.reply(message);
});


bot.on("callback_query", async (ctx) => {
    // @ts-ignore: Property 'data' does not exist on type 'CallbackQuery'.
    if (!ctx.update?.callback_query?.data) {
        return;
    }

    // @ts-ignore: Property 'data' does not exist on type 'CallbackQuery'.
    const [entity, action, id] = ctx.update.callback_query.data.split(":");
    
    if (entity === "summaryChunkItem") {
        const item = await dataSource.getRepository(SummaryChunkItem).findOne({
            relations: {
                chunk: true,
            },
            where: {
                id: Number(id)
            },
        });

        if (!item) {
            return;
        }

        item.isApproved = action === "include";
        await dataSource.manager.save(item);

        const chunk = await dataSource.getRepository(SummaryChunk).findOne({
            relations: {
                items: true,
            },
            where: {
                id: item.chunk.id
            },
        });

        if (!chunk) {
            return;
        }

        if (ctx.update.callback_query?.message?.message_id) {
            const message = renderAdminSummaryChunkMessage(chunk);

            try {
                await bot.telegram.editMessageText(
                    config.telegram_channel.id,
                    ctx.update.callback_query.message.message_id,
                    ctx.update.callback_query.id,
                    message.text,
                    {
                        reply_markup: message.reply_markup,
                        parse_mode: "HTML",
                    }
                );
            } catch (error: any) {
                if (error.response && error.response.error_code === 400 && error.response.description.includes("Bad Request: message is not modified")) {
                    await bot.telegram.answerCbQuery(ctx.update.callback_query.id, "⚠️ Зафіксовано повторний або одночасний клік");
                } else if (error.response && error.response.error_code === 429) {
                    notifyAdmins(`<i>⚠️ Занадто багато кліків</i>`);
                } else {
                    logger.error(error);
                }
            }
        }
    }
});


bot.catch((error: unknown, ctx: Context) => {
    logger.error(error);
});


process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


export { bot }
