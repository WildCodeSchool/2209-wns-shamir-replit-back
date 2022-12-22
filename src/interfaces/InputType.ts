import { Field, InputType } from "type-graphql";
import "reflect-metadata";

@InputType()
export class iProject {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  nb_likes: number;

  @Field({ nullable: true })
  nb_views: number;

  @Field({ nullable: true })
  public: boolean;

  @Field({ nullable: true })
  id_storage_number: string;
}

@InputType()
export class iUser {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  login: string;

  @Field({ nullable: true })
  date_start_subscription: Date;

  @Field({ nullable: true })
  date_end_subscription: Date;
}

@InputType()
export class iCodeComment {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  fileId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  line_number: number;

  @Field({ nullable: true })
  char_number: number;

  @Field({ nullable: true })
  char_length: number;

  @Field({ nullable: true })
  resolved: boolean;

  @Field({ nullable: true })
  comment: string;

  @Field({ nullable: true })
  comment_date: Date;

  @Field({ nullable: true })
  is_report: boolean;
}

@InputType()
export class iProjectShare {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  read: boolean;

  @Field({ nullable: true })
  write: boolean;

  @Field({ nullable: true })
  comment: boolean;
}

@InputType()
export class iFileCode {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  id_storage_file: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  language: string;
}

@InputType()
export class iExecution {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  execution_date: Date;

  @Field({ nullable: true })
  output: string;
}

@InputType()
export class iCommentAnswer {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  codeCommentId: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  comment: string;

  @Field({ nullable: true })
  answer_date: Date;
}
