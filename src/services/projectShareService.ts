import { Repository } from "typeorm";
import { IProjectShare } from "../interfaces/InputType";
import { User, Project } from "../models";
import { ProjectShare } from "../models/project_share.model";
import { dataSource } from "../tools/createDataSource";

const repository: Repository<ProjectShare> =
  dataSource.getRepository(ProjectShare);
const userRepo: Repository<User> = dataSource.getRepository(User);
const projectRepo: Repository<Project> = dataSource.getRepository(Project);

const projectShareService = {
  getById: async (uid: number, projectShareId: number) => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("inputs null");
    return await repository.findOne({
      relations: { project: true, user: true },
      where: {
        id: projectShareId,
        user: user,
      },
    });
  },

  getAll: async (): Promise<ProjectShare[]> =>
    await repository.find({
      relations: {
        user: true,
        project: true,
      },
    }),

  create: async (data: IProjectShare, uid: number): Promise<ProjectShare> => {
    const user = await userRepo.findOneBy({ id: uid });
    const project = await projectRepo.findOneBy({ id: data.projectId });

    if (user === null) throw new Error("inputs null");
    if (project === null) throw new Error("filecode null");

    return await repository.save({
      ...data,
      user,
      project,
    });
  },
  update: async (
    data: IProjectShare,
    uid: number,
    projectShareId: number
  ): Promise<ProjectShare> => {
    const projectShare = await projectShareService.getById(uid, projectShareId);
    if (projectShare === null) throw new Error("you have no rights");
    await repository.update(projectShareId, { ...data });
    return projectShare;
  },

  delete: async (
    uid: number,
    projectShareId: number
  ): Promise<ProjectShare> => {
    const projectShare = await projectShareService.getById(uid, projectShareId);
    if (projectShare === null) throw new Error("you have no rights");
    await repository.delete(projectShareId);
    return projectShare;
  },

  // Recup la liste des projectShare par l'idProjet
  getUserCanEdit: async (
    uid: number,
    projectId: number
  ): Promise<ProjectShare[]> => {
    const user = await userRepo.findOneBy({ id: uid });
    const project = await projectRepo.findOneBy({ id: projectId });

    if (user === null) throw new Error("inputs null");
    if (project === null) throw new Error("inputs null");

    return await repository.find({
      relations: { project: true, user: true },
      where: {
        write: true,
        project: project,
        user: user,
      },
    });
  },

  // Recup la liste des projectShare par l'idProjet
  getUserCanView: async (projectId: number) => {
    const project = await projectRepo.findOneBy({ id: projectId });
    if (project === null) throw new Error("inputs null");
    return await repository.findBy({
      project: project,
    });
  },
};

export default projectShareService;
