import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

import { Channel } from "./Channel"
import { Photo } from "./Photo"
import { Video } from "./Video"


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

    @Column("json", { nullable: true })
    entities: any;

    @OneToMany(() => Photo, (photo) => photo.post)
    photos?: Photo[];

    @OneToMany(() => Video, (video) => video.post)
    videos?: Video[];

    @Column({ type: "bigint", default: 0 })
    views?: number;

    @Column({ type: "bigint", default: 0 })
    forwards?: number;

    @Column("json", { nullable: true })
    reactions?: any;
}

