import { Between } from "typeorm"
import { Not } from "typeorm";
import { IsNull } from "typeorm";

import { bot } from "./bot";
import { Post } from "./models/Post";
import { Summary } from "./models/Summary";
import { SummaryChunk } from "./models/SummaryChunk";
import { SummaryChunkItem } from "./models/SummaryChunkItem";
import { User } from "./models/User";
import { generateSummary } from "./summary";
import { formatDate } from "./utils";
import { formatSummary } from "./utils";
import { notifyAdmins } from "./utils";
import { splitSummary } from "./utils";
import { replaceMarkdownWithHTML } from "./utils";
import type { SummaryPost } from "./types/post.type";

import dataSource from "./data-source";
import Logger from "./logger";


const logger = Logger.getInstance("tasks");


async function createSummaryPostTask(startDate: Date, endDate: Date, summaryLabel: string): Promise<void> {

    notifyAdmins('<i>⚙️ Початок створення підсумків...</i>');

    const posts: Post[] = await dataSource.getRepository(Post).find({
        select: {
            'text': true
        },
        where: {
            postDate: Between(formatDate(startDate), formatDate(endDate)),
            text: Not(IsNull()),
            isDeleted: false,
        }
    });

    const summary = new Summary();
    summary.label = summaryLabel;

    if (posts) {
        try {
            summary.rawText = replaceMarkdownWithHTML(await generateSummary(posts as SummaryPost[]));
        } catch (error: any) {
            logger.error(error);

            notifyAdmins(`<b>⚠️ При створенні підсумків виникла помилка:</b> <pre>${error}</pre>`);
            
            setTimeout(async () => {
                await createSummaryPostTask(startDate, endDate, summaryLabel);
            }, 60 * 1000);
            return;
        }

        for (const chunkText of splitSummary(summary.rawText)) {
            const text = chunkText.trim();
            const match = text.match(/<b>(.*?)<\/b>/);
            const label = match ? match[1].replace(":", "") : "Інші новини";
            const chunk = new SummaryChunk(label, text);

            const items = chunkText.match(/-(.+?)[\r\n\.]/g) || [];
            for (const item of items) {
                const chunkItem = new SummaryChunkItem(item.trim());
                await dataSource.manager.save(chunkItem);

                if (!chunk.items) {
                    chunk.items = [chunkItem];
                } else {
                    chunk.items.push(chunkItem);
                }
            }

            await dataSource.manager.save(chunk);

            if (!summary.chunks) {
                summary.chunks = [chunk];
            } else {
                summary.chunks.push(chunk);
            }
        }

    } else {
        summary.rawText = "Поки не відбулося жодних новин🙄";
        summary.chunks = [];
    }

    await dataSource.manager.save(summary);
}


export async function createNightlySummaryPostTask(): Promise<void> {
    const START_HOUR = 21;
    const END_HOUR = 9;

    const label = `🌙 <i>Нічні новини за ${START_HOUR}:00 - ${END_HOUR}:00</i>`;

    const endDate = new Date();
    endDate.setHours(END_HOUR, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 1);
    startDate.setHours(START_HOUR, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate, label);
}


export async function createMorningSummaryPostTask(): Promise<void> {
    const START_HOUR = 9;
    const END_HOUR = 12;

    const label =  `☕️ <i>Ранкові новини за ${START_HOUR}:00 - ${END_HOUR}:00</i>`;

    const startDate = new Date();
    startDate.setHours(START_HOUR, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(END_HOUR, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate, label);
}


export async function createLunchSummaryPostTask(): Promise<void> {
    const START_HOUR = 12;
    const END_HOUR = 15;

    const label = `🍝 <i>Обідні новини за ${START_HOUR}:00 - ${END_HOUR}:00</i>`;

    const startDate = new Date();
    startDate.setHours(START_HOUR, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(END_HOUR, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate, label);
}


export async function createEveningSummaryPostTask(): Promise<void> {
    const START_HOUR = 15;
    const END_HOUR = 21;

    const label = `🥱 <i>Вечірні новини за ${START_HOUR}:00 - ${END_HOUR}:00</i>`;

    const startDate = new Date();
    startDate.setHours(START_HOUR, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(END_HOUR, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate, label);
}


export async function sendSummaryPostTask(): Promise<void> {
    const summary = await dataSource.getRepository(Summary).findOne({
        relations: {
            chunks: {
                items: true,
            },
        },
        where: {
            isSubmitted: false,
        },
    });

    if (!summary) {
        return;
    }

    const label = summary.label;

    if (!summary.chunks) {
        notifyAdmins(`${label} - відсутні блоки новин для розсилки.\n\n⚠️ Розсилка неможлива`);
        return;
    }

    summary.isSubmitted = true;

    await dataSource.manager.save(summary);

    const users = await dataSource.getRepository(User).find({
        select: {
            'userId': true
        },
    });

    for (const user of users) {
        for (const chunk of summary.chunks) {
            if (chunk.isEmpty()) {
                continue;
            }

            try {
                await bot.telegram.sendMessage(user.userId, formatSummary(chunk), {
                    parse_mode: "HTML",
                    disable_notification: false,
                });
            } catch (error: any) {
                logger.error(error);
            }
        }

        await bot.telegram.sendMessage(user.userId, label, {parse_mode: "HTML"});
    }
}
