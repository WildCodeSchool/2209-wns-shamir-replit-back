import { Field, ObjectType } from "type-graphql";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.model";
import { User } from "./user.model";

@ObjectType()
@Entity()
export class Like {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "userId" })
  userId: User["id"];

  @Field(() => Project)
  @ManyToOne(() => Project, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "projectId" })
  projectId: Project["id"];
}
