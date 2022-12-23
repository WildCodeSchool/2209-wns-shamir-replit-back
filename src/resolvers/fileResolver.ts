import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { DeleteResult } from "typeorm";
import { iFileCode } from "../interfaces/InputType";
import { FileCode } from "../models/file.model";
import fileService from "../services/fileService";
import string from "string-sanitizer";

@Resolver(iFileCode)
export class FileResolver {
  @Query(() => [FileCode])
  async getAllFiles(): Promise<FileCode[]> {
    return await fileService.getAll();
  }

  @Query(() => FileCode)
  async getFileById(@Arg("id") id: number): Promise<FileCode> {
    return await fileService.getById(id);
  }

  @Mutation(() => FileCode)
  async createFile(
    @Arg("userId") userId: number,
    @Arg("projectId") projectId: number,
    @Arg("name") name: string,
    @Arg("language") language: string,
    @Arg("clientPath") clientPath: string,
    @Arg("contentData") contentData: string
  ): Promise<FileCode> {
    // On Stock un timestamp pour avoir un nom unique
    const timeStamp = Date.now();
    // On supprime les espaces et les caractères spéciaux du nom du projet
    const updateName = string.sanitize.keepNumber(name);
    // On crée le nom du dossier avec le timestamp, le nom du projet et l'id de l'utilisateur
    const fileName = `${timeStamp}_${updateName}_${userId}`;

    // Création du fichier sur le serveur et dans la bdd
    return await fileService.create(
      userId,
      projectId,
      fileName,
      name,
      language,
      clientPath,
      contentData
    );
  }

  @Mutation(() => FileCode)
  async updateFileCode(
    @Arg("FileCode") FileCode: iFileCode,
    @Arg("FileCodeId") FileCodeId: number
  ): Promise<FileCode> {
    try {
      return await fileService.update(FileCode, FileCodeId);
    } catch (e) {
      throw new Error("Can't update FileCode");
    }
  }

  @Mutation(() => FileCode)
  async deleteFileCode(
    @Arg("FileCodeId") FileCodeId: number,
    @Arg("clientPath") clientPath: string,
    @Arg("projectId") projectId: number
  ): Promise<FileCode> {
    try {
      return await fileService.delete(FileCodeId, clientPath, projectId);
    } catch (e) {
      throw new Error("Can't delete FileCode");
    }
  }
}
