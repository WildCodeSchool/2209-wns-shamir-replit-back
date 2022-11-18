import { DataSource } from "typeorm";
import {User, 
        CodeComment, 
        CommentAnswer, 
        Execution, 
        Project, 
        ProjectShare,
        FileCode} from "../models/index";

export const dataSource = new DataSource({
  type: "postgres",
  host: "bdd",
  port: 5432,
  username: "wildcode",
  password: "azeaze",
  database: "wildcode",
  synchronize: true,
  entities: [ User, 
              CodeComment, 
              CommentAnswer, 
              Execution, 
              Project, 
              ProjectShare,
              FileCode],
});
