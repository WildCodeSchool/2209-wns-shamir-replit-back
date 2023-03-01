import { Repository } from "typeorm";
import { ICodeComment } from "../interfaces/InputType";
import { FileCode, User } from "../models";
import { CodeComment } from "../models/code_comment.model";
import { dataSource } from "../tools/createDataSource";

const codeCommentRepo: Repository<CodeComment> =
  dataSource.getRepository(CodeComment);

const userRepo: Repository<User> = dataSource.getRepository(User);
const fileCodeRepo: Repository<FileCode> = dataSource.getRepository(FileCode);

const codeCommentService = {
  getByCodeCommentId: async (
    uid: number,
    codeCommentId: number
  ): Promise<CodeComment | null> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      if (user === null) throw new Error("inputs null");

      return await codeCommentRepo.findOne({
        relations: { fileCode: true, user: true, commentAnswer: true },
        where: {
          id: codeCommentId,
          user: user,
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("error getbyCodeCommentID");
    }
  },

  getAllAllowed: async (uid: number): Promise<CodeComment[]> => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("user not found");

    return await codeCommentRepo.find({
      relations: { user: true, fileCode: true, commentAnswer: true },
      where: {
        fileCode: {
          project: { user: user, isPublic: true },
        },
      },
    });
  },

  getByFileCodeId: async (
    uid: number,
    fileCodeId: number
  ): Promise<CodeComment[]> => {
    return await codeCommentRepo.find({
      relations: { user: true, fileCode: true, commentAnswer: true },
      where: {
        fileCode: { id: fileCodeId },
        user: { id: uid },
      },
    });
  },
  create: async (data: ICodeComment, uid: number): Promise<CodeComment> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      const fileCode = await fileCodeRepo.findOneBy({ id: data.fileCodeId });

      if (user === null) throw new Error("inputs null");
      if (fileCode === null) throw new Error("filecode null");

      return await codeCommentRepo.save({
        ...data,
        user,
        fileCode,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },

  update: async (
    data: ICodeComment,
    uid: number,
    codeCommentId: number
  ): Promise<CodeComment | null> => {
    const codeComment = await codeCommentService.getByCodeCommentId(
      uid,
      codeCommentId
    );
    if (codeComment === null) throw new Error("fu");
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

  delete: async (uid: number, codeCommentId: number): Promise<CodeComment> => {
    const codeComment = await codeCommentService.getByCodeCommentId(
      uid,
      codeCommentId
    );
    if (codeComment === null) throw new Error("fu");
    await codeCommentRepo.delete(codeCommentId);
    return codeComment;
  },
};

export default codeCommentService;
