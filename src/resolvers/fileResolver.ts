import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { IFileCode, IFilesWithCode } from "../interfaces/InputType";
import { FileCode } from "../models/file.model";
import fileService from "../services/fileService";
import string from "string-sanitizer";
import { Project } from "../models";
import projectService from "../services/projectService";
import { Context } from "apollo-server-core";
import { TokenPayload } from "../tools/createApolloServer";
import { fileManager } from "../tools/fileManager";
import projectShareService from "../services/projectShareService";
import { ProjToCodeFIle } from "../interfaces/IFiles";

@Resolver(FileCode)
export class FileResolver {
  @Query(() => [FileCode])
  async getAllFiles(): Promise<FileCode[]> {
    try {
      return await fileService.getAll();
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver les fichiers : Resolver");
    }
  }

  @Query(() => FileCode)
  async getFileById(
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode | null> {
    try {
      return fileService.getById(ctx.id, fileId);
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver un fichier par l'id : Resolver");
    }
  }

  @Mutation(() => FileCode)
  async createFile(
    @Arg("projectId") projectId: number,
    @Arg("name") name: string,
    @Arg("language") language: string,
    @Arg("clientPath") clientPath: string,
    @Arg("contentData") contentData: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode> {
    try {
      const userId = ctx.id;

      // On Stock un timestamp pour avoir un nom unique
      const timeStamp = Date.now();
      // On supprime les espaces et les caractères spéciaux du nom du projet
      const updateName = string.sanitize.keepNumber(name);

      const updateClientPath = clientPath
        .split("/")
        .map((str) => string.sanitize.keepNumber(str))
        .join("/")
        .replace(/\/+/g, "/");

      // On crée le nom du dossier avec le timestamp, le nom du projet et l'id de l'utilisateur
      const fileName = `${timeStamp}_${updateName}_${userId}`;
      const project: Project | null = await projectService.getByProjId(
        ctx.id,
        projectId
      );
      if (!project) throw new Error("no proj");

      // Création du fichier sur le serveur et dans la bdd
      return await fileService.create(
        userId,
        projectId,
        fileName,
        name,
        language,
        updateClientPath,
        contentData,
        project
      );
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à Créer un fichier : Resolver");
    }
  }

  @Mutation(() => FileCode)
  async updateFileCode(
    @Arg("file") file: IFileCode,
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode | null> {
    try {
      return await fileService.update(file, ctx.id, fileId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update FileCode");
    }
  }

  @Mutation(() => FileCode)
  async deleteFileCode(
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode | null> {
    try {
      return await fileService.delete(ctx.id, fileId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete FileCode");
    }
  }

  @Query(() => [FileCode])
  async getFilesByProjectId(
    @Arg("projectId") projectId: number
  ): Promise<FileCode[]> {
    try {
      return await fileService.getAllFilesByProjId(projectId);
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver un fichier par l'id : Resolver");
    }
  }

  @Query(() => [IFilesWithCode])
  async getCodeFiles(
    @Arg("projectId") projectId: string,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<IFilesWithCode[]> {
    try {
      const projId = parseInt(projectId, 10);
      const project = await projectService.getByProjId(ctx.id, projId);

      if (!project) throw new Error("non authorisé");
      const files = await fileService.getAllFilesByProjId(projId);

      const minProject: ProjToCodeFIle = {
        projectId: project.id,
        path: project.id_storage_number,
      };

      const result: IFilesWithCode[] = await fileManager.getArrayCodeFile(
        minProject,
        files
      );

      return result;
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver un fichier par l'id : Resolver");
    }
  }

  @Mutation(() => String)
  async updateCodeFile(
    @Arg("projectId") projectId: number,
    @Arg("fileId") fileId: number,
    @Arg("contentData") contentData: string,
    @Ctx() ctx: Context<TokenPayload>
  ) {
    try {
      // de l'id du fichier pour verifier si le fichier existe
      // Verifier si le fichier appartient bien à l'utilisateur

      const canEdit = await projectShareService.getUserCanEdit(
        ctx.id,
        projectId
      );

      const file = await fileService.getById(ctx.id, fileId);
      if (!file || canEdit.length === 0) throw new Error("non authorisé");

      // Verifier si le fichier existe bien dans la bdd
      // Verifier si le fichier existe bien sur le serveur
      if (!file.id_storage_file)
        throw new Error("Pas de fichier sur le serveur");

      const project = await projectService.getByProjId(ctx.id, projectId);
      if (!project) throw new Error("proj dont exist");

      await fileManager.updateContentData(
        project.id_storage_number,
        file.id_storage_file,
        contentData
      );
      const result = {
        success: true,
      };
      return JSON.stringify(result);
    } catch (err) {
      throw new Error("Une erreur est survenue lors de l'update du code");
    }
  }
}
