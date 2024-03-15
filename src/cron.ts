import {
    createNightlySummaryPostTask,
    createMorningSummaryPostTask,
    createLunchSummaryPostTask,
    createEveningSummaryPostTask,
    sendSummaryPostTask,
} from "./tasks";


const cron = require("node-cron");


cron.schedule("45 8  * * *", createNightlySummaryPostTask);
cron.schedule("45 11 * * *", createMorningSummaryPostTask);
cron.schedule("45 14 * * *", createLunchSummaryPostTask);
cron.schedule("45 20 * * *", createEveningSummaryPostTask);
cron.schedule("0 9,12,15,21 * * *", sendSummaryPostTask);
