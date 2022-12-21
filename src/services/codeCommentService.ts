import { Repository } from "typeorm";
import { CodeComment } from "../models/code_comment.model";
import { dataSource } from "../tools/utils";

const repository: Repository<CodeComment> =
  dataSource.getRepository(CodeComment);

const codeCommentService = {
  getById: async (codeCommentId: number) => {
    return await repository.findOneByOrFail({ id: codeCommentId });
  },

  getAll: async (): Promise<CodeComment[]> => {
    return await repository.find();
  },
  create: async (
    lineNumber: number,
    charNumber: number,
    charNength: number,
    resolved: boolean,
    comment: string,
    commentDate: boolean,
  ): Promise<CodeComment> => {
    const newCodeComment = {
      lineNumber,
      charNumber,
      charNength,
      resolved,
      comment,
      commentDate
    };
    return await repository.save(newCodeComment);
  },
  update: async (
    codeComment: CodeComment,
    codeCommentId: number
  ): Promise<CodeComment> => {
    await repository.update(codeCommentId, codeComment);
    return await codeCommentService.getById(codeCommentId);
  },

  delete: async (codeCommentId: number): Promise<CodeComment> => {
    const codeComment = await codeCommentService.getById(codeCommentId);
    await repository.delete(codeCommentId);
    return codeComment;
  },
};

export default codeCommentService;
