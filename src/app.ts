import Crawler from "./crawler";
import Logger from "./logger";
import Telebot from "./telebot";

import dataSource from "./data-source";
import config from "./config";

import "./cron"; // Initialize cron

const logger = Logger.getInstance("app");

export const crawler = new Crawler(
    config.telegram_account.app_id,
    config.telegram_account.hash,
);

export const telebot = new Telebot(
    config.telegram_bot.token,
    config.telegram_channel.id,
);

dataSource.initialize().then(async () => {
    try {
        await crawler.start();
        await telebot.start();
    } catch (error: any) {
        logger.error(JSON.stringify(error));
    }

}).catch((error: Error) => logger.error(JSON.stringify(error)));
