import type { Config } from "./types/config.type";


const config: Config = {
	server: {
		port: Number(process.env.APP_PORT),
	},
	db: {
	    type: 'mysql',
	    name: process.env.MYSQL_DATABASE || "",
	    root: process.env.MYSQL_ROOT_PASSWORD || "",
	    pass: process.env.MYSQL_PASSWORD || "",
	    host: process.env.MYSQL_HOST || "",
	    port: Number(process.env.MYSQL_PORT) || 0,
	    user: process.env.MYSQL_USER || "",
	},
	telegram_bot: {
		token: process.env.TELEGRAM_BOT_API_TOKEN || "",
	},
	telegram_account: {
		hash: process.env.TELEGRAM_ACCOUNT_API_HASH || "",
		app_id: Number(process.env.TELEGRAM_ACCOUNT_API_ID),
	},
};
    
export default config;
