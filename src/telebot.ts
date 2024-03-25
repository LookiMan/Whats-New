import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/types";
import { message } from "telegraf/filters";

import { Summary } from "./models/Summary";
import { SummaryChunk } from "./models/SummaryChunk";
import { SummaryChunkItem } from "./models/SummaryChunkItem";
import { User } from "./models/User";

import { sendSummary } from "./summary";
import { 
    createMessage,
    EMOJI_REGEX,
    getNextHour,
    getTimeDiff,
    notifyAdmins,
    renderAdminSummaryChunkMessage
} from "./utils";

import dataSource from "./data-source";
import Logger from "./logger";

class Telebot {
    protected bot: Telegraf<Context>;
    protected channelId: number; 
    protected logger: Logger;

    constructor(botToken: string, channelId: number) {
        this.channelId = channelId; 
        this.bot = new Telegraf(botToken);
        this.logger = Logger.getInstance("bot");

        this.bot.start(this.handleStart.bind(this));
        this.bot.on(message("text"), this.handleTextMessage.bind(this));
        this.bot.on("callback_query", this.handleCallbackQuery.bind(this));
        this.bot.catch(this.handleError.bind(this));

        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    }

    protected async handleStart(ctx: Context<Update.MessageUpdate>) {
        const isUserExists = await dataSource.manager.existsBy(User, { userId: ctx.from?.id });
        if (!isUserExists) {
            await this.handleNewUser(ctx);
        } else {
            const user = await dataSource.manager.findOneBy(User, { userId: ctx.from?.id });

            if (user && !user.isActive) {
                user.isActive = true;
                await dataSource.manager.save(user);
            }

            await this.handleTextMessage(ctx);
        }
    }

    protected async handleTextMessage(ctx: Context<Update.MessageUpdate>) {
        const nextHour = getNextHour();
        const timeDiff = getTimeDiff(nextHour);
        const messageText = createMessage(timeDiff);
        await ctx.reply(messageText);
    }

    protected async handleCallbackQuery(ctx: Context<Update.CallbackQueryUpdate>) {
        // @ts-ignore: Property 'data' does not exist on type 'CallbackQuery'.
        if (!ctx.update.callback_query?.data) {
            return;
        }

        // @ts-ignore: Property 'data' does not exist on type 'CallbackQuery'.
        const [entity, action, id] = ctx.update.callback_query.data.split(":");
        
        if (entity === "summaryChunkItem") {
            await this.handleSummaryChunkItem(ctx, action, id);
        }
    }

    protected async handleSummaryChunkItem(ctx: Context<Update.CallbackQueryUpdate>, action: string, id: string) {
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
                summary: true,
            },
            where: {
                id: item.chunk.id
            },
        });

        if (!chunk) {
            return;
        }

        if (ctx.update.callback_query?.message?.message_id) {
            const message = renderAdminSummaryChunkMessage(chunk, chunk.summary.label);

            try {
                await this.bot.telegram.editMessageText(
                    this.channelId,
                    ctx.update?.callback_query?.message.message_id, 
                    ctx.update?.callback_query?.id,
                    message.text,
                    {
                        reply_markup: message.reply_markup,
                        parse_mode: "HTML",
                    }
                );
            } catch (error: any) {
                if (error.response && error.response.error_code === 400 && error.response.description.includes("Bad Request: message is not modified")) {
                    await this.bot.telegram.answerCbQuery(ctx.update.callback_query.id, "⚠️ Зафіксовано повторний або одночасний клік");
                } else if (error.response && error.response.error_code === 429) {
                    notifyAdmins(`<i>⚠️ Занадто багато кліків</i>`);
                } else {
                    this.logger.error(error);
                }
            }
        }
    }

    protected handleError(error: unknown, ctx: Context) {
        this.logger.error(JSON.stringify(error));
    }

    private async handleNewUser(ctx: Context<Update.MessageUpdate>) {
        await ctx.reply(`Привіт ${ctx.from?.first_name} 👋 Очікуйте короткі підсумки новин щодня о 9:00, 12:00, 15:00 та 21:00`);

        const user = new User(
            ctx.from?.id,
            ctx.from?.first_name,
            ctx.from?.last_name,
            ctx.from?.username,
        );

        try {
            await dataSource.manager.save(user);
        } catch (error: any) {
            if (error.code === "ER_DUP_ENTRY") {
                // Ignore duplicating records
            } else {
                this.logger.error(`Error while saving user with ID ${user.userId}: ${error}`);
            }
        }

        const summary = await dataSource.getRepository(Summary).findOne({
            relations: {
                chunks: {
                    items: true,
                    summary: true,
                },
            },
            where: {
                isSubmitted: true,
            },
            order: {
                id: "DESC",
            },
        });

        if (!summary) {
            return;
        }

        const label = summary.label.replace(EMOJI_REGEX, "").trim();

        await sendSummary(user, summary, { disable_notification: true, sendLabel: false });
        await ctx.reply(`Ось останні актуальні ${label.toLowerCase()} ⬆️`);
        await this.handleTextMessage(ctx);
    }

    public async start() {
        while (true) {
            try {
                await this.bot.launch();
            } catch {
                // bot.stop();
            }
        }
    }

    public async sendMessage(userId: number, text: string, params: Record<string, any>) {
        await this.bot.telegram.sendMessage(userId, text, params);
    }
}

export default Telebot
