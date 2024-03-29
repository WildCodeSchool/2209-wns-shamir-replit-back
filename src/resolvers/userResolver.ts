import { Context } from "apollo-server-core";
import { Arg, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { iUser } from "../interfaces/InputType";
import { User } from "../models/user.model";
import authService from "../services/authService";
import userService from "../services/userService";
import { TokenPayload } from "../tools/createApolloServer";
import sanitizer from "sanitizer";

@Resolver(iUser)
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("login") login: string
  ): Promise<User> {
    try {
      const userFromDB = await userService.create(
        sanitizer.sanitize(email),
        password,
        sanitizer.sanitize(login)
      );
      return userFromDB;
    } catch (err) {
      console.error(err);
      throw new Error("Can't create User");
    }
  }

  @Query(() => [User])
  async getAllUsers(@Ctx() ctx: Context<TokenPayload>): Promise<User[]> {
    try {
      const users = await userService.getAll();

      return users.map((user) => {
        const altUser = user;

        if (user.id !== ctx.id) {
          altUser.date_start_subscription = undefined;
          altUser.date_end_subscription = undefined;
          altUser.email = "";
        }

        return altUser;
      });
    } catch (err) {
      console.error(err);
      throw new Error("Can't get all Users");
    }
  }

  @Query(() => [User])
  async getUserById(
    @Arg("userId") userId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<User[]> {
    try {
      if (userId === ctx.id) return await userService.getById(userId);
      else throw new Error("id not allowed");
    } catch (err) {
      console.error(err);
      throw new Error("Can't get User");
    }
  }

  @Query(() => String)
  async getToken(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    try {
      // Récupérer l'utilisateur dans la bdd suivant l'email
      const userFromDB = await userService.getByEmail(email);
      // Vérifier que ce sont les même mots de passe
      if (
        await authService.verifyPassword(password, userFromDB.password_hash)
      ) {
        // Créer un nouveau token => signer un token
        const token = authService.signJwt({
          id: userFromDB.id,
          email: userFromDB.email,
        });
        // Renvoyer le token
        return JSON.stringify({ token, userId: userFromDB.id });
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      throw new Error("Invalid Auth");
    }
  }

  @Mutation(() => [User])
  async updateUser(
    @Arg("User") User: iUser,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<User[]> {
    try {
      const userId = ctx.id;

      if (User.email) User.email = sanitizer.sanitize(User.email);
      if (User.login) User.login = sanitizer.sanitize(User.login);

      return await userService.update(User, userId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update User");
    }
  }

  @Mutation(() => [User])
  async deleteUser(@Ctx() ctx: Context<TokenPayload>): Promise<User[]> {
    try {
      const userId = ctx.id;
      return await userService.delete(userId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete User");
    }
  }
}
