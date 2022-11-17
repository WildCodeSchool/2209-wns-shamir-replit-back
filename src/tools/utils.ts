import { DataSource } from "typeorm";
import { User } from "../models/user.model";

export const dataSource = new DataSource({
  type: "postgres",
  host: "bdd",
  port: 5432,
  username: "wildcode",
  password: "azeaze",
  database: "wildcode",
  synchronize: true,
  entities: [User],
});
