import { InlineKeyboardButton, InlineKeyboardMarkup, ParseMode } from "telegraf/types";

import { SummaryChunk } from "./models/SummaryChunk";

import { bot } from "./bot";

import config from "./config";


export function clearMessage(message: string): string {
    message = message.replace("**", "");
    return message;
}


export function formatDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000Z`);
}


export function formatSummary(chunk: SummaryChunk): string {
    const copyright = "Джерело: <a href='https://t.me/whats_new_ua_bot'>What's New Ukraine Bot</a>";
    const items: string[] = [];

    chunk.items.forEach((item, index) => {
        if (item.isApproved) {
            items.push(item.text);
        }
    });

    return `<b>${chunk.title}</b>\n\n${items.join('\n')}\n\n${copyright}`;
}


export function splitSummary(text: string): string[] {
    return text.split(/(<b>.*?<\/b>[^<]*)/g).filter(Boolean);
}


export function notifyAdmins(message: string, options?: {
    disable_notification?: boolean | undefined,
    reply_markup?: InlineKeyboardMarkup | undefined,
    parse_mode?: ParseMode | undefined
}): void {

    const params = {
        parse_mode: options?.parse_mode === undefined ? "HTML" as const : undefined,
        ...options
    };

    bot.telegram.sendMessage(config.telegram_channel.id, message, params);
}


export function getNextHour(): number {
    const currentHour = new Date().getHours();
    const hourIntervals = [9, 12, 15, 21];
    for (const hour of hourIntervals) {
        if (currentHour < hour) {
            return hour;
        }
    }
    return hourIntervals[0];
}


export function getTimeDiff(nextHour: number): number {
    const currentHour = new Date().getHours();
    return nextHour - currentHour - 1;
}


export function createMessage(timeDiff: number): string {
    if (timeDiff < 0) {
        return "Очікуй короткі підсумки новин вже завтра о 9:00";
    } else if (timeDiff === 0) {
        return "Залишилося ще трішки";
    } else {
        const timeStr = timeDiff === 1 ? "годину" : "години";
        return `Очікуй короткі підсумки новин через ${timeDiff} ${timeStr}`;
    }
}


export function renderAdminSummaryChunkMessage(chunk: SummaryChunk): {
    text: string,
    reply_markup: InlineKeyboardMarkup,
} {
    const chunkItems: string[] = [];
    const chunkButtons: InlineKeyboardButton[] = [];

    chunk.items.forEach((item, index) => {
        index += 1;
 
        if (item.isApproved) {
            chunkButtons.push({ text: `${index} ✅`, callback_data: `summaryChunkItem:exclude:${item.id}` });
            chunkItems.push(`${index} ${item.text}`);
        } else {
            chunkButtons.push({ text: `${index} 🚫`, callback_data: `summaryChunkItem:include:${item.id}` });
            chunkItems.push(`${index} <s>${item.text}</s>`);
        } 
    });

    return {
        text: `<b>${chunk.title}</b>\n\n${chunkItems.join('\n')}`,
        reply_markup: {
            inline_keyboard: [chunkButtons]
        }
    }
}


export function replaceMarkdownWithHTML(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}
