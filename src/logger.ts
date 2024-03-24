import * as fs from "fs";
import * as winston from "winston";


class Logger {
    private static instances: Map<string, Logger> = new Map();
    private logger: winston.Logger;
 
    private constructor(name: string) {
        if (!fs.existsSync("./logs")) {
            fs.mkdirSync("./logs");
        }

        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
            ),
            level: process.env.NODE_ENV === "production" ? "info" : "debug",
            transports: [
                new winston.transports.File({ 
                    filename: `./logs/${name}.log`,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
                    )
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
                    )
                })
            ]
        });
    }

    public static getInstance(name: string = "app"): Logger {
        if (!Logger.instances.has(name)) {
            Logger.instances.set(name, new Logger(name));
        }
        return Logger.instances.get(name)!;
    }

    debug(message: string) {
        this.logger.log({level: "debug", message}); 
    }

    info(message: string) {
        this.logger.log({level: "info", message});     
    }

    warn(message: string) {
        this.logger.log({level: "warn", message});     
    }

    error (message: string) {
        this.logger.log({level: "error", message});     
    }
}


export default Logger;
