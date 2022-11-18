import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class ProjectShare {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  read: boolean;

  @Column()
  write: boolean;

  @Column()
  comment: boolean
  
  @ManyToOne(() => User, (user) => user.projectShare)
  user: User;
  
  @ManyToOne(() => Project, (project) => project.projectShare)
  project: Project;
}
