import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Execution } from "./execution.model";
import { FileCode } from "./file.model";
import { ProjectShare } from "./project_share.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Project {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field()
  @Column()
  nb_likes: number;

  @Field()
  @Column()
  nb_views: number;

  @Field()
  @Column()
  isPublic: boolean;

  @Field()
  @Column()
  id_storage_number: string;

  @Field(() => [FileCode], { nullable: true })
  @OneToMany(() => FileCode, (fileCode) => fileCode.projectId)
  file: FileCode[];

  @Field(() => [ProjectShare], { nullable: true })
  @OneToMany(() => ProjectShare, (projectShare) => projectShare.project)
  projectShare: ProjectShare[];

  @Field(() => [Execution], { nullable: true })
  @OneToMany(() => Execution, (execution) => execution.projectId)
  execution: Execution[];

  // @Column()
  // @ManyToOne((type) => User, { onDelete: "CASCADE", eager: true })
  // @JoinColumn({ name: "userId" })
  // userId: User["id"];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.project)
  user: User;
}
