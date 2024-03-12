import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";

import { Summary } from "./models/Summary";

import { formatSummary } from "./utils";
import { sendAdminsNotification } from "./utils";


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

        sendAdminsNotification(
            formatSummary(event.entity.label, event.entity.rawText),
            replyMarkup
        )

    }
}
