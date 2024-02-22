export interface ServerConfig {
	port: number | undefined;
}

export interface TelegramBotConfig {
	token: string | undefined;
}

export interface TelegramAccountConfig {
	hash: string | undefined;
	app_id: string | undefined;
}

export interface DbConfig {
	type: string | undefined;
	name: string | undefined;
	root: string | undefined;
	pass: string | undefined;
	host: string | undefined;
	port: number | undefined;
	user: string | undefined;
}

export interface WebhookConfig {
	url: string;
	port: number;
	certsPath: string;
	selfSigned: boolean;
}

export interface LogConfig {
	path: {
        debug_log: string;
        error_log: string;
	};
}

export interface Config {
	server: ServerConfig;
	telegram_bot: TelegramBotConfig;
	telegram_account: TelegramAccountConfig;
	db: DbConfig;
	webhook: WebhookConfig;
	debug: boolean;
	log: LogConfig;
}
