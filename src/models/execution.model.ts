import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.execution, {
    onDelete: "CASCADE",
    eager: true,
  })
  user: User;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.execution, {
    onDelete: "CASCADE",
    eager: true,
  })
  project: Project;
}
