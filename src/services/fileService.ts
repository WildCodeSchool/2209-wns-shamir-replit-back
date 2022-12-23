import { DeleteResult, Repository } from "typeorm";
import { dataSource } from "../tools/createDataSource";
import { FileCode } from "../models/file.model";
import { iFileCode } from "../interfaces/InputType";
import fs from "fs";
import { Project } from "../models";
import projectService from "./projectService";

const fileRepo: Repository<FileCode> = dataSource.getRepository(FileCode);

const fileService = {
  // CRUD Classique
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
    id_storage_file: string,
    name: string,
    language: string,
    clientPath: string,
    contentData: string
  ): Promise<FileCode> => {
    const fileRequest = { id_storage_file, name, userId, projectId, language };
    const project: Project = await projectService.getById(projectId);
    let pathToCreate: string;
    if (clientPath) {
      pathToCreate = `./projects/${project.id_storage_number}/${clientPath}/${id_storage_file}`;
    } else {
      pathToCreate = `./projects/${project.id_storage_number}/${id_storage_file}`;
    }

    fs.writeFile(pathToCreate, contentData, function (err) {
      if (err) throw err;
      console.log("File is created successfully.");
    });
    return await fileRepo.save(fileRequest);
  },

  update: async (fileRequest: iFileCode, fileId: number): Promise<FileCode> => {
    await fileRepo.update(fileId, fileRequest);
    return await fileService.getById(fileId);
  },

  delete: async (
    fileId: number,
    clientPath: string,
    projectId: number
  ): Promise<FileCode> => {
    const project: Project = await projectService.getById(projectId);
    const file: FileCode = await fileService.getById(fileId);
    let pathToDelete: string;
    if (clientPath) {
      pathToDelete = `./projects/${project.id_storage_number}/${clientPath}/${file.id_storage_file}`;
    } else {
      pathToDelete = `./projects/${project.id_storage_number}/${file.id_storage_file}`;
    }
    console.log("Boloss", {fileId, clientPath, projectId, pathToDelete})
    fs.unlink(pathToDelete, (err) => {
      if (err) console.log(err);
    });
    await fileRepo.delete(fileId);
    return file;
  },
};

export default fileService;
