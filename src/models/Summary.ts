import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column } from "typeorm";


@Entity()
export class Summary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "text" })
    text: string;

    @Column({ type: "boolean", default: false })
    isApproved: boolean;

    @Column({ type: "boolean", default: false })
    isSubmitted: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

}
