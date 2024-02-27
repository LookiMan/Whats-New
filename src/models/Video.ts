import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
