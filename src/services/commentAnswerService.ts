import { Repository } from "typeorm";
import { ICommentAnswer } from "../interfaces/InputType";
import { CommentAnswer } from "../models/comment_answer.model";
import { dataSource } from "../tools/createDataSource";

const repository: Repository<CommentAnswer> =
  dataSource.getRepository(CommentAnswer);

const commentAnswerService = {
  getById: async (commentAnswerId: number) =>
    (await repository.findBy({ id: commentAnswerId }))[0],

  getAll: async (): Promise<CommentAnswer[]> =>
    await repository.find({
      relations: { user: true, codeComment: true, comment: true },
    }),
  create: async (
    codeCommentId: number,
    userId: number,
    comment: string,
    answerDate: Date
  ): Promise<CommentAnswer> => {
    const newCommentAnswer = {
      codeCommentId,
      userId,
      comment,
      answerDate,
    };
    return await repository.save(newCommentAnswer);
  },
  update: async (
    commentAnswer: ICommentAnswer,
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
