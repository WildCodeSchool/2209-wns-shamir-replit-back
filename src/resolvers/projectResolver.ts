import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { iProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import projectService from "../services/projectService";
import string from "string-sanitizer";
import { fileManager } from "../tools/fileManager";
import { Context } from "apollo-server-core";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(iProject)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("userId") userId: number,
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("isPublic") isPublic: boolean,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project> {
    try {
      if (userId !== ctx.id) throw new Error("userId not allowed");
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
  async getPublicProjects(
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project[]> {
    try {
      const projects = await projectService.getAll();
      return projects.filter((project) => project.isPublic);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find public Projects");
    }
  }

  @Query(() => [Project])
  async getSharedWithMeProjects(
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project[]> {
    try {
      const projects = await projectService.getAll();
      return projects.filter((project) =>
        project.projectShare.map((pshare) => pshare.user.id).includes(ctx.id)
      );
    } catch (err) {
      console.error(err);
      throw new Error("Can't find shared with me Projects");
    }
  }

  @Query(() => [Project])
  async getAllProjects(@Ctx() ctx: Context<TokenPayload>): Promise<Project[]> {
    try {
      const projects = await projectService.getAll();
      return projects.filter((project) => project.user.id === ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Projects");
    }
  }

  @Query(() => Project)
  async getProjectById(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project[]> {
    try {
      const projects = await projectService.getById(projectId);
      return projects.filter((project) => project.user.id === ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Project");
    }
  }

  @Mutation(() => Project)
  async updateProject(
    @Arg("project") project: iProject,
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project[]> {
    try {
      const [_project] = await projectService.getById(projectId);
      if (_project.user.id !== ctx.id) throw new Error("userId not allowed");
      return await projectService.update(project, projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async deleteProject(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project> {
    try {
      const [project] = await projectService.getById(projectId);
      // Suppression du dossier du projet sur le server

      if (project.user.id !== ctx.id) throw new Error("userId not allowed");

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
    @Arg("clientPath") clientPath: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project | undefined> {
    try {
      // On stock les informations du projet dans une variable
      const project: any = await projectService.getById(projectId);

      if (project[0].user.id !== ctx.id) throw new Error("userId not allowed");

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
