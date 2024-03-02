interface DbConfig {
	type: string;
	name: string;
	root: string;
	pass: string;
	host: string;
	port: number;
	user: string;
}


interface TelegramAccountConfig {
	hash: string;
	app_id: number;
}


interface TelegramBotConfig {
	token: string;
}


interface TelegramChannelConfig {
	id: number;
}


interface ServerConfig {
	port: number;
}


interface VertexAI {
	location: string;
	project: string;
	model: string;
}


export interface Config {
	db: DbConfig;
	debug: boolean;
	telegram_account: TelegramAccountConfig;
	telegram_bot: TelegramBotConfig;
	telegram_channel: TelegramChannelConfig;
	server: ServerConfig;
	vertex_ai: VertexAI;
}
