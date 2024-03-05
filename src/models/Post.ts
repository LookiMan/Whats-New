import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { Channel } from "./Channel";


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "text" })
    text: string;

    @Column()
    postDate: Date;

    @Column({ type: "bigint" })
    postId: number;

    @Column({ nullable: true })
    postLink: string;

    @Column({ type: "bigint" })
    chatId: number;

    @Column({ type: "bigint" })
    groupedId: number;

    @ManyToOne(() => Channel, channel => channel.posts)
    channel?: Channel;

    @Column({ type: "bigint", default: 0 })
    views?: number;

    @Column({ type: "bigint", default: 0 })
    forwards?: number;

    @Column("json", { nullable: true })
    reactions?: any;
}
