import { Repository } from "typeorm";
import { Like, Project, User } from "../models";
import { dataSource } from "../tools/createDataSource";

const likeRepo: Repository<Like> = dataSource.getRepository(Like);
const userRepo: Repository<User> = dataSource.getRepository(User);
const projectRepo: Repository<Project> = dataSource.getRepository(Project);

const likeService = {
  getById: async (uid: number, likeId: number) => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("inputs null");

    return await likeRepo.findOne({
      relations: { user: true, project: true },
      where: {
        id: likeId,
        user: user,
      },
    });
  },

  getByProjId: async (uid: number, projectId: number) => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("inputs null");
    const project = await projectRepo.findOneBy({ id: projectId });
    if (project === null) throw new Error("inputs null");

    return await likeRepo.findOne({
      relations: { user: true, project: true },
      where: {
        project: project,
        user: user,
      },
    });
  },

  getAll: async (): Promise<Like[]> =>
    await likeRepo.find({
      relations: {
        user: true,
        project: true,
      },
    }),
  create: async (projectId: number, uid: number): Promise<Like> => {
    const user = await userRepo.findOneBy({ id: uid });
    const project = await projectRepo.findOneBy({ id: projectId });

    if (user === null) throw new Error("inputs null");
    if (project === null) throw new Error("filecode null");
    return await likeRepo.save({ project, user });
  },

  delete: async (uid: number, likeId: number): Promise<Like> => {
    const like = await likeService.getById(uid, likeId);
    if (like === null) throw new Error("fu");
    await likeRepo.delete(likeId);
    return like;
  },
};

export default likeService;
