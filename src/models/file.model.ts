import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { CodeComment } from "./code_comment.model";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class FileCode {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  id_storage_file: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  language: string;

  @Field(() => [CodeComment])
  @OneToMany(() => CodeComment, (codeComment) => codeComment.fileCode)
  codeComment: CodeComment[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.fileCode, {
    onDelete: "CASCADE",
    eager: true,
  })
  user: User;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.fileCode, {
    onDelete: "CASCADE",
    eager: true,
  })
  project: Project;
}
