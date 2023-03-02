import { ExpressControllerFunction } from "../interfaces";
import authService from "../services/authService";
import { TokenPayload } from "../tools/createApolloServer";

export const authMiddleware: ExpressControllerFunction = async (
  req,
  res,
  next
) => {
  console.log("authMiddleware", next);

  const Authorization = req?.headers.authorization;

  console.log("Authorization");

  if (Authorization && Authorization.includes("Bearer ")) {
    const bearer = Authorization.split("Bearer ")[1];

    const userPayload = authService.verifyToken(bearer) as TokenPayload;

    req.token = userPayload;

    if (userPayload && next) return next();
  }

  res.sendStatus(500);
};
