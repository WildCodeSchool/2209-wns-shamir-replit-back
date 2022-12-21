import { Repository } from "typeorm";
import { dataSource } from "../tools/utils";
import FileCode from '../models/file.model'

const fileRepo: Repository<FileCode> = dataSource.getRepository(FileCode);

const fileService = {
    getAll: async(): Promise<FileCode[]> => {
        return await fileRepo.find({
            relations:{
                codeComment: true,
                user: true,
                project: true,
                
            }
        })
    },
    getByName: async (name: string): Promise<FileCode | null> => {
        return await fileRepo.findOneBy({
            name,
        });
    },

    getById: async (fileId: number) => {
        return await fileRepo.findOneByOrFail({ id: fileId });
      },

    create: async(id_storage_file: number, name: string, userId: number, projectId: number, language: string): Promise<FileCode> => {
       const fileRequest = {id_storage_file, name, userId, projectId, language};
        return await fileRepo.save(fileRequest);
    },

    update: async (
        fileRequest: FileCode,
        fileId: number
    ): Promise<FileCode> => {
        await fileRepo.update(fileId, fileRequest);
        return await fileService.getById(fileId)
    },

    delete: async (fileId: number): Promise<any> =>{
        return await fileRepo.delete(fileId);
    }
}

export default fileService;

