import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne } from "typeorm";

import { SummaryTheme } from "./SummaryTheme";
import { User } from "./User";

type ReactionStatusType = "like" | "dislike";


@Entity()
export class SummaryReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.reaction)
    user: User;

    @ManyToOne(() => SummaryTheme, theme => theme.reaction)
    theme: SummaryTheme;

    @Column({type: "enum", enum: ["like", "dislike"]})
    status: ReactionStatusType;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    constructor(user: User, theme: SummaryTheme, status: ReactionStatusType) {
        this.user = user;
        this.theme = theme;
        this.status = status;
    }
}
