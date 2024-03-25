import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import config from "./config";

const connectionOptions: DataSourceOptions = {
    type: config.db.type,
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    synchronize: false,
    logging: config.debug,
    entities: [__dirname + "/models/*.{js,ts}"],
    migrations: [__dirname + "/migrations/*.{js,ts}"],
    subscribers: [__dirname + "/subscribers.{js,ts}"],
};

export default new DataSource(connectionOptions)
