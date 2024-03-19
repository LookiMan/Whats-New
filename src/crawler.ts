import { Api, TelegramClient } from "telegram";
import { Session, StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events/NewMessage";
import { EditedMessage, EditedMessageEvent } from "telegram/events/EditedMessage";
import { DeletedMessage, DeletedMessageEvent } from "telegram/events/DeletedMessage";

import { Channel } from "./models/Channel";
import { Post } from "./models/Post";
import { clearMessage } from "./utils"; 

import dataSource from "./data-source";
import Logger from "./logger";


const fs = require("fs");
const QRCode = require("qrcode");
const logger = Logger.getInstance("crawler");


class Crawler {
    private apiId: number;
    private apiHash: string;

    private client: TelegramClient;
    private session: StringSession;

    constructor(apiId: number, apiHash: string) {
        this.apiId = apiId;
        this.apiHash = apiHash;

        const sessionData = fs.existsSync("session") ? fs.readFileSync("session").toString() : "";
        this.session = new StringSession(sessionData);
      
        this.client = new TelegramClient(this.session, apiId, apiHash, {
            useWSS: true,
        });

        this.client.addEventHandler(this.newMessageHandler.bind(this), new NewMessage({}));
        this.client.addEventHandler(this.editedMessageHandler.bind(this), new EditedMessage({}));
        this.client.addEventHandler(this.deletedMessageHandler.bind(this), new DeletedMessage({}));
    }

    saveSession(session: Session): void {
        fs.writeFileSync("session", session.save());
    }

    async newMessageHandler(event: NewMessageEvent): Promise<void> {
        if (event.message?.chat?.className !== "Channel") {
            return;
        }

        const post = new Post();
        post.text = clearMessage(event.message.text);

        post.chatId = Number(event.chatId);
        post.groupedId = Number(event.message.groupedId);

        const channel = await this.getChannel(post.chatId);
        if (channel) {
            post.channel = channel;
        }

        post.postId = Number(event.message.id);
        if (post?.channel?.username) {
            post.postLink = `https://t.me/${post.channel.username}/${post.postId}`;
        }

        const date = new Date();
        date.setTime(event.message.date * 1000);
        post.postDate = date;

        await dataSource.manager.save(post);
    };

    async editedMessageHandler(event: EditedMessageEvent): Promise<void> {
        if (event.message?.chat?.className !== "Channel") {
            return;
        }

        const query = { chatId: Number(event.chatId), postId: Number(event.message.id) };
        const post = await dataSource.manager.findOneBy(Post, query);

        if (!post) {
            return;
        }

        const newText = clearMessage(event.message.text);
        if (newText != post.text) {
            post.isEdited = true;
        }
        post.text = newText;
        post.views = event.message.views;
        post.forwards = event.message.forwards;
        post.reactions = event.message.reactions?.results;

        await dataSource.manager.save(post);
    }

    async deletedMessageHandler(event: DeletedMessageEvent): Promise<void> {
        if (event?.peer && typeof event.peer === 'object' && 'className' in event.peer && event.peer.className !== "PeerChannel") {
            return;
        }

        const chatId = Number(event.chatId);
        for (const postId of event.deletedIds) {
            const post = await dataSource.manager.findOneBy(Post, { chatId, postId });
            if (post) {
                post.isDeleted = true;
                await dataSource.manager.save(post);
            }
        }
    }

    async start(): Promise<void> {
        await this.client.connect();

        if (!await this.client.checkAuthorization()) {
            await this.client.signInUserWithQrCode({ apiId: this.apiId, apiHash: this.apiHash }, {
                qrCode: async (code) => {
                    console.log("Scan QR code to login");
                    QRCode.toString(`tg://login?token=${code.token.toString("base64url")}`)
                    .then((url: string) => {
                        console.log(url);
                    })
                    .catch((err: Error) => {
                        console.error(err);
                    })
                },
                onError: (err: Error) => console.log(err),
            });
            this.saveSession(this.client.session);
        }
    }

    async getChannel(channelId: number): Promise<Channel | null> {
        const channel = await dataSource.manager.findOneBy(Channel, { channelId: channelId });

        if (channel) {
            return channel;
        }

        const info = await this.client.invoke(
            new Api.channels.GetChannels({
                id: [channelId],
            })
        );

        const chat = info?.chats[0];
        const title = chat && 'title' in chat ? chat.title : "";
        const username = chat && 'username' in chat ? chat.username : "";

        const newChannel = new Channel(channelId, title, username);

        try {
            await dataSource.manager.save(newChannel);
        } catch (error: any) {
            if (error.code === "ER_DUP_ENTRY") {
                // Ignore duplicating records
            } else {
                logger.error(`Error while saving channel: ${error}`);
            }
            return null;
        }

        return newChannel;
    }
}


export { Crawler }
