import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { dataSource } from "./tools/utils";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { ProjectResolver } from "./resolvers/projectResolver";
import { ProjectShareResolver } from "./resolvers/projectShareResolver";
import { CodeCommentResolver } from "./resolvers/codeCommentResolver";
import { CommentAnswerResolver } from "./resolvers/commentAnswerResolver";
import { ExecutionResolver } from "./resolvers/executionResolver";
import authService from "./services/authService";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import * as dotenv from "dotenv";
import { executeCodeController } from "./controllers/executeCodeController";

const port = 5000;

dotenv.config();

async function listen(port: number) {
  const app = express();

  const router = express.Router();

  router.post("/executeCode", executeCodeController);

  app.use("/api", cors<cors.CorsRequest>(), bodyParser.json(), router);

  const httpServer = http.createServer(app);

  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ProjectResolver,
      ProjectShareResolver,
      CodeCommentResolver,
      CommentAnswerResolver,
      ExecutionResolver,
    ],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
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
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once("listening", resolve).once("error", reject);
  });
}

async function main() {
  try {
    await listen(port);
    console.log(`🚀 Server is ready at http://localhost:${port}/graphql`);
  } catch (err) {
    console.error("💀 Error starting the node server", err);
  }
}

void main();
