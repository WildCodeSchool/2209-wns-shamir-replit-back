import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
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

  @Column()
  id_storage_file: number;

  @Column()
  name: string;

  @Column()
  language: string;

  @OneToMany(() => CodeComment, (codeComment) => codeComment.fileId)
  codeComment: CodeComment[];

  @Column()
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: User["id"];

  @Column()
  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "projectId" })
  projectId: Project["id"];
}
