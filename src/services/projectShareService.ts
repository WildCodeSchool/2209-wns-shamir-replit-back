import { Repository } from "typeorm";
import { ProjectShare } from "../models/project_share.model";
import { dataSource } from "../tools/utils";

const repository: Repository<ProjectShare> =
  dataSource.getRepository(ProjectShare);

const projectShareService = {
  getById: async (projectShareId: number) => {
    return await repository.findOneByOrFail({ id: projectShareId });
  },

  getAll: async (): Promise<ProjectShare[]> => {
    return await repository.find();
  },
  create: async (
    read: boolean,
    write: boolean,
    comment: boolean
  ): Promise<ProjectShare> => {
    const newProjectShare = {
      read,
      write,
      comment,
    };
    return await repository.save(newProjectShare);
  },
  update: async (
    projectShare: ProjectShare,
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
