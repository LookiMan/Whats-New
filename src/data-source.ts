import "reflect-metadata";
import { DataSource } from "typeorm";

import { Channel } from "./models/Channel";
import { Post } from "./models/Post";
import { Summary } from "./models/Summary";
import { User } from "./models/User";
import { SummarySubscriber } from "./subscribers";

import config from "./config";


export const AppDataSource = new DataSource({
    type: config.db.type,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    synchronize: true,
    logging: config.debug,
    entities: [Channel, Post, Summary, User],
    subscribers: [SummarySubscriber],
    migrations: [],
})
