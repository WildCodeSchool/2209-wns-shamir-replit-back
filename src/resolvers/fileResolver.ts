import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { DeleteResult } from "typeorm";
import { iFileCode } from "../interfaces/InputType";
import { FileCode } from "../models/file.model";
import fileService from "../services/fileService";

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
    @Arg("id_storage_file") id_storage_file: number,
    @Arg("name") name: string,
    @Arg("language") language: string
  ): Promise<FileCode> {
    return await fileService.create(
      userId,
      projectId,
      id_storage_file,
      name,
      language
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
    @Arg("FileCodeId") FileCodeId: number
  ): Promise<DeleteResult> {
    try {
      return await fileService.delete(FileCodeId);
    } catch (e) {
      throw new Error("Can't delete FileCode");
    }
  }
}
