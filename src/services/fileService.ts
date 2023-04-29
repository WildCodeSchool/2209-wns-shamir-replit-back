import { Repository } from "typeorm";
import { dataSource } from "../tools/createDataSource";
import { FileCode } from "../models/file.model";
import { IFileCode } from "../interfaces/InputType";
import { Project, User } from "../models";
import { fileManager } from "../tools/fileManager";

const fileRepo: Repository<FileCode> = dataSource.getRepository(FileCode);
const userRepo: Repository<User> = dataSource.getRepository(User);
const projectRepo: Repository<Project> = dataSource.getRepository(Project);

const fileService = {
  // CRUD Classique
  getAll: async (): Promise<FileCode[]> => {
    try {
      return await fileRepo.find({
        relations: {
          user: true,
          project: true,
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

  getById: async (uid: number, fileId: number): Promise<FileCode | null> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      if (user === null) throw new Error("inputs null");

      return await fileRepo.findOne({
        relations: { project: true, user: true },
        where: {
          id: fileId,
          user: user,
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("N'a pas réussi à obtenir un fichier par l'id");
    }
  },

  getAllFilesByProjId: async (projectId: number): Promise<FileCode[]> => {
    try {
      const proj = await projectRepo.findOneBy({ id: projectId });
      if (proj === null) throw new Error("inputs null");
      const result = await fileRepo.findBy({ project: proj });

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
  ): Promise<FileCode> => {
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
      console.log("proj :", project);

      await fileManager.createOneFile(project, id_storage_file, contentData);

      return await fileRepo.save(fileRequest);
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le fichier");
    }
  },

  update: async (
    fileRequest: IFileCode,
    uid: number,
    fileId: number
  ): Promise<FileCode | null> => {
    try {
      const fileReq = await fileService.getById(uid, fileId);
      if (fileReq === null) throw new Error("fu");

      await fileRepo.update(fileId, fileRequest);
      return await fileRepo.findOneBy({ id: fileId });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de modifier le fichier");
    }
  },

  delete: async (uid: number, fileId: number) => {
    try {
      const fileReq = await fileService.getById(uid, fileId);
      if (fileReq === null) throw new Error("fu");
      const project = await projectRepo.findOne({
        where: { fileCode: fileReq },
      });
      if (!project) throw new Error("fu");
      await fileManager.deleteOneFile(project, fileReq);
      await fileRepo.delete(fileId);
      return fileReq;
    } catch (err) {
      console.error(err);
      throw new Error("Impossible d'effacer le fichier");
    }
  },
};

export default fileService;
