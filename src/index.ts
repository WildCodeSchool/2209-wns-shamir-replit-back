import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { executeCodeController } from "./controllers/executeCodeController";
import http from "http";
import { createApolloServer } from "./tools/createApolloServer";
import "reflect-metadata";

const port = 5000;

dotenv.config();

async function listen(port: number) {
  const app = express();

  const router = express.Router();

  router.post("/executeCode", executeCodeController);

  app.use("/api", cors<cors.CorsRequest>(), bodyParser.json(), router);

  const httpServer = http.createServer(app);

  const server = await createApolloServer({ httpServer });

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
