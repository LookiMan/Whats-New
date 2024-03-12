import { bot } from "./bot";
import { Crawler } from "./crawler";

import dataSource from "./data-source";
import config from "./config";
import Logger from "./logger";

import "./cron"; // Initialize cron


const logger = Logger.getInstance("app");


dataSource.initialize().then(async () => {
    try {
        const crawler = new Crawler(
            config.telegram_account.app_id,
            config.telegram_account.hash,
        );

        await crawler.start();
        await bot.launch();
    } catch (error: any) {
        logger.error(error);
    }

}).catch((error: Error) => logger.error(error));
