import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import projectService from "../services/projectService";
import string from "string-sanitizer";
import { fileManager } from "../tools/fileManager";

@Resolver(iProject)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("userId") userId: number,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("isPublic") isPublic: boolean
  ): Promise<Project> {
    try {
      // On Stock un timestamp pour avoir un nom unique
      const timeStamp = Date.now();
      // On supprime les espaces et les caractères spéciaux du nom du projet
      const updateName = string.sanitize.keepNumber(name);
      // On crée le nom du dossier avec le timestamp, le nom du projet et l'id de l'utilisateur
      const folderName = `${timeStamp}_${updateName}_${userId}`;

      // On crée le projet dans la base de données
      const projectFromDB = await projectService.create(
        userId,
        name,
        description,
        isPublic,
        folderName
      );
      // Création du dossier du projet sur le server
      await fileManager.createProjectFolder(folderName);
      return projectFromDB;
    } catch (err) {
      console.error(err);
      throw new Error("Can't create Project");
    }
  }

  @Query(() => [Project])
  async getAllProjects(): Promise<Project[]> {
    try {
      return await projectService.getAll();
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Projects");
    }
  }

  @Query(() => Project)
  async getProjectById(
    @Arg("projectId") projectId: number
  ): Promise<Project[]> {
    try {
      return await projectService.getById(projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Project");
    }
  }

  @Mutation(() => Project)
  async updateProject(
    @Arg("project") project: iProject,
    @Arg("projectId") projectId: number
  ): Promise<Project[]> {
    try {
      return await projectService.update(project, projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async deleteProject(@Arg("projectId") projectId: number): Promise<Project> {
    try {
      const [project] = await projectService.getById(projectId);
      // Suppression du dossier du projet sur le server

      await fileManager.deleteProjectFolder(project.id_storage_number);
      await projectService.delete(projectId);
      return project;
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete Project");
    }
  }

  // Sous-dossier

  // Création d'un sous-dossier dans le projet ciblé sur le server
  @Mutation(() => Project)
  async createSubFolder(
    @Arg("projectId") projectId: number,
    @Arg("subFolderName") subFolderName: string,
    @Arg("clientPath") clientPath: string
  ): Promise<Project | undefined> {
    try {
      // On stock les informations du projet dans une variable
      const project: any = await projectService.getById(projectId);
      return await fileManager.createOneSubFolder(
        project,
        clientPath,
        subFolderName
      );
    } catch (err) {
      console.error(err);
      throw new Error("Can't create SubFolder");
    }
  }
}
