import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from "typeorm";

import { Post } from "./Post";


@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @ManyToOne(() => Post, (post) => post.photos)
    post: Post
}
