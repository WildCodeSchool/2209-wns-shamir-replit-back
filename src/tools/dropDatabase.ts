import { dataSource } from "./utils";

const migrate = async () => {
  await dataSource.initialize();
  await dataSource.dropDatabase();
  console.log(
    `database ${
      process.env.NODE_ENV === "test"
        ? process.env.POSTGRES_DB_TEST
        : process.env.POSTGRES_DB
    } dropped 💀`
  );
};

migrate();
