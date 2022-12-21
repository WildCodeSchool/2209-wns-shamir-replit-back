import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";
import FileCode from "../models/file.model";
import fileService from "../services/fileService";

@Resolver(FileCode)
export class FileResolver {
  @Query(() => [FileCode])
  async getAllFiles(): Promise<FileCode[]> {
    return await fileService.getAll();
  }

  @Mutation(() => FileCode)
  async createFile(
    id_storage_file: number,
    name: string,
    userId: number,
    projectId: number,
    language: string
  ): Promise<FileCode> {
    return await fileService.create(
      id_storage_file,
      name,
      userId,
      projectId,
      language
    );
  }

  @Mutation(() => FileCode)
  async updateFileCode(
    @Arg("FileCode") FileCode: FileCode,
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
  ): Promise<FileCode> {
    try {
      return await fileService.delete(FileCodeId);
    } catch (e) {
      throw new Error("Can't delete FileCode");
    }
  }
}
