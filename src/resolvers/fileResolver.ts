import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { DeleteResult } from "typeorm";
import { iFileCode } from "../interfaces/InputType";
import { FileCode } from "../models/file.model";
import fileService from "../services/fileService";
import string from "string-sanitizer";
import { Project } from "../models";
import projectService from "../services/projectService";
import { Context } from "apollo-server-core";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(iFileCode)
export class FileResolver {
  @Query(() => [FileCode])
  async getAllFiles(@Ctx() ctx: Context<TokenPayload>): Promise<FileCode[]> {
    try {
      const files = await fileService.getAll();
      return files.filter((file) => file.userId === ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas trouver les fichiers : Resolver");
    }
  }

  @Query(() => FileCode)
  async getFileById(
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode> {
    try {
      const file = await fileService.getById(fileId);
      if (file.userId !== ctx.id) throw new Error("non authorisé");
      return file;
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
      const project: Project = (await projectService.getById(projectId))[0];
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
    @Arg("file") file: iFileCode,
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<FileCode> {
    try {
      const _file = await fileService.getById(fileId);
      if (_file.userId !== ctx.id) throw new Error("non authorisé");

      return await fileService.update(file, fileId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update FileCode");
    }
  }

  @Mutation(() => FileCode)
  async deleteFileCode(
    @Arg("fileId") fileId: number,
    @Ctx() ctx: Context<TokenPayload>
  ) {
    try {
      const _file = await fileService.getById(fileId);
      if (_file.userId !== ctx.id) throw new Error("non authorisé");

      const file: FileCode = await fileService.getById(fileId);

      const projectId = (file.projectId as unknown as Project).id;

      const project: Project = (await projectService.getById(projectId))[0];

      return await fileService.delete(fileId, project, file);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete FileCode");
    }
  }
}
