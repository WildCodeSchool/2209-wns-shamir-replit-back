import { Repository } from "typeorm";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import { dataSource } from "../tools/createDataSource";
import fs from "fs";

const repository: Repository<Project> = dataSource.getRepository(Project);

const projectService = {
  // CRUD Classique
  getById: async (projectId: number) => {
    return (await repository.findBy({ id: projectId }))[0];
  },

  getAll: async (): Promise<Project[]> => {
    return await repository.find({
      relations: { userId: true },
    });
  },
  create: async (
    userId: number,
    name: string,
    description: string,
    isPublic: boolean,
    idStorageNumber: string
  ): Promise<Project> => {
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
  },
  update: async (project: iProject, projectId: number): Promise<Project> => {
    await repository.update(projectId, project);
    return await projectService.getById(projectId);
  },

  delete: async (projectId: number): Promise<Project> => {
    const project = await projectService.getById(projectId);
    await repository.delete(projectId);
    return project;
  },

  // Folders functions

  createFolder: async (folderName: string, userId: number) => {
    // On stock le chemin du dossier dans une variable
    const sourceDir = "./projects/";
    // On créer le chemin de création du dossier
    const pathToCreate = `${sourceDir}${folderName}`;

    // Fonction de NodeJS qui permet de créer un dossier avec une gestion d'erreur
    try {
      // On verifie si le dossier existe
      console.log("On rentre dans le try, folderName", pathToCreate);
      if (!fs.existsSync(pathToCreate)) {
        fs.mkdirSync(pathToCreate);
        console.log("Directory is created.");
        return folderName;
      } else {
        console.log("Directory already exists.");
      }
    } catch (err) {
      console.log(
        "Un problème est survenu lors de la création d'un dossier",
        err
      );
    }
  },
};

export default projectService;
