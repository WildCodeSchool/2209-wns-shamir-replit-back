import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Execution } from "./execution.model";
import { FileCode } from "./file.model";
import { Like } from "./like.model";
import { ProjectShare } from "./project_share.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Project {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column({ default: 0 })
  nb_views: number;

  @Field()
  @Column({ nullable: true })
  isPublic: boolean;

  @Field()
  @Column({ nullable: true })
  id_storage_number: string;

  @Field(() => [FileCode], { nullable: true })
  @OneToMany(() => FileCode, (fileCode) => fileCode.project)
  fileCode: FileCode[];

  @Field(() => [ProjectShare], { nullable: true })
  @OneToMany(() => ProjectShare, (projectShare) => projectShare.project)
  projectShare: ProjectShare[];

  @Field(() => [Like], { nullable: true })
  @OneToMany(() => Like, (like) => like.project)
  like: Like[];

  @Field(() => [Execution], { nullable: true })
  @OneToMany(() => Execution, (execution) => execution.project)
  execution: Execution[];

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.project, {
    onDelete: "CASCADE",
    eager: true,
  })
  user: User;
}
