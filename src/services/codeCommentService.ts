import { Ctx, ID } from "type-graphql";
import { Repository } from "typeorm";
import { ICodeComment } from "../interfaces/InputType";
import { FileCode, User } from "../models";
import { CodeComment } from "../models/code_comment.model";
import { dataSource } from "../tools/createDataSource";
import fileService from "./fileService";
import userService from "./userService";

const codeCommentRepo: Repository<CodeComment> =
  dataSource.getRepository(CodeComment);

const userRepo: Repository<User> = dataSource.getRepository(User);
const fileCodeRepo: Repository<FileCode> = dataSource.getRepository(FileCode);

const codeCommentService = {
  getOneByID: async (
    id: number,
    userId: number
  ): Promise<CodeComment | null> => {
    return await codeCommentRepo.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });
  },

  getById: async (
    codeCommentId: number,
    uid: number
  ): Promise<CodeComment | null> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      if (user === null) throw new Error("inputs null");
      return await codeCommentRepo.findOne({
        relations: { fileCode: true, user: true },
        where: {
          id: codeCommentId,
          user: { id: user.id },
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },

  getAllAllowed: async (uid: number): Promise<CodeComment[]> => {
    return await codeCommentRepo.find({
      select: { id: true },
      relations: { user: true, fileCode: true },
      where: {
        fileCode: {
          project: { id: uid, isPublic: true, projectShare: { id: uid } },
        },
      },
    });
  },

  getAll: async (uid: number, idP: number): Promise<CodeComment[]> => {
    return await codeCommentRepo.find({
      relations: { user: true, fileCode: true },
      where: {
        fileCode: { id: idP },
        user: { id: uid },
      },
    });
  },
  create: async (data: ICodeComment, uid: number): Promise<CodeComment> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });

      if (user === null) throw new Error("inputs null");

      return await codeCommentRepo.save({
        data,
        user,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },

  update: async (
    data: ICodeComment,
    userId: number,
    codeCommentId: number
  ): Promise<CodeComment | null> => {
    console.log(codeCommentId, userId);

    // const codeComId = await codeCommentRepo.find({
    //   where: { id: codeCommentId },
    // });

    const codeComment = await codeCommentService.getById(codeCommentId, userId);
    console.log(codeComment);

    // if (codeComment !== null) {
    //   throw new Error("comment already exists");
    // }
    console.log("ici");

    await codeCommentRepo.update(codeCommentId, {
      char_length: data.char_length,
      comment: data.comment,
      char_number: data.char_number,
      comment_date: new Date(),
      is_report: data.is_report,
      resolved: data.resolved,
    });

    return await codeCommentRepo.findOneBy({
      id: codeCommentId,
    });
  },

  // delete: async (codeCommentId: number): Promise<CodeComment> => {
  //   const codeComment = await codeCommentService.getById(codeCommentId);
  //   await repository.delete(codeCommentId);
  //   return codeComment;
  // },
};

export default codeCommentService;
