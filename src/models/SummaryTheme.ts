import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";

import { SummaryChunk } from "./SummaryChunk";
import { SummaryReaction } from "./SummaryReaction";


@Entity()
export class SummaryTheme {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 200, unique: true })
    label!: string;

    @OneToMany(() => SummaryChunk, chunk => chunk.theme)
    chunk!: SummaryChunk;

    @OneToMany(() => SummaryReaction, reaction => reaction.theme)
    reactions?: SummaryReaction[];

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(label: string) {
        this.label = label;
    }
}
