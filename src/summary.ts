import { formatSummary } from "./utils";
import { telebot } from "./app";
import { Summary } from "./models/Summary";
import { User } from "./models/User";
import type { SummaryPost } from "./types/post.type";

import config from "./config";
import dataSource from "./data-source";
import Logger from "./logger";

const { VertexAI } = require("@google-cloud/vertexai");
const logger = Logger.getInstance("summary");

function delay(seconds: number) {
    return new Promise( resolve => setTimeout(resolve, seconds * 1000) );
}

function groupPosts(posts: SummaryPost[], maxBlockSize: number): string[] {
    let result: string[] = [];
    let currentBlock: string[] = [];
    let currentBlockSize = 0;

    for (const post of posts) {
        const textLength = post.text.length;
        const text = `/#MID: ${post.id} /#; /#MESSAGE: ${post.text} /#;}`

        if (currentBlockSize + textLength <= maxBlockSize) {
            currentBlock.push(text);
            currentBlockSize += textLength;
        } else {
            result.push(currentBlock.join(', '));
            currentBlock = [text];
            currentBlockSize = textLength;
        }
    }

    if (currentBlock.length > 0) {
        result.push(currentBlock.join(', '));
    }

    return result;
}

export async function generateSummary(posts: SummaryPost[]): Promise<string> {
    const vertex_ai = new VertexAI({project: config.vertex_ai.project, location: config.vertex_ai.location});

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: config.vertex_ai.model,
        generation_config: {
            "max_output_tokens": 4096,
            "temperature": 0.4,
            "top_p": 1,
            "top_k": 32
        },
    });

    const chat = generativeModel.startChat();
    await chat.sendMessage("Зараз я почну передавати новини (в форматі /#MID: ідентифікатор новини /#; /#MESSAGE: текст новини /#;) які тобі потрібно запам'ятовувати а потім треба буде підвести підсумки");
    await delay(5);

    const groups = groupPosts(posts, 4096);
    for (const group of groups) {
        await chat.sendMessage(group);
        await delay(10);
    }

    const summary = await chat.sendMessage("Завдання: Вибери найважливіші та унікальні ідентифікатори новин, які, на твою думку, найбільше відображають актуальні події. Умови: Перерахуй вибрані ідентифікатори новин через кому. Не включай до вибору рекламні матеріали, провокаційні повідомлення або новини з недостатньою корисною інформацією.");

    const response = await summary.response;

    let text: string;
    try {
        text = response.candidates[0].content.parts[0].text;
    } catch (error: any) {
        if (error instanceof TypeError && error.message.includes("is not iterable")) {
            text = response.candidates[0].content.parts.text;
        } else {
            throw error;
        }
    }

    return text;
}

export async function sendSummary(user: User, summary: Summary, params: Record<string, any>): Promise<void> {
    for (const chunk of summary.chunks) {
        if (chunk.isEmpty()) {
            continue;
        }

        try {
            await telebot.sendMessage(user.userId, formatSummary(chunk), {
                parse_mode: "HTML",
                disable_notification: params?.disable_notification,
            });
        } catch (error: any) {
            if (error instanceof Error && error.message.includes("403: Forbidden")) {
                user.isActive = false;
                user.deactivationDate = new Date();
            } else {
                logger.error(error);
            }
        }

        user.lastSummaryDate = new Date();

        await dataSource.manager.save(user);

        if (!user.isActive) {
            break;
        }
    }

    if (params?.sendLabel) {
        await telebot.sendMessage(user.userId, `<i>${summary.label}</i> ⬆️`, {parse_mode: "HTML"});
    }
}
