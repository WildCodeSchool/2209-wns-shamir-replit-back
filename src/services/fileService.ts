import { Repository } from "typeorm";
import { dataSource } from "../tools/createDataSource";
import { FileCode } from "../models/file.model";
import { iFileCode } from "../interfaces/InputType";
import { Project } from "../models";
import { fileManager } from "../tools/fileManager";

const fileRepo: Repository<FileCode> = dataSource.getRepository(FileCode);

const fileService = {
  // CRUD Classique
  getAll: async (): Promise<FileCode[]> => {
    try {
      return await fileRepo.find({
        relations: {
          userId: true,
          projectId: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à obtenir la liste des fichiers");
    }
  },
  getByName: async (name: string): Promise<FileCode | null> => {
    try {
      return await fileRepo.findOneBy({
        name,
      });
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à obtenir un fichier par le nom");
    }
  },

  getById: async (fileId: number) => {
    try {
      return (await fileRepo.findBy({ id: fileId }))[0];
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à obtenir un fichier par l'id");
    }
  },

  getAllFilesByProId: async (projectId: number): Promise<FileCode[]> => {
    try {
      const result = await fileRepo.findBy({ projectId: projectId })
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à obtenir un fichier par l'id");
    }
  },

  create: async (
    userId: number,
    projectId: number,
    fileName: string,
    name: string,
    language: string,
    clientPath: string,
    contentData: string,
    project: Project
  ) => {
    try {
      const id_storage_file = clientPath + fileName;

      const fileRequest = {
        id_storage_file,
        name,
        userId,
        projectId,
        language,
      };

      if (clientPath) fileManager.createFolderTree(project, clientPath);

      await fileManager.createOneFile(project, id_storage_file, contentData);

      return await fileRepo.save(fileRequest);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le fichier");
    }
  },

  update: async (fileRequest: iFileCode, fileId: number): Promise<FileCode> => {
    try {
      await fileRepo.update(fileId, fileRequest);
      return await fileService.getById(fileId);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de modifier le fichier");
    }
  },

  delete: async (fileId: number, project: Project, file: FileCode) => {
    try {
      await fileManager.deleteOneFile(project, file);
      await fileRepo.delete(fileId);
      return file;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible d'effacer le fichier");
    }
  },
};

export default fileService;
