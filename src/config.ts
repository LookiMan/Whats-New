import type { Config } from "./types/config.type";


const config: Config = {
	server: {
		port: Number(process.env.APP_PORT),
	},
	telegram_bot: {
		token: process.env.TELEGRAM_BOT_API_TOKEN,
	},
	telegram_account: {
		hash: process.env.TELEGRAM_ACCOUNT_API_HASH,
		app_id: process.env.TELEGRAM_ACCOUNT_API_ID,
	},
	db: {
	    type: 'mysql',
	    name: process.env.MYSQL_DATABASE,
	    root: process.env.MYSQL_ROOT_PASSWORD,
	    pass: process.env.MYSQL_PASSWORD,
	    host: process.env.MYSQL_HOST,
	    port: Number(process.env.MYSQL_PORT),
	    user: process.env.MYSQL_USER,
	},
	webhook: {
	    url: 'https://sample.host.com:8443',
	    port: 8443,
	    certsPath: 'certs',
	    selfSigned: true,
	},
	debug: true,
	log: {
		path: {
			debug_log: './logs/debug.log',
			error_log: './logs/errors.log',
		},
	},
};
    
export default config;
