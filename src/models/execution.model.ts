import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Execution {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  execution_date: Date;

  @Field()
  @Column()
  output?: string;

  @Column()
  @ManyToOne(() => User, (user) => user.execution)
  user: User

  @Column()
  @ManyToOne(() => Project, (project) => project.execution)
  project: Project
}
