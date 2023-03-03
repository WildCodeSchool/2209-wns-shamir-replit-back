import { ExpressControllerFunction } from "../interfaces";
import authService from "../services/authService";
import { TokenPayload } from "../tools/createApolloServer";

export const authMiddleware: ExpressControllerFunction = async (
  req,
  res,
  next
) => {
  const Authorization = req?.headers.authorization;

  if (Authorization && Authorization.includes("Bearer ")) {
    const bearer = Authorization.split("Bearer ")[1];

    const userPayload = authService.verifyToken(bearer) as TokenPayload;

    req.token = userPayload;

    if (userPayload && next) return next();
  }

  res.sendStatus(500);
};
