import { DataSource } from "typeorm";
import {
  User,
  CodeComment,
  CommentAnswer,
  Execution,
  Project,
  ProjectShare,
  FileCode,
} from "../models/index";
import * as dotenv from "dotenv";

dotenv.config();

export const dataSource = new DataSource({
  type: "postgres",
  host: "bdd",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_DB_TEST
      : process.env.POSTGRES_DB,
  synchronize: true,
  entities: [
    User,
    CodeComment,
    CommentAnswer,
    Execution,
    Project,
    ProjectShare,
    FileCode,
  ],
});
