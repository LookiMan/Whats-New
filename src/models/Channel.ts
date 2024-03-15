import "reflect-metadata";

import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn,  OneToMany } from "typeorm";

import { Post } from "./Post";


@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint", unique: true })
    channelId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    username!: string;

    @OneToMany(() => Post, post => post.channel)
    posts!: Post[];

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(channelId: number, title: string, username: string | undefined) {
        this.channelId = channelId;
        this.title = title;
        this.username = username || "";
    }
}
