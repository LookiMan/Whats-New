import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

import { Photo } from "./Photo"
import { Video } from "./Video"


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "text" })
    text: string;

    @Column({ type: "bigint", nullable: true })
    postId: number;

    @Column({ nullable: true })
    postLink: string;

    @Column({ nullable: true })
    postDate: Date;

    @Column({ type: "bigint", nullable: true })
    channelId: number;

    @Column({ nullable: true })
    channelName: string;

    @Column("json", { nullable: true })
    entities: any;

    @ManyToMany(() => Photo)
    @JoinTable()
    photos?: Photo[];

    @ManyToMany(() => Video)
    @JoinTable()
    videos?: Video[];

    @Column({ type: "bigint", default: 0 })
    views?: number;

    @Column({ type: "bigint", default: 0 })
    forwards?: number;

    @Column("json", { nullable: true })
    reactions?: any;
}

