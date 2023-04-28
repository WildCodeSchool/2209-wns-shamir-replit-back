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
  @Column({ nullable: true })
  line_number: number;

  @Field()
  @Column({ nullable: true })
  char_number: number;

  @Field()
  @Column({ nullable: true })
  char_length: number;

  @Field()
  @Column({ default: false, nullable: true })
  resolved: boolean;

  @Field()
  @Column("varchar", { length: 300 })
  comment: string;

  @Field()
  @CreateDateColumn()
  comment_date: Date;

  @Field()
  @Column({ default: false, nullable: true })
  is_report?: boolean;

  @Field(() => [CommentAnswer], { nullable: true })
  @OneToMany(() => CommentAnswer, (commentAnswer) => commentAnswer.codeComment)
  commentAnswer: CommentAnswer[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.codeComment, {
    onDelete: "CASCADE",
    eager: true,
    nullable: false,
  })
  user: User;

  @Field(() => FileCode)
  @ManyToOne(() => FileCode, (fildeCode) => fildeCode.codeComment, {
    onDelete: "CASCADE",
    eager: true,
    nullable: false,
  })
  fileCode: FileCode;
}
