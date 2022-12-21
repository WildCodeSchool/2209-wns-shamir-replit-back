import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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
  comment: boolean;

  @Column()
  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "userId" })
  userId: User["id"];

  @Column()
  @ManyToOne(() => Project, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "projectId" })
  projectId: Project["id"];
}
