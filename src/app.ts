import { bot } from "./bot";
import { db } from "./data-source";
import { Crawler } from "./crawler";

import config from "./config";

import "./cron"; // Initialize cron


db.initialize().then(async () => {
    const crawler = new Crawler(
        config.telegram_account.app_id,
        config.telegram_account.hash,
    )

    await crawler.start();

    bot.launch();

}).catch((error) => console.log(error));
