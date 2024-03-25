import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "bigint", unique: true })
    userId!: number;

    @Column()
    firstName!: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column({ nullable: true })
    username!: string;

    @Column({ type: "boolean", default: true })
    isActive: boolean = true;

    @CreateDateColumn({ type: "timestamp", nullable: true })
    deactivationDate!: Date;

    @CreateDateColumn({ type: "timestamp", nullable: true })
    lastSummaryDate!: Date;

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
