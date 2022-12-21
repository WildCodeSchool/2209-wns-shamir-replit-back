import { Repository } from "typeorm";
import { User } from "../models/user.model";
import { dataSource } from "../tools/utils";
import * as argon2 from "argon2";

const repository: Repository<User> = dataSource.getRepository(User);

const userService = {
  /**
   * Return the user relative to the given email
   * @param email user email
   * @returns
   */
  getByEmail: async (email: string) => {
    return await repository.findOneByOrFail({ email });
  },
  getById: async (userId: number) => {
    return await repository.findOneByOrFail({ id: userId });
  },

  getAll: async (): Promise<User[]> => {
    return await repository.find();
  },

  /**
   * Create a new user in the database.
   * @param email user email
   * @param password user password
   * @returns
   */
  create: async (email: string, password: string): Promise<User> => {
    const newUser = new User();
    newUser.email = email;

    newUser.password_hash = await argon2.hash(password);
    newUser.login = "login";
    return await repository.save(newUser);
  },
  update: async (user: User, userId: number): Promise<User> => {
    await repository.update(userId, user);
    return await userService.getById(userId);
  },

  delete: async (userId: number): Promise<User> => {
    const user = await userService.getById(userId);
    await repository.delete(userId);
    return user;
  },
};

export default userService;
