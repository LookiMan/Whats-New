import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";

import { SummaryChunk } from "./SummaryChunk";


@Entity()
export class Summary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "text" })
    rawText: string;

    @OneToMany(() => SummaryChunk, chunk => chunk.summary)
    chunks?: SummaryChunk[];

    @Column({ type: "boolean", default: false })
    isApproved: boolean;

    @Column({ type: "boolean", default: false })
    isSubmitted: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

}
