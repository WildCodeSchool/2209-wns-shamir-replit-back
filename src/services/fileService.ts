import { DeleteResult, Repository } from "typeorm";
import { dataSource } from "../tools/utils";
import { FileCode } from "../models/file.model";
import { iFileCode } from "../interfaces/InputType";

const fileRepo: Repository<FileCode> = dataSource.getRepository(FileCode);

const fileService = {
  getAll: async (): Promise<FileCode[]> => {
    return await fileRepo.find({
      relations: {
        userId: true,
        projectId: true,
      },
    });
  },
  getByName: async (name: string): Promise<FileCode | null> => {
    return await fileRepo.findOneBy({
      name,
    });
  },

  getById: async (fileId: number) => {
    return (await fileRepo.findBy({ id: fileId }))[0];
  },

  create: async (
    userId: number,
    projectId: number,
    id_storage_file: number,
    name: string,
    language: string
  ): Promise<FileCode> => {
    const fileRequest = { id_storage_file, name, userId, projectId, language };
    return await fileRepo.save(fileRequest);
  },

  update: async (fileRequest: iFileCode, fileId: number): Promise<FileCode> => {
    await fileRepo.update(fileId, fileRequest);
    return await fileService.getById(fileId);
  },

  delete: async (fileId: number): Promise<DeleteResult> => {
    return await fileRepo.delete(fileId);
  },
};

export default fileService;
