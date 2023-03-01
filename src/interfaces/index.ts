import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "../tools/createApolloServer";

export type ExpressControllerFunction = (
  req: Request & {
    token?: TokenPayload;
    nbExecutions?: number;
  },
  res: Response,
  next?: NextFunction
) => Promise<void>;
