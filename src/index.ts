import { ApolloServer } from "apollo-server";
import dataSource from "./tools/utils";
import { buildSchema } from "type-graphql";

const port = 5000;

const start = async (): Promise<void> => {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [WilderResolver, SkillsResolver],
  });
  const server = new ApolloServer({ schema });

  try {
    const { url } = await server.listen({ port });
    console.log(`server ready at ${url}`);
  } catch (e) {
    console.error(e);
  }
};

start();
