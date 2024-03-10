import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";

import { Summary } from "./models/Summary";
import { bot } from "./bot"
import { formatSummary } from "./utils";

import config from "./config"


@EventSubscriber()
export class SummarySubscriber implements EntitySubscriberInterface<Summary> {
    listenTo() {
        return Summary;
    }

    afterInsert(event: InsertEvent<Summary>) {
        const replyMarkup = event.entity.chunks ? {
            inline_keyboard: [
                [{ text: "Підтвердити публікацію", callback_data: `approve:${event.entity.id}` }]
            ]
        } : undefined;

        bot.telegram.sendMessage(config.telegram_channel.id, formatSummary(event.entity.label, event.entity.rawText), {
            parse_mode: "HTML",
            reply_markup: replyMarkup,
        });
    }
}
