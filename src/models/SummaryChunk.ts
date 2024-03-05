import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from "typeorm";

import { Summary } from "./Summary";
import { SummaryTheme } from "./SummaryTheme";


@Entity()
export class SummaryChunk {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "text" })
    text: string;

    @ManyToOne(() => Summary, summary => summary.chunks)
    summary?: Summary;

    @ManyToOne(() => SummaryTheme, theme => theme.chunk)
    theme?: SummaryTheme;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(text: string) {
        this.text = text;
    }
}
