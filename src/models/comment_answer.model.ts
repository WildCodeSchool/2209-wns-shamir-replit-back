import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import {CodeComment} from "./code_comment.model";
import { User } from "./user.model";


@ObjectType()
@Entity()
export class CommentAnswer {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {length: 300})
  comment: string;

  @CreateDateColumn()
  answer_date: Date;

  @ManyToOne(() => CodeComment, (codeComment) => codeComment.commentAnswer)
  codeComment: CodeComment;

  @ManyToOne(() => User, (user) => user.project)
  user: User;
}
