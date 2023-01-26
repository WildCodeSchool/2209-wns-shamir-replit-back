import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { CodeCommentResolver } from "../resolvers/codeCommentResolver";
import { CommentAnswerResolver } from "../resolvers/commentAnswerResolver";
import { ExecutionResolver } from "../resolvers/executionResolver";
import { FileResolver } from "../resolvers/fileResolver";
import { ProjectResolver } from "../resolvers/projectResolver";
import { ProjectShareResolver } from "../resolvers/projectShareResolver";
import { UserResolver } from "../resolvers/userResolver";
import http from "http";
import authService from "../services/authService";
import { dataSource } from "./createDataSource";
import * as dotenv from "dotenv";

dotenv.config();

export const createApolloServer = async (
  httpServer?: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >
) => {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ProjectResolver,
      ProjectShareResolver,
      CodeCommentResolver,
      CommentAnswerResolver,
      ExecutionResolver,
      FileResolver,
    ],
  });

  const plugins = httpServer
    ? [ApolloServerPluginDrainHttpServer({ httpServer })]
    : [];

  return new ApolloServer({
    schema,
    context: httpServer
      ? ({ req }) => {
          if (
            req.headers.authorization === undefined ||
            process.env.JWT_SECRET_KEY === undefined
          ) {
            return {};
          } else {
            try {
              const bearer = req?.headers.authorization.split("Bearer ")[1];
              console.log("BEARER : ", bearer);

              const userPayload = authService.verifyToken(bearer);

              console.log("userPayload", userPayload);

              return { user: userPayload };
            } catch (e) {
              console.log("err", e);
              return {};
            }
          }
        }
      : undefined,
    plugins,
  });
};
