import { bot } from "./bot";
import { Crawler } from "./crawler";

import dataSource from "./data-source";
import config from "./config";

import "./cron"; // Initialize cron


dataSource.initialize().then(async () => {
    const crawler = new Crawler(
        config.telegram_account.app_id,
        config.telegram_account.hash,
    )

    await crawler.start();

    bot.launch();

}).catch((error: Error) => console.log(error));
