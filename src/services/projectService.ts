import { Repository } from "typeorm";
import {  IProject } from "../interfaces/InputType";
import { ProjectShare, User } from "../models";
import { Project } from "../models/project.model";
import { dataSource } from "../tools/createDataSource";

const projectRepo: Repository<Project> = dataSource.getRepository(Project);
const projectShareRepo: Repository<ProjectShare> =
  dataSource.getRepository(ProjectShare);

const userRepo: Repository<User> = dataSource.getRepository(User);

const projectService = {
  // CRUD Classique


  getByProjId: async (
    uid: number,
    projectId: number
  ): Promise<Project | null> => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("inputs null");
    return await projectRepo.findOne({
      relations: {
        execution: true,
        projectShare: true,
        user: true,
        like: true,
      },
      where: { id: projectId, user: user },
    });
  },

  getProjByUserId: async (userId: number): Promise<Project[]> => {
    return await projectRepo.find({

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
      return await projectRepo.find({
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
      const user = await userRepo.findOneBy({ id: uid });
      if (user === null) throw new Error("user not found");
      return await projectRepo.find({
        relations: {
          user: true,
          like: true,
          projectShare: true,
          execution: true,
          fileCode: true,
        },
        where: { isPublic: true, user: user },
        order: { name: "ASC" },
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de récupérer les projets");
    }
  },

  getSharedWithMeProj: async (uid: number): Promise<Project[]> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      if (user === null) throw new Error("user not found");

      return await projectRepo.find({
        relations: {
          user: true,
          like: true,
          projectShare: true,
          execution: true,
          fileCode: true,
        },
        where: { projectShare: { user: user } },
        order: { name: "ASC" },
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de récupérer les projets");
    }
  },

  create: async (data: IProject, uid: number): Promise<Project> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      if (user === null) throw new Error("inputs null");
      return await projectRepo.save({ ...data });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },
  update: async (
    project: IProject,
    uid: number,
    projectId: number
  ): Promise<Project> => {
    try {
      const proj = await projectService.getByProjId(uid, projectId);
      if (proj === null) throw new Error("fu");

      await projectRepo.update(projectId, { ...project });
      return proj;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de mettre à jour le projet");
    }
  },

  delete: async (uid: number, projectId: number): Promise<Project> => {
    try {
      const project = await projectService.getByProjId(uid, projectId);
      if (project === null) throw new Error("fu");
      await projectRepo.delete(projectId);
      return project;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de supprimer le projet");
    }
  },
};

export default projectService;
