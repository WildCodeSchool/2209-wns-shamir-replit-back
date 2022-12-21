import { Repository } from "typeorm";
import { Project } from "../models/project.model";
import { dataSource } from "../tools/utils";

const repository: Repository<Project> = dataSource.getRepository(Project);

const projectService = {
  getById: async (projectId: number) => {
    return await repository.findOneByOrFail({ id: projectId });
  },

  getAll: async (): Promise<Project[]> => {
    return await repository.find();
  },
  create: async (
    userId: number,
    name: string,
    description: string,
    isPublic: boolean
  ): Promise<Project> => {
    const newProject = {
      userId,
      name,
      description,
      isPublic,
      nb_likes: 0,
      nb_views: 0,
      id_storage_number: "",
    };
    return await repository.save(newProject);
  },
  update: async (project: Project, projectId: number): Promise<Project> => {
    await repository.update(projectId, project);
    return await projectService.getById(projectId);
  },

  delete: async (projectId: number): Promise<Project> => {
    const project = await projectService.getById(projectId);
    await repository.delete(projectId);
    return project;
  },
};

export default projectService;
