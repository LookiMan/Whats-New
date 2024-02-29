import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from "typeorm";

import { Post } from "./Post";


@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @ManyToOne(() => Post, (post) => post.videos)
    post: Post
}
