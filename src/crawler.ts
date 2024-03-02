import { Api, TelegramClient } from "telegram";
import { Session, StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events/NewMessage";
import { EditedMessage, EditedMessageEvent } from "telegram/events/EditedMessage";
import { DeletedMessage, DeletedMessageEvent } from "telegram/events/DeletedMessage";

import { AppDataSource } from "./data-source";
import { Channel } from "./models/Channel";
import { Post } from "./models/Post";

const QRCode = require('qrcode');
const fs = require('fs');


class Crawler {
    apiId: number;
    apiHash: string;

    client: TelegramClient;
    session: StringSession;

    constructor(apiId: number, apiHash: string) {
        this.apiId = apiId;
        this.apiHash = apiHash;

        const sessionData = fs.existsSync('session') ? fs.readFileSync('session').toString() : '' 
        this.session = new StringSession(sessionData)
      
        this.client = new TelegramClient(this.session, apiId, apiHash, {
            useWSS: true,
        })

        this.client.addEventHandler(this.newMessageHandler.bind(this), new NewMessage({}))
        this.client.addEventHandler(this.editedMessageHandler.bind(this), new EditedMessage({}))
        this.client.addEventHandler(this.deletedMessageHandler.bind(this), new DeletedMessage({}))
    }

    saveSession(session: Session): void {
        fs.writeFileSync('session', session.save());
    }

    async newMessageHandler(event: NewMessageEvent): Promise<void> { 
        const post = new Post();
        post.text = event.message.text;
        post.entities = event.message.entities;
        
        post.chatId = Number(event.chatId);
        post.groupedId = Number(event.message.groupedId);

        post.channel = await this.getChannel(post.chatId);

        post.postId = Number(event.message.id);
        if (post?.channel?.username) {
            post.postLink = `https://t.me/${post.channel.username}/${post.postId}`;
        }

        const date = new Date();
        date.setTime(event.message.date * 1000);
        post.postDate = date;

        await AppDataSource.manager.save(post);
    };

    async editedMessageHandler(event: EditedMessageEvent): Promise<void>  {
        const query = { chatId: Number(event.chatId), postId: Number(event.message.id) };
        const post = await AppDataSource.manager.findOneBy(Post, query);

        if (!post) {
            return;
        }

        post.text = event.message.text;
        post.views = event.message.views;
        post.forwards = event.message.forwards;
        post.reactions = event.message.reactions?.results;

        await AppDataSource.manager.save(post);
    }

    async deletedMessageHandler(event: DeletedMessageEvent): Promise<void> {
        const chatId = Number(event.chatId);
        for (const postId of event.deletedIds) {
            await AppDataSource.manager.delete(Post, { chatId, postId });
        }
    }

    async start(): Promise<void> {
        await this.client.connect();

        if (!await this.client.checkAuthorization()) {
            await this.client.signInUserWithQrCode({ apiId: this.apiId, apiHash: this.apiHash }, {
                qrCode: async (code) => {
                    console.log('Scan QR code to login');
                    QRCode.toString(`tg://login?token=${code.token.toString("base64url")}`)
                    .then((url: string) => {
                        console.log(url)
                    })
                    .catch((err: Error) => {
                        console.error(err)
                    })
                },
                onError: (err: Error) => console.log(err),
            })
            this.saveSession(this.client.session)
        }
    }

    async getChannel(channelId: number): Promise<Channel | null> {
        const channel = await AppDataSource.manager.findOneBy(Channel, { channelId: channelId });

        if (channel) {
            return channel;
        }

        const newChannel = new Channel();
        const info = await this.client.invoke(
            new Api.channels.GetChannels({
            id: [channelId],
            })
        );

        newChannel.channelId = channelId;
        newChannel.title = info.chats[0].title;
        newChannel.username = info.chats[0].username;

        try {
            await AppDataSource.manager.save(newChannel);
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Ignore duplicating records
            } else {
                console.error('Error while saving channel:', error);
            }
            return null;
        }

        return newChannel;
    }
}


export { Crawler }
