import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { CodeComment } from "./code_comment.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class CommentAnswer {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 300 })
  comment: string;

  @CreateDateColumn()
  answer_date: Date;

  @Column()
  @ManyToOne(() => CodeComment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "codeCommentId" })
  codeCommentId: CodeComment["id"];

  @Column()
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: User["id"];
}
