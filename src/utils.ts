import { InlineKeyboardButton, InlineKeyboardMarkup, ParseMode } from "telegraf/types";

import { SummaryChunk } from "./models/SummaryChunk";

import { telebot } from "./app";

import config from "./config";

export const EMOJI_REGEX = /(?:🍝|🥱|🌙|☕️)/g;

export const MAX_SUMMARY_CREATE_RETRIES = 10;

export function cleanMessage(message: string): string {
    message = message.replace("**", "");
    return message;
}

export function cleanChunk(message: string) {
    message = message.trim();
    message = message.replace(/\*/, "-");
    return message.replace(/<[^>]*>/g, "");
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

    if (chunk.items && chunk.items.length > 0) {
        chunk.items.forEach((item, index) => {
            if (item.isApproved) {
                items.push(item.text);
            }
        });
    }

    const emoji = getEmoji(chunk.summary.label, '🆕');

    return `${emoji} <b>${chunk.title}</b>\n\n${items.join('\n')}\n\n${copyright}`;
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

    telebot.sendMessage(config.telegram_channel.id, message, params);
}

export function getEmoji(text: string, defaultEmoji: string = '🔹'): string {
    const match = text.match(EMOJI_REGEX);
    return match && match.length > 0 ? match[0] : defaultEmoji;
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
        return "Очікуй короткі підсумки новин вже завтра о 9:00 🌅";
    } else if (timeDiff === 0) {
        return "До підсумків новин залишилося ще трішки ⏳";
    } else {
        const timeStr = timeDiff === 1 ? "годину" : "години";
        return `Очікуй короткі підсумки новин через ${timeDiff} ${timeStr} ⏰`;
    }
}

export function renderAdminSummaryChunkMessage(chunk: SummaryChunk, label: string): {
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

    const emoji = getEmoji(label, '🆕');

    return {
        text: `${emoji} <b>${chunk.title}</b>\n\n${chunkItems.join('\n')}`,
        reply_markup: {
            inline_keyboard: [chunkButtons]
        }
    }
}

export function replaceMarkdownWithHTML(text: string): string {
    text = text.replace(/\*\*(.*?)\*\*\n/g, '<b>$1</b>\n');
    text = text.replace(/\_\_(.*?)\_\_/g, '<i>$1</i>');
    return text;
}
