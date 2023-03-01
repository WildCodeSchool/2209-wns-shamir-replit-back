import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CodeComment } from "./code_comment.model";
import { CommentAnswer } from "./comment_answer.model";
import { Execution } from "./execution.model";
import { FileCode } from "./file.model";
import { Like } from "./like.model";
import { Project } from "./project.model";
import { ProjectShare } from "./project_share.model";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Field()
  @Column()
  login: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  date_start_subscription?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  date_end_subscription?: Date;

  @Field(() => [CommentAnswer], { nullable: true })
  @OneToMany(() => CommentAnswer, (commentAnswer) => commentAnswer.user)
  commentAnswer: CommentAnswer[];

  @Field(() => [FileCode], { nullable: true })
  @OneToMany(() => FileCode, (fileCode) => fileCode.user)
  fileCode: FileCode[];

  @Field(() => [CodeComment], { nullable: true })
  @OneToMany(() => CodeComment, (codeComment) => codeComment.user)
  codeComment: CodeComment[];

  @Field(() => [ProjectShare], { nullable: true })
  @OneToMany(() => ProjectShare, (projectShare) => projectShare.user)
  projectShare: CommentAnswer[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.project)
  like: Like[];

  @Field(() => [Execution], { nullable: true })
  @OneToMany(() => Execution, (execution) => execution.user)
  execution: Execution[];

  @Field(() => [Project])
  @OneToMany(() => Project, (project) => project.user)
  project: Project[];
}
