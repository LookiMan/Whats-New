import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "bigint" })
    userId: number;

    @Column()
    firstName: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column({ nullable: true })
    username!: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
