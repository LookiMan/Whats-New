import { Between } from "typeorm"
import { Not } from "typeorm";
import { IsNull } from "typeorm";

import { bot } from "./bot";
import { Post } from "./models/Post";
import { Summary } from "./models/Summary";
import { SummaryChunk } from "./models/SummaryChunk";
import { SummaryTheme } from "./models/SummaryTheme";
import { User } from "./models/User";
import { generateSummary } from "./summary";
import { formatDate } from "./utils";
import { formatSummary } from "./utils";

import dataSource from "./data-source";


async function createSummaryPostTask(startDate: Date, endDate: Date, summaryLabel: string): Promise<void> {
    const posts = await dataSource.getRepository(Post).find({
        select: {
            'text': true
        },
        where: {
            postDate: Between(formatDate(startDate), formatDate(endDate)),
            text: Not(IsNull()),
        }
    });

    const summary = new Summary();
    summary.label = summaryLabel;

    if (posts) {
        summary.rawText = await generateSummary(posts);
        
        for (const chunkText of summary.rawText.split(':DELIMITER:')) {
            const chunk = new SummaryChunk(chunkText.trim());
            const match = chunk.text.match(/<b>(.*?)<\/b>/);
            const label = match ? match[1].replace(":", "") : "Інші";
            const theme = await dataSource.manager.findOneBy(SummaryTheme, { label });

            if (theme) {
                chunk.theme = theme;
            } else {
                const theme = new SummaryTheme(label);
                await dataSource.manager.save(theme);
                chunk.theme = theme;
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

    await dataSource.manager.save(summary);

    const users = await dataSource.getRepository(User).find({
        select: {
            'userId': true
        },
    });

    const label = summary.label;

    for (const user of users) {
        for (const [index, chunk] of summary.chunks.entries()) {
            try {
                bot.telegram.sendMessage(user.userId, formatSummary(label, chunk.text), {
                    parse_mode: "HTML",
                    disable_notification: index !== summary.chunks.length - 1,
                });
            } catch (error: any) {
                console.log(error);
                // TODO: process sending error
            }
        }
    }
}
