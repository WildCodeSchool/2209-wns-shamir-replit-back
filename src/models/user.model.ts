import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CodeComment } from "./code_comment.model";
import { CommentAnswer } from "./comment_answer.model";
import { Execution } from "./execution.model";
import { FileCode } from "./file.model";
import { Project } from "./project.model";
import { ProjectShare } from "./project_share.model";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  login: string;

  @Column()
  date_start_subscription?: Date;

  @Column()
  date_end_subscription?: Date;

  @OneToMany(() => CommentAnswer, (commentAnswer) => commentAnswer.user)
  commentAnswer: CommentAnswer[];

  @OneToMany(() => FileCode, (fileCode) => fileCode.user)
  fileCode: FileCode[];

  @OneToMany(() => CodeComment, (codeComment) => codeComment.user)
  codeComment: CodeComment[];

  @OneToMany(() => ProjectShare, (projectShare) => projectShare.user)
  projectShare: CommentAnswer[];

  @OneToMany(() => Execution, (execution) => execution.user)
  execution: Execution[];

  @OneToMany(() => Project, (project) => project.user)
  project: Project[];
}
