import { Field, InputType, ObjectType } from "type-graphql";
import "reflect-metadata";

@InputType()
export class IProject {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  nb_views: number;

  @Field({ nullable: true })
  isPublic: boolean;

  @Field({ nullable: true })
  id_storage_number: string;
}

@InputType()
export class IUser {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  login?: string;

  @Field({ nullable: true })
  date_start_subscription?: Date;

  @Field({ nullable: true })
  date_end_subscription?: Date;
}

@InputType()
export class CreateUser {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  login: string;

  @Field({ nullable: true })
  date_start_subscription?: Date;

  @Field({ nullable: true })
  date_end_subscription?: Date;
}
@InputType()
export class ICodeComment {
  @Field({ nullable: false })
  fileCodeId: number;

  @Field({ nullable: true })
  line_number: number;

  @Field({ nullable: true })
  char_number: number;

  @Field({ nullable: true })
  char_length: number;

  @Field({ nullable: true })
  resolved: boolean;

  @Field({ nullable: false })
  comment: string;

  @Field({ nullable: true })
  is_report: boolean;
}

@InputType()
export class IProjectShare {
  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  read: boolean;

  @Field({ nullable: true })
  write: boolean;

  @Field({ nullable: true })
  comment: boolean;
}

@InputType()
export class ILike {
  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  userId: number;
}

@InputType()
export class IFileCode {
  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  id_storage_file: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  language: string;
}

@InputType()
export class IExecution {
  @Field({ nullable: false })
  projectId: number;

  @Field({ nullable: false })
  userId: number;

  @Field({ nullable: false })
  output: string;
}

@InputType()
export class ICommentAnswer {
  @Field({ nullable: true })
  codeCommentId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  comment: string;
}

@InputType()
@ObjectType()
export class IFilesWithCode {
  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  language: string;

  @Field({ nullable: true })
  code: string;
}
