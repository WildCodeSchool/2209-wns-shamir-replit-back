import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IProject } from "../interfaces/InputType";
import { Project } from "../models/project.model";
import { Like } from "../models/like.model";
import projectService from "../services/projectService";
import string from "string-sanitizer";
import { fileManager } from "../tools/fileManager";
import fileService from "../services/fileService";
import { Context } from "apollo-server-core";
import { TokenPayload } from "../tools/createApolloServer";
import { ProjectShare, User } from "../models";
import likeService from "../services/likeService";

@Resolver(Project)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("data") data: IProject,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project> {
    try {
      const userId = ctx.id;
      // On Stock un timestamp pour avoir un nom unique
      const timeStamp = Date.now();
      // On supprime les espaces et les caractères spéciaux du nom du projet
      const updateName = string.sanitize.keepNumber(data.name);
      // On crée le nom du dossier avec le timestamp, le nom du projet et l'id de l'utilisateur
      const folderName = `${timeStamp}_${updateName}_${userId}`;
      // On crée le projet dans la base de données
      const projectFromDB = await projectService.create(data, userId);
      // Création du dossier du projet sur le server
      await fileManager.createProjectFolder(folderName);
      // On supprime les espaces et les caractères spéciaux du nom du projet
      const fileName = `${timeStamp}_index_${userId}`;
      // On crée le nom du fichier avec le timestamp, le nom du projet et l'id de l'utilisateur
      await fileService.create(
        userId,
        projectFromDB.id,
        fileName,
        "index",
        "js",
        "",
        "console.log('Enter Text')",
        projectFromDB
      );
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
      return await projectService.getAllPublicProj(ctx.id);
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
      return await projectService.getAllPublicProj(ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find shared with me Projects");
    }
  }

  @Query(() => [Project])
  async getAllProjects(@Ctx() ctx: Context<TokenPayload>): Promise<Project[]> {
    try {
      return await projectService.getAll(ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Projects");
    }
  }

  @Query(() => Project)
  async getProjectById(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project | null> {
    try {
      return await projectService.getByProjId(ctx.id, projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Project");
    }
  }

  @Query(() => [Project])
  async getProjectByUserId(@Arg("userId") userId: number): Promise<Project[]> {
    try {
      return await projectService.getProjByUserId(userId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Project");
    }
  }

  @Mutation(() => Project)
  async addLike(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project | null> {
    try {
      const project = await projectService.getByProjId(ctx.id, projectId);
      if (!project!.isPublic)
        throw new Error("user not allowed: project not public");
      const alreadyLiked = await likeService.getByProjId(ctx.id, projectId);
      if (alreadyLiked) throw new Error("Project already liked");
      await likeService.create(projectId, ctx.id);
      return project;
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async removeLike(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project | null> {
    try {
      const project = await projectService.getByProjId(ctx.id, projectId);
      if (!project) throw new Error("Project don't exist");

      if (!project.isPublic)
        throw new Error("user not allowed: project not public");

      const like = await likeService.getByProjId(ctx.id, projectId);
      if (!like) throw new Error("like doesn't exist");

      await likeService.delete(ctx.id, like.id);
      return project;
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async addView(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project> {
    try {
      const project = await projectService.getByProjId(ctx.id, projectId);
      if (!project) throw new Error("Project don't exist");

      if (!project.isPublic)
        throw new Error("user not allowed: project not public");

      const data: IProject = {
        description: project.description,
        id_storage_number: project.id_storage_number,
        isPublic: project.isPublic,
        name: project.name,
        nb_views: project.nb_views + 1,
      };

      return await projectService.update(data, ctx.id, projectId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  @Mutation(() => Project)
  async updateProject(
    @Arg("data") data: IProject,
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project | null> {
    try {
      const project = await projectService.getByProjId(ctx.id, projectId);
      if (!project) throw new Error("Project don't exist");
      return await projectService.update(data, ctx.id, projectId);
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
      const project = await projectService.getByProjId(ctx.id, projectId);

      if (!project) throw new Error("userId not allowed");

      // Suppression du dossier du projet sur le server
      await fileManager.deleteProjectFolder(project.id_storage_number);
      await projectService.delete(ctx.id, projectId);
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
      const project = await projectService.getByProjId(ctx.id, projectId);

      if (!project) throw new Error("userId not allowed");

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
