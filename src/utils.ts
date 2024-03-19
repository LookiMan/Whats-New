import { InlineKeyboardButton, InlineKeyboardMarkup, ParseMode } from "telegraf/types";

import { SummaryChunk } from "./models/SummaryChunk";

import { bot } from "./bot";

import config from "./config";


// https://github.com/nizaroni/emoji-strip/blob/master/dist/emoji-strip.js
export const emojiRegex = /(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g;


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
        return "Очікуй короткі підсумки новин вже завтра о 9:00 🌅";
    } else if (timeDiff === 0) {
        return "До підсумків новин залишилося ще трішки ⏳";
    } else {
        const timeStr = timeDiff === 1 ? "годину" : "години";
        return `Очікуй короткі підсумки новин через ${timeDiff} ${timeStr} ⏰`;
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
    text = text.replace(/\*\*(.*?)\*\*\n/g, '<b>$1</b>\n');
    text = text.replace(/\_\_(.*?)\_\_/g, '<i>$1</i>');
    return text;
}
