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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
  }
};

migrate();
