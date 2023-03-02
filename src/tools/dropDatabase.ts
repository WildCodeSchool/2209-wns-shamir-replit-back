import { dataSource } from "./createDataSource";

const migrate = async () => {
  try {
    await dataSource.initialize();
    await dataSource.dropDatabase();
    console.log(
      `database ${
        process.env.NODE_ENV === "test"
          ? process.env.POSTGRES_DB_TEST
          : process.env.POSTGRES_DB
      } dropped 💀`
    );
  } catch (error) {
    console.log(error);
  }
};

migrate();
