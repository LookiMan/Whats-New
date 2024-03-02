import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";

import { Summary } from "./models/Summary";
import { bot } from "./bot"

import config from "./config"


@EventSubscriber()
export class SummarySubscriber implements EntitySubscriberInterface<Summary> {
    listenTo() {
        return Summary;
    }

    afterInsert(event: InsertEvent<Summary>) {
        bot.telegram.sendMessage(config.telegram_channel.id, event.entity.text, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Підтвердити публікацію", callback_data: `approve:${event.entity.id}` }]
                ]
            }
        });
    }
}
