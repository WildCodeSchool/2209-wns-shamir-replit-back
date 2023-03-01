import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IProj, iProject } from "../interfaces/InputType";
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

@Resolver(iProject)
export class ProjectResolver {
  @Mutation(() => Project)
  async createProject(
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("isPublic") isPublic: boolean,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project> {
    try {
      const userId = ctx.id;
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
  ): Promise<Project[] | void> {
    return await projectService
      .getSharedWithMeProj(ctx.id)
      .catch(console.error)
      .then(() => console.log("Cant find shared with me projects"));
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
    @Arg("projectId") projectId: number
  ): Promise<Project[]> {
    try {
      return await projectService.getByProjId(projectId);
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

  // @Mutation(() => Project)
  // async addLike(
  //   @Arg("projectId") projectId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<Project> {
  //   try {
  //     const [_project] = await projectService.getById(ctx.id, projectId);

  //     if (_project.user.id !== ctx.id || !_project.isPublic)
  //       throw new Error("userId not allowed");

  //     const alreadyLiked =
  //       _project.like.filter((lik) => lik.user === ctx.id).length > 0;

  //     if (!alreadyLiked) await likeService.create(projectId, ctx.id);

  //     return (await projectService.getById(ctx.id, projectId))[0];
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Can't update Project");
  //   }
  // }

  @Mutation(() => Project)
  async removeLike(
    @Arg("projectId") projectId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Project> {
    try {
      const [_project] = await projectService.getByProjId(projectId);

      if (_project.user.id !== ctx.id || !_project.isPublic)
        throw new Error("userId not allowed");

      const likes = await likeService.getAll();

      const filteredLike = likes.filter(
        (like) => like.user === ctx.id && like.project === projectId
      );

      const alreadyLiked = filteredLike.length > 0;

      if (alreadyLiked) {
        likeService.delete(filteredLike[0].id);
        return {
          ..._project,
          like: [
            ..._project.like.filter((like) => like.id === filteredLike[0].id),
          ],
        };
      }
      return _project;
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Project");
    }
  }

  // @Mutation(() => [Project])
  // async addView(
  //   @Arg("projectId") projectId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<Project[]> {
  //   try {
  //     const [_project] = await projectService.getById(ctx.id, projectId);

  //     if (_project.user.id !== ctx.id && !_project.isPublic)
  //       throw new Error("userId not allowed");
  //     return await projectService.update(
  //       { nb_views: _project.nb_views + 1 },
  //       projectId
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Can't update Project");
  //   }
  // }

  // @Mutation(() => [Project])
  // async updateProject(
  //   @Arg("project") project: iProject,
  //   @Arg("projectId") projectId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<Project[]> {
  //   try {
  //     const [_project] = await projectService.getById(ctx.id, projectId);

  //     if (_project.user.id !== ctx.id) throw new Error("userId not allowed");
  //     return await projectService.update(project, projectId);
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Can't update Project");
  //   }
  // }

  // @Mutation(() => Project)
  // async deleteProject(
  //   @Arg("projectId") projectId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<Project> {
  //   try {
  //     const [project] = await projectService.getById(ctx.id, projectId);

  //     if (project.user.id !== ctx.id) throw new Error("userId not allowed");

  //     // Suppression du dossier du projet sur le server
  //     await fileManager.deleteProjectFolder(project.id_storage_number);
  //     await projectService.delete(projectId);
  //     return project;
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error("Can't delete Project");
  //   }
  // }

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
      const project: any = await projectService.getByProjId(projectId);

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
