import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Summary } from "./models/Summary";
import { notifyAdmins, renderAdminSummaryChunkMessage } from "./utils";
import Logger from "./logger";

const logger = Logger.getInstance("bot");

@EventSubscriber()
export class SummarySubscriber implements EntitySubscriberInterface<Summary> {
    listenTo() {
        return Summary;
    }

    afterInsert(event: InsertEvent<Summary>) {
        notifyAdmins(event.entity.label);
    
        for (const chunk of event.entity.chunks) {
            try {
                const message = renderAdminSummaryChunkMessage(chunk, event.entity.label);

                notifyAdmins(message.text, { reply_markup: message.reply_markup, disable_notification: true });
            } catch (error: any) {
                logger.error(error);
            }
        }
    }
}
