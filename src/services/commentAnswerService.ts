import { Repository } from "typeorm";
import { CommentAnswer } from "../models/comment_answer.model";
import { dataSource } from "../tools/utils";

const repository: Repository<CommentAnswer> =
  dataSource.getRepository(CommentAnswer);

const commentAnswerService = {
  getById: async (commentAnswerId: number) => {
    return await repository.findOneByOrFail({ id: commentAnswerId });
  },

  getAll: async (): Promise<CommentAnswer[]> => {
    return await repository.find();
  },
  create: async (comment: string, answerDate: Date): Promise<CommentAnswer> => {
    const newCommentAnswer = {
      comment,
      answerDate,
    };
    return await repository.save(newCommentAnswer);
  },
  update: async (
    commentAnswer: CommentAnswer,
    commentAnswerId: number
  ): Promise<CommentAnswer> => {
    await repository.update(commentAnswerId, commentAnswer);
    return await commentAnswerService.getById(commentAnswerId);
  },

  delete: async (commentAnswerId: number): Promise<CommentAnswer> => {
    const commentAnswer = await commentAnswerService.getById(commentAnswerId);
    await repository.delete(commentAnswerId);
    return commentAnswer;
  },
};

export default commentAnswerService;
