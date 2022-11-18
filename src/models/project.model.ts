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
import { ProjectShare } from "./project_share.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Project {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  nb_likes: number;

  @Column()
  nb_views: number;

  @Column()
  public: boolean;

  @Column()
  id_storage_number: string;

  @OneToMany(() => FileCode, (fileCode) => fileCode.project)
  file: File[];

  @OneToMany(() => ProjectShare, (projectShare) => projectShare.project)
  projectShare: ProjectShare[];

  @OneToMany(() => Execution, (execution) => execution.project)
  execution: Execution[];

  @ManyToOne(() => User, (user) => user.project)
  user: User;
}
