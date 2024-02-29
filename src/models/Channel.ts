import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";

import { Post } from "./Post";


@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint", unique: true })
    channelId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    username!: string;

    @OneToMany(() => Post, post => post.channel)
    posts: Post[];

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
