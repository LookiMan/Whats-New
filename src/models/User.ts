import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany } from "typeorm";

import { SummaryReaction } from "./SummaryReaction"; 


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint" })
    userId!: number;

    @Column()
    firstName!: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column({ nullable: true })
    username!: string;

    @OneToMany(() => SummaryReaction, reaction => reaction.user)
    reactions!: SummaryReaction[];

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    constructor(userId: number, firstName: string, lastName?: string, username?: string, created_at?: Date) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName || "";
        this.username = username || "";
        this.created_at = created_at || new Date();
    }
}
