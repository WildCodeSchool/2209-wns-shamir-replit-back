import { ApolloServer } from "apollo-server";
import { dataSource } from "./tools/utils";
import { buildSchema } from "type-graphql";
import {UserResolver} from "./resolvers/userResolvers";
import authService from "./services/authService";

const port = 5000;

const start = async (): Promise<void> => {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

   const server = new ApolloServer({schema, context: ({ req }) => {
    if (
      req.headers.authorization === undefined ||
      process.env.JWT_SECRET_KEY === undefined
    ) {
      return {};
    } else {
      try {
        const bearer = req.headers.authorization.split("Bearer ")[1];
        const userPayload = authService.verifyToken(bearer);

        return { user: userPayload };
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  },});

  try {
    const { url }: {url: string} = await server.listen({ port });
    console.log(`server ready at ${url}`);
  } catch (e) {
    console.error(e);
  }
};

start();