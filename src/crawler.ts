import { Api, TelegramClient } from "telegram";
import { Session, StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events/NewMessage";
import { EditedMessage, EditedMessageEvent } from "telegram/events/EditedMessage";
import { DeletedMessage, DeletedMessageEvent } from "telegram/events/DeletedMessage";

import { Post } from "./models/Post";
import { AppDataSource } from "./data-source";
import { Channel } from "./models/Channel";

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

    saveSession(session: Session) {
        fs.writeFileSync('session', session.save())
    }

    async newMessageHandler(event: NewMessageEvent) {
        const post = new Post();
        post.text = event.message.text;
        post.postId = Number(event.message.id);
        //post.postLink = postLink;
        const date = new Date();
        date.setTime(event.message.date * 1000);
        post.postDate = date;
        post.entities = event.message.entities;
        
        const channel = await this.getChannel(Number(event.chatId));
        post.channelId = Number(event.chatId);
        post.channelName = channel.title;
        await AppDataSource.manager.save(post);
    };

    async editedMessageHandler(event: EditedMessageEvent) {
        let post = await AppDataSource.manager.findOneBy(Post, { channelId: Number(event.chatId), postId: Number(event.message.id) });

        if (!post) {
            post = new Post();

            const channel = await this.getChannel(Number(event.chatId));
            post.channelId = Number(event.chatId);
            post.channelName = channel.title;

            post.postId = Number(event.message.id);

            const date = new Date();
            date.setTime(event.message.date * 1000);
            post.postDate = date;
        }

        post.text = event.message.text;
        post.text = event.message.text;
        post.views = event.message.views;
        post.forwards = event.message.forwards;
        post.reactions = event.message.reactions?.results;

        await AppDataSource.manager.save(post);
    }

    async deletedMessageHandler(event: DeletedMessageEvent) {
        const channelId = event.originalUpdate.channelId; 
        for (const postId of event.deletedIds) {
            await AppDataSource.manager.delete(Post, { channelId, postId });
        }
    }

    async start() {
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

    async downloadMedia(media) {
        const buffer = await this.client.downloadMedia(media, {
            workers: 1,
        });
        return buffer
    }

    async getChannel(channelId: number) {
        const channel = await AppDataSource.manager.findOneBy(Channel, { channelId });

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
        await AppDataSource.manager.save(newChannel);

        return newChannel
    }
}


export { Crawler }
