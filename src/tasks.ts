import { Between } from "typeorm"
import { Not } from "typeorm";
import { IsNull } from "typeorm"

import { bot } from "./bot";
import { db } from "./data-source";
import { Post } from "./models/Post";
import { Summary } from "./models/Summary";
import { SummaryChunk } from "./models/SummaryChunk";
import { SummaryTheme } from "./models/SummaryTheme";
import { User } from "./models/User";
import { generateSummary } from "./summary";
import { formatDate } from "./utils";


async function createSummaryPostTask(startDate: Date, endDate: Date): Promise<void> {
    const posts = await db.getRepository(Post).find({
        select: {
            'text': true
        },
        where: {
            postDate: Between(
                formatDate(startDate),
                formatDate(endDate),
            ),
            text: Not(IsNull()),
        },
    });

    const summary = new Summary();

    if (posts) {
        summary.rawText = await generateSummary(posts);
        
        for (const chunkText of summary.rawText.split(':DELIMITER:')) {
            const chunk = new SummaryChunk(chunkText.trim());
            const match = chunk.text.match(/<b>(.*?)<\/b>/);
            const label = match ? match[1].replace(":", "") : "Інші";
            const theme = await db.manager.findOneBy(SummaryTheme, { label });

            if (theme) {
                chunk.theme = theme;
            } else {
                const theme = new SummaryTheme(label);
                await db.manager.save(theme);
                chunk.theme = theme;
            }

            await db.manager.save(chunk);

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

    await db.manager.save(summary);
}


export async function createNightlySummaryPostTask(): Promise<void> {
    const endDate = new Date();
    endDate.setHours(9, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 1);
    startDate.setHours(21, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate);
}


export async function createMorningSummaryPostTask(): Promise<void> {
    const startDate = new Date();
    startDate.setHours(9, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(12, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate);
}


export async function createLunchSummaryPostTask(): Promise<void> {
    const startDate = new Date();
    startDate.setHours(12, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(15, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate);
}


export async function createEveningSummaryPostTask(): Promise<void> {
    const startDate = new Date();
    startDate.setHours(15, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(21, 0, 0, 0);

    await createSummaryPostTask(startDate, endDate);
}


export async function sendSummaryPostTask(): Promise<void> {
    const summary = await db.getRepository(Summary).findOne({
        relations: {
            chunks: {
                theme: true,
            },
        },
        where: {
            isApproved: true,
            isSubmitted: false,
        },
    });

    if (!summary) {
        return;
    }

    if (!summary.chunks) {
        // TODO: Send warning notification to administrators
        return;
    }

    summary.isSubmitted = true;

    await db.manager.save(summary);

    const users = await db.getRepository(User).find({
        select: {
            'userId': true
        },
    });

    for (const user of users) {
        for (const index in summary.chunks) {
            const chunk = summary.chunks[index];
            try {
                bot.telegram.sendMessage(user.userId, chunk.text, {
                    parse_mode: "HTML",
                    disable_notification: index != summary.chunks.length,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "👍", callback_data: `reaction:like-${chunk.theme.id}` },
                                { text: "👎", callback_data: `reaction:dislike-${chunk.theme.id}` }
                            ]
                        ]
                    }
                });
            } catch (error: any) {
                console.log(error);
                // TODO: process sending error
            }
        }
    }
}
