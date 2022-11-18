import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { CodeComment } from "./code_comment.model";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class FileCode {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_storage_file:number

  @Column()
  name: string;

  @Column()
  language: string;

  @Column()
  login: string;

  @OneToMany(() => CodeComment, (codeComment) => codeComment.file)
  codeComment: CodeComment[];

  @ManyToOne(() => User, (user) => user.fileCode)
  user: User;
  
  @ManyToOne(() => Project, (project) => project.file)
  project: Project;
}
