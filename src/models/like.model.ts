import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Like {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.like, {
    onDelete: "CASCADE",
    eager: true,
    nullable: false,
  })
  user: User;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.like, {
    onDelete: "CASCADE",
    eager: true,
    nullable: false,
  })
  project: Project;
}
