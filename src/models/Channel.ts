import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint" })
    channelId: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    username!: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
