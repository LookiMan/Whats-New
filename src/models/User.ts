import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


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
