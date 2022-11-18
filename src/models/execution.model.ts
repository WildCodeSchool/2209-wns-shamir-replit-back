import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Execution {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  execution_date: Date;

  @Column()
  output?: string;
  
  @ManyToOne(() => User, (user) => user.execution)
  user: User;

  @ManyToOne(() => Project, (project) => project.execution)
  project: Project;
}
