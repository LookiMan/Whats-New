import "reflect-metadata";

import { CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { SummaryChunk } from "./SummaryChunk";


@Entity()
export class SummaryChunkItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true, type: "text" })
    text: string = "";

    @ManyToOne(() => SummaryChunk, chunk => chunk.items)
    chunk!: SummaryChunk;

    @Column({ type: "boolean", default: true })
    isApproved: boolean = true;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(text: string) {
        this.text = text;
    }
}
