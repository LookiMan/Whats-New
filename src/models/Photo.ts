import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;
}
