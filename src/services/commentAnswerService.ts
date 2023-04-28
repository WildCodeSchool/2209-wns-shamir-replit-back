import { Repository } from "typeorm";
import { CodeComment, User } from "../models";
import { CommentAnswer } from "../models/comment_answer.model";
import { dataSource } from "../tools/createDataSource";

const commentAnswerRepo: Repository<CommentAnswer> =
  dataSource.getRepository(CommentAnswer);
const userRepo: Repository<User> = dataSource.getRepository(User);
const codeCommentRepo: Repository<CodeComment> =
  dataSource.getRepository(CodeComment);

const commentAnswerService = {
  //   getById: async (commentAnswerId: number) =>
  //     await repository.findBy({ id: commentAnswerId }),

  //   getAll: async (): Promise<CommentAnswer[]> =>
  //     await repository.find({
  //       relations: { user: true, codeComment: true, comment: true },
  //     }),

  create: async (
    codeCommentId: number,
    comment: string,
    uid: number
  ): Promise<CommentAnswer> => {
    try {
      const user = await userRepo.findOneBy({ id: uid });
      const codeComment = await codeCommentRepo.findOneBy({
        id: codeCommentId,
      });

      if (user === null) throw new Error("inputs null");
      if (codeComment === null) throw new Error("inputs null");

      return await commentAnswerRepo.save({ user, comment, codeComment });
    } catch (err) {
      console.error(err);
      throw new Error("Impossible de créer le projet");
    }
  },
  //   update: async (
  //     commentAnswer: iCommentAnswer,
  //     commentAnswerId: number
  //   ): Promise<CommentAnswer> => {
  //     await repository.update(commentAnswerId, commentAnswer);
  //     return await commentAnswerService.getById(commentAnswerId);
  //   },

  //   delete: async (commentAnswerId: number): Promise<CommentAnswer> => {
  //     const commentAnswer = await commentAnswerService.getById(commentAnswerId);
  //     await repository.delete(commentAnswerId);
  //     return commentAnswer;
  //   },
};

export default commentAnswerService;
