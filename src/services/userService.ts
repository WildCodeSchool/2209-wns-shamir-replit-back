import { Repository } from "typeorm";
import { User } from "../models/user.model";
import { dataSource } from "../tools/createDataSource";
import * as argon2 from "argon2";
import { CreateUser, IUser } from "../interfaces/InputType";

const repository: Repository<User> = dataSource.getRepository(User);

const userService = {
  getByEmail: async (email: string) =>
    await repository.findOneByOrFail({ email }),

  getUserIdById: async (userId: number): Promise<User[]> =>
    await repository.find({
      select: { id: true },
      where: { id: userId },
    }),

  getById: async (userId: number): Promise<User | null> =>
    await repository.findOneBy({
      id: userId,
    }),

  getAll: async (): Promise<User[]> =>
    await repository.find({
      relations: {
        execution: true,
        project: true,
        projectShare: true,
        fileCode: true,
        codeComment: true,
        commentAnswer: true,
      },
    }),

  create: async (data: CreateUser): Promise<User> => {
    const newUser = new User();
    newUser.email = data.email;
    newUser.password_hash = await argon2.hash(data.password);
    newUser.login = data.login;
    return await repository.save(newUser);
  },

  update: async (user: IUser, userId: number): Promise<User | null> => {
    await repository.update(userId, user);
    return await userService.getById(userId);
  },

  delete: async (userId: number): Promise<User | null> => {
    const user = await userService.getById(userId);
    await repository.delete(userId);
    return user;
  },
};

export default userService;
