import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from 'typeorm';


@Entity()
export class UserConfig {
    @PrimaryGeneratedColumn()
    user: number

    @Column()
    firstName: string

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
