import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { CommentAnswer } from "./comment_answer.model";
import { FileCode } from "./file.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class CodeComment {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  line_number: number;

  @Column()
  char_number: number;

  @Column()
  char_length: number;

  @Column({ default: false })
  resolved: boolean;

  @Column("varchar", { length: 300 })
  comment: string;

  @CreateDateColumn()
  comment_date: Date;

  @Column({ default: false })
  is_report?: boolean;

  @OneToMany(() => CommentAnswer, (commentAnswer) => commentAnswer.codeComment)
  commentAnswer: CommentAnswer[];

  @ManyToOne(() => FileCode, (fileCode) => fileCode.codeComment)
  file: FileCode;

  @ManyToOne(() => User, (user) => user.project)
  user: User;
}
