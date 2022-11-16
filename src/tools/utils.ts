import { DataSource } from "typeorm";

const dataSource: DataSource = new DataSource({
  type: "sqlite",
  database: "./wildersdb.sqlite",
  synchronize: true,
  entities: [Wilder, Wilder_Skills, Skills],
  // logging: ["query", "error"],
});

export default dataSource;
