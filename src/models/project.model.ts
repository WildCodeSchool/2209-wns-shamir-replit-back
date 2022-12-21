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

  @OneToMany(() => FileCode, (fileCode) => fileCode.projectId)
  file: File[];

  @OneToMany(() => ProjectShare, (projectShare) => projectShare.projectId)
  projectShare: ProjectShare[];

  @OneToMany(() => Execution, (execution) => execution.projectId)
  execution: Execution[];

  @Column()
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: User["id"];
}
