import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { executeCodeController } from "./controllers/executeCodeController";
import http from "http";
import { createApolloServer } from "./tools/createApolloServer";
import "reflect-metadata";
import { projectController } from "./controllers/projectController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { executionCountMiddleware } from "./middlewares/executionCountMiddleware";
import { Server } from "socket.io";
import { stripeController } from "./controllers/stripeController";
import tasks from "./tasks";

const port = 5000;

dotenv.config();

const expressServer = () => {
  const app = express();

  tasks.initScheduledJobs();

  const router = express.Router();

  router.post(
    "/executeCode",
    authMiddleware,
    executionCountMiddleware,
    executeCodeController
  );
  router.get("/download/:projectId", authMiddleware, projectController);
  router.post("/stripe", authMiddleware, stripeController);

  app.use("/api", cors<cors.CorsRequest>(), bodyParser.json(), router);

  return app;
};

const apolloServer = async (port: number, app: Express) => {
  const httpServer = http.createServer(app);

  const server = await createApolloServer({ httpServer });

  await server.start();

  server.applyMiddleware({ app });

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once("listening", resolve).once("error", reject);
  });
};

const websocketServer = async (app: Express) => {
  // STARTING WEBSOCKET
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    path: "/websocket/",
  });

  io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);

    // upon disconnection
    socket.on("disconnect", (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
  });

  io.listen(process.env.NODE_ENV !== "test" ? 5001 : 0);

  console.log("io", io);
  return io;
};

export let io: Server;

async function main() {
  try {
    const app = expressServer();
    io = await websocketServer(app);
    await apolloServer(port, app);

    console.log(`🚀 Server is ready at http://localhost:${port}/graphql`);
  } catch (err) {
    console.error("💀 Error starting the node server", err);
  }
}

void main();
