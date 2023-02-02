import { Repository, Entity } from "typeorm";
import { User } from "../models/user.model";
import { dataSource } from "../tools/createDataSource";
import * as argon2 from "argon2";
import { iUser } from "../interfaces/InputType";

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

  // getOne: async (user: User): Promise<User> => {
  //   return await repository.getId(user);
  // },

  getById: async (userId: number): Promise<User[]> => {
    return await repository.find({
      relations: {
        execution: true,
        project: true,
        projectShare: true,
        fileCode: true,
        codeComment: true,
        commentAnswer: true,
      },
      where: { id: userId },
    });
  },

  getAll: async (): Promise<User[]> => {
    return await repository.find({
      relations: {
        execution: true,
        project: true,
        projectShare: true,
        fileCode: true,
        codeComment: true,
        commentAnswer: true,
      },
    });
  },

  /**
   * Create a new user in the database.
   * @param email user email
   * @param password user password
   * @returns
   */
  create: async (
    email: string,
    password: string,
    login: string
  ): Promise<User> => {
    const newUser = new User();
    newUser.email = email;

    newUser.password_hash = await argon2.hash(password);
    newUser.login = login;
    return await repository.save(newUser);
  },
  update: async (user: iUser, userId: number): Promise<User[]> => {
    await repository.update(userId, user);
    return await userService.getById(userId);
  },

  delete: async (userId: number): Promise<User[]> => {
    const user = await userService.getById(userId);
    await repository.delete(userId);
    return user;
  },
};

export default userService;
