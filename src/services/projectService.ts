import { truncateSync } from "fs";
import { ID } from "type-graphql";
import { Repository } from "typeorm";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import { dataSource } from "../tools/createDataSource";

const repository: Repository<Project> = dataSource.getRepository(Project);

const projectService = {
  // CRUD Classique

  getByProjId: async (projectId: number): Promise<Project[]> => {
    return await repository.find({
      relations: {
        execution: true,
        projectShare: true,
        user: true,
        like: true,
      },
      where: { id: projectId },
    });
  },

  getProjByUserId: async (userId: number): Promise<Project[]> => {
    return await repository.find({
      relations: {
        execution: true,
        projectShare: true,
        user: true,
        like: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });
  },

  getAll: async (userId: number): Promise<Project[]> => {
    try {
      return await repository.find({
        relations: {
          user: true,
          like: true,
          projectShare: true,
          execution: true,
          fileCode: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de récupérer les projets");
    }
  },

  getAllPublicProj: async (uid: number): Promise<Project[]> => {
    try {
      return await repository.find({
        relations: {
          user: true,
          like: true,
          projectShare: true,
          execution: true,
          fileCode: true,
        },
        where: { isPublic: true, user: { id: uid } },
        order: { name: "ASC" },
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de récupérer les projets");
    }
  },

  getSharedWithMeProj: async (userID: number): Promise<Project[]> => {
    try {
      return await repository.find({
        relations: { user: true, like: true, projectShare: true },
        where: { projectShare: { user: { id: userID } } },
        order: { name: "ASC" },
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
        nb_views: 0,
        id_storage_number: idStorageNumber,
      };
      return await repository.save(newProject);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },
  // update: async (
  //   project: Partial<iProject>,
  //   projectId: number
  // ): Promise<Project[]> => {
  //   try {
  //     await repository.update(projectId, project);
  //     return await projectService.getById(ctx.id, projectId);
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Impossible de mettre à jour le projet");
  //   }
  // },

  // delete: async (projectId: number): Promise<Project> => {
  //   try {
  //     const [project] = await projectService.getById(ctx.id, projectId);
  //     await repository.delete(projectId);
  //     return project;
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Impossible de supprimer le projet");
  //   }
  // },
};

export default projectService;
