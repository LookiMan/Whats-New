import "reflect-metadata";

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Channel } from "./Channel";


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true, type: "text" })
    text?: string;

    @Column({ nullable: true })
    lang!: string;

    @Column("json", { nullable: true })
    entities: any;

    @Column({ default: () => "CURRENT_TIMESTAMP", type: "timestamp" })
    postDate!: Date;

    @Column({ type: "bigint" })
    postId: number = 0;

    @Column({ nullable: true })
    postLink: string = "";

    @Column({ type: "bigint" })
    chatId: number = 0;

    @Column({ type: "bigint" })
    groupedId: number = 0;

    @ManyToOne(() => Channel, channel => channel.posts)
    channel!: Channel;

    @Column({ type: "bigint", default: 0 })
    views?: number;

    @Column({ type: "bigint", default: 0 })
    forwards?: number;

    @Column("json", { nullable: true })
    reactions?: any;

    @Column({ type: "boolean", default: false })
    isDeleted: boolean = false;

    @Column({ type: "boolean", default: false })
    isEdited: boolean = false;
}
