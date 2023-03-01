import { Repository } from "typeorm";
import { iLike } from "../interfaces/InputType";
import { Like } from "../models";
import { dataSource } from "../tools/createDataSource";

const repository: Repository<Like> = dataSource.getRepository(Like);

const likeService = {
  getById: async (likeId: number) => {
    return (await repository.findBy({ id: likeId }))[0];
  },

  getAll: async (): Promise<Like[]> => {
    return await repository.find({
      relations: {
        user: true,
        project: true,
      },
    });
  },
  // create: async (projectId: number, userId: number): Promise<Like> => {
  //   const newLike = {
  //     projectId,
  //     userId,
  //   };
  //   return await repository.save(newLike);
  // },
  update: async (like: iLike, likeId: number): Promise<Like> => {
    await repository.update(likeId, like);
    return await likeService.getById(likeId);
  },

  delete: async (likeId: number): Promise<Like> => {
    const like = await likeService.getById(likeId);
    await repository.delete(likeId);
    return like;
  },
};

export default likeService;
