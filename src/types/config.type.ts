interface ServerConfig {
	port: number;
}

interface DbConfig {
	type: string;
	name: string;
	root: string;
	pass: string;
	host: string;
	port: number;
	user: string;
}

interface TelegramBotConfig {
	token: string;
}

interface TelegramAccountConfig {
	hash: string;
	app_id: number;
}

export interface Config {
	server: ServerConfig;
	db: DbConfig;
	telegram_bot: TelegramBotConfig;
	telegram_account: TelegramAccountConfig;
}
