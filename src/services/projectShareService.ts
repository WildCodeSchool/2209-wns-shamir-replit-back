import { Repository } from "typeorm";
import { iProjectShare } from "../interfaces/InputType";
import { ProjectShare } from "../models/project_share.model";
import { dataSource } from "../tools/utils";

const repository: Repository<ProjectShare> =
  dataSource.getRepository(ProjectShare);

const projectShareService = {
  getById: async (projectShareId: number) => {
    return (await repository.findBy({ id: projectShareId }))[0];
  },

  getAll: async (): Promise<ProjectShare[]> => {
    return await repository.find({
      relations: {
        userId: true,
        projectId: true,
      },
    });
  },
  create: async (
    projectId: number,
    userId: number,
    read: boolean,
    write: boolean,
    comment: boolean
  ): Promise<ProjectShare> => {
    const newProjectShare = {
      projectId,
      userId,
      read,
      write,
      comment,
    };
    return await repository.save(newProjectShare);
  },
  update: async (
    projectShare: iProjectShare,
    projectShareId: number
  ): Promise<ProjectShare> => {
    await repository.update(projectShareId, projectShare);
    return await projectShareService.getById(projectShareId);
  },

  delete: async (projectShareId: number): Promise<ProjectShare> => {
    const projectShare = await projectShareService.getById(projectShareId);
    await repository.delete(projectShareId);
    return projectShare;
  },
};

export default projectShareService;