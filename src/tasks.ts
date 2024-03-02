import { Between } from "typeorm"
import { Not } from "typeorm";
import { IsNull } from "typeorm"

import { AppDataSource } from "./data-source";
import { Post } from "./models/Post";
import { Summary } from "./models/Summary";
import { User } from "./models/User";
import { generateSummary } from "./summary";
import { bot } from "./bot";


const moment = require("moment");


async function createSummaryPostTask(startDate: Date, endDate: Date): Promise<void> {
    const posts = await AppDataSource.getRepository(Post).find({
        select: {
            'text': true
        },
        where: {
            postDate: Between(
                moment(startDate).format("YYYY-MM-DD hh:mm:ss"),
                moment(endDate).format("YYYY-MM-DD hh:mm:ss"),
            ),
            text: Not(IsNull()),
        },
    });

    const summary = new Summary();

    if (posts) {
        summary.text = await generateSummary(posts);
    } else {
        summary.text = "Поки не відбулося жодних новин🙄";
    }

    await AppDataSource.manager.save(summary);
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
    const summary = await AppDataSource.getRepository(Summary).findOne({
        where: {
            isApproved: true,
            isSubmitted: false,
        },
    });

    if (!summary) {
        return;
    }

    summary.isSubmitted = true;

    await AppDataSource.manager.save(summary);

    const users = await AppDataSource.getRepository(User).find({
        select: {
            'userId': true
        },
    });

    for (const user of users) {
        try {
            bot.telegram.sendMessage(user.userId, summary.text, { parse_mode: "Markdown" });
        } catch (error: any) {
            // TODO: process sending error
        }
    }
}
