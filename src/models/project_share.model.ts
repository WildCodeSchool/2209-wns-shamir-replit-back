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

  @Field()
  @Column()
  read: boolean;

  @Field()
  @Column()
  write: boolean;

  @Field()
  @Column()
  comment: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.projectShare, {
    onDelete: "CASCADE",
    eager: true,
  })
  user: User;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.projectShare, {
    onDelete: "CASCADE",
    eager: true,
  })
  project: Project;
}
