import "reflect-metadata";

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { SummaryChunk } from "./SummaryChunk";


@Entity()
export class Summary {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    label: string = "";

    @Column({ nullable: true, type: "text" })
    rawText: string = "";

    @OneToMany(() => SummaryChunk, chunk => chunk.summary)
    chunks!: SummaryChunk[];

    @Column({ type: "boolean", default: false })
    isSubmitted: boolean= false;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

}
