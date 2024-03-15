import "reflect-metadata";

import { Column, CreateDateColumn, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Summary } from "./Summary";
import { SummaryChunkItem } from "./SummaryChunkItem";


@Entity()
export class SummaryChunk {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true, type: "text" })
    title: string = "";

    @Column({ nullable: true, type: "text" })
    rawText: string = "";

    @ManyToOne(() => Summary, summary => summary.chunks)
    summary!: Summary;

    @OneToMany(() => SummaryChunkItem, item => item.chunk)
    items!: SummaryChunkItem[];

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(title: string, rawText: string) {
        this.title = title;
        this.rawText = rawText;
    }

    isEmpty() {
        if (!this.items) {
            return true;
        }

        return this.items.every(item => item.isApproved === false);
    }
}
