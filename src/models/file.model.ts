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

  @Field()
  @Column()
  id_storage_file: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  language: string;

  @Field(() => [CodeComment], { nullable: true })
  @OneToMany(() => CodeComment, (codeComment) => codeComment.fileId)
  codeComment: CodeComment[];

  @Column()
  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "userId" })
  userId: User["id"];

  @Column()
  @ManyToOne(() => Project, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "projectId" })
  projectId: Project["id"];
}
