import { DeleteResult, Repository } from "typeorm";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import { dataSource } from "../tools/createDataSource";

const repository: Repository<Project> = dataSource.getRepository(Project);

const projectService = {
  // CRUD Classique

  getById: async (projectId: number): Promise<Project[]> => {
    return await repository.find({
      relations: {
        execution: true,
        projectShare: true,
      },
      where: { id: projectId },
    });
  },

  getAll: async (): Promise<Project[]> => {
    try {
      return await repository.find({
        relations: { userId: true },
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de récupérer les projets");
    }
  },
  create: async (
    userId: number,
    name: string,
    description: string,
    isPublic: boolean,
    idStorageNumber: string
  ): Promise<Project> => {
    try {
      const newProject = {
        userId,
        name,
        description,
        isPublic,
        nb_likes: 0,
        nb_views: 0,
        id_storage_number: idStorageNumber,
      };
      return await repository.save(newProject);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },
  update: async (project: iProject, projectId: number): Promise<Project[]> => {
    try {
      await repository.update(projectId, project);
      return await projectService.getById(projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de mettre à jour le projet");
    }
  },

  delete: async (projectId: number): Promise<Project> => {
    try {
      const [project] = await projectService.getById(projectId);
      await repository.delete(projectId);
      return project;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de supprimer le projet");
    }
  },
};

export default projectService;
