import { InlineKeyboardMarkup } from "telegraf/types";

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


export function formatSummary(label: string, message: string): string {
    const copyright = "Джерело: <a href='https://t.me/what_new_ua_bot'>What's New Ukraine Bot</a>";

    return `${label}\n\n${message}\n\n${copyright}`;
}


export function sendAdminsNotification(message: string, replyMarkup: InlineKeyboardMarkup | undefined = undefined): void {
    bot.telegram.sendMessage(config.telegram_channel.id, message, {
        parse_mode: "HTML",
        reply_markup: replyMarkup,
    });
}
