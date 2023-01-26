import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iUser } from "../interfaces/InputType";
import { User } from "../models/user.model";
import authService from "../services/authService";
import userService from "../services/userService";

@Resolver(iUser)
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    try {
      const userFromDB = await userService.create(email, password);
      return userFromDB;
    } catch (err) {
      console.error(err);
      throw new Error("Can't create User");
    }
  }

  @Query(() => [User])
  async getAllUsers(
    parent: any,
    args: any,
    contextValue: any,
    info: any
  ): Promise<User[]> {
    try {
      console.log("contextValue", contextValue);
      return await userService.getAll();
    } catch (err) {
      console.error(err);
      throw new Error("Can't get all Users");
    }
  }

  @Query(() => [User])
  async getUserById(@Arg("userId") userId: number): Promise<User[]> {
    try {
      return await userService.getById(userId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't get User");
    }
  }

  @Query(() => String)
  async getToken(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<String> {
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
        return token;
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      throw new Error("Invalid Auth");
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("User") User: iUser,
    @Arg("userId") userId: number
  ): Promise<User[]> {
    try {
      return await userService.update(User, userId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update User");
    }
  }

  @Mutation(() => User)
  async deleteUser(@Arg("userId") userId: number): Promise<User[]> {
    try {
      return await userService.delete(userId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete User");
    }
  }
}
