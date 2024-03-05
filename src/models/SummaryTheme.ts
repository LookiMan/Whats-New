import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";

import { SummaryChunk } from "./SummaryChunk";


@Entity()
export class SummaryTheme {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 200, unique: true })
    label: string;

    @OneToMany(() => SummaryChunk, chunk => chunk.theme)
    chunk?: SummaryChunk;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(label: string) {
        this.label = label;
    }
}
