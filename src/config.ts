import type { Config } from "./types/config.type";


const config: Config = {
	db: {
	    type: 'mysql',
	    name: process.env.MYSQL_DATABASE ?? "",
	    root: process.env.MYSQL_ROOT_PASSWORD ?? "",
	    pass: process.env.MYSQL_PASSWORD ?? "",
	    host: process.env.MYSQL_HOST ?? "",
	    port: Number(process.env.MYSQL_PORT) ?? 0,
	    user: process.env.MYSQL_USER ?? "",
	},
	debug: Boolean(process.env.DEBUG),
	telegram_account: {
		hash: process.env.TELEGRAM_ACCOUNT_API_HASH ?? "",
		app_id: Number(process.env.TELEGRAM_ACCOUNT_API_ID),
	},
	telegram_bot: {
		token: process.env.TELEGRAM_BOT_API_TOKEN ?? "",
	},
	telegram_channel: {
		id: Number(process.env.TELEGRAM_ADMIN_CHANNEL_ID) ?? 0,
	},
	vertex_ai: {
		location: process.env.VERTEX_AI_LOCATION ?? "",
		project: process.env.VERTEX_AI_PROJECT ?? "",
		model: process.env.VERTEX_AI_MODEL ?? "",
	},
	server: {
		port: Number(process.env.APP_PORT),
	}
};
    
export default config;
