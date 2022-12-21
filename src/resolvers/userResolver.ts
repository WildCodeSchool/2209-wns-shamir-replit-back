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
    const userFromDB = await userService.create(email, password);
    console.log(userFromDB);
    return userFromDB;
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return await userService.getAll();
  }
  @Query(() => User)
  async getUserById(@Arg("userId") userId: number): Promise<User> {
    return await userService.getById(userId);
  }

  @Mutation(() => String)
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
          email: userFromDB.email,
        });

        // Renvoyer le token
        return token;
      } else {
        throw new Error();
      }
    } catch (e) {
      throw new Error("Invalid Auth");
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("User") User: iUser,
    @Arg("userId") userId: number
  ): Promise<User> {
    try {
      return await userService.update(User, userId);
    } catch (e) {
      throw new Error("Can't update User");
    }
  }

  @Mutation(() => User)
  async deleteUser(@Arg("userId") userId: number): Promise<User> {
    try {
      return await userService.delete(userId);
    } catch (e) {
      throw new Error("Can't delete User");
    }
  }
}
