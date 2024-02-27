import { bot } from "./bot";
import { AppDataSource } from "./data-source";
import { Crawler } from "./crawler";

import config from "./config";


AppDataSource.initialize().then(async () => {
    const crawler = new Crawler(
        config.telegram_account.app_id,
        config.telegram_account.hash,
    )

    await crawler.start();

    bot.launch();

}).catch((error) => console.log(error));
