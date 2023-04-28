import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { iCommentAnswer } from "../interfaces/InputType";
import { CodeComment } from "../models";
import { CommentAnswer } from "../models/comment_answer.model";
import codeCommentService from "../services/codeCommentService";
import commentAnswerService from "../services/commentAnswerService";
import projectService from "../services/projectService";
import { TokenPayload } from "../tools/createApolloServer";
import { isAllowedcomment } from "./codeCommentResolver";
import sanitizer from "sanitizer";

const getAllowedProjectFileIds = async (ctx: TokenPayload) =>
  (await projectService.getAll())
    .filter(
      (project) =>
        project.userId === ctx.id ||
        project.isPublic ||
        project.projectShare.map((pshare) => pshare.userId === ctx.id)
    )
    .map((project) => project.file.map((file) => file.id))
    .flat();

export const isAllowedcommentAnswer = (
  commentAnswer: CommentAnswer,
  codeComments: CodeComment[],
  allowedProjectFileIds: number[]
) => {
  const fileIds = codeComments
    .filter((comment) => comment.id === commentAnswer.codeCommentId)
    .map((comment) => comment.fileId);

  return (
    fileIds.filter((fileId) => allowedProjectFileIds.includes(fileId)).length >
    0
  );
};

@Resolver(iCommentAnswer)
export class CommentAnswerResolver {
  @Mutation(() => CommentAnswer)
  async createCommentAnswer(
    @Arg("codeCommentId") codeCommentId: number,
    @Arg("comment") comment: string,
    @Arg("answer_date") answerDate: Date,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CommentAnswer> {
    try {
      const userId = ctx.id;

      const codeComment = await codeCommentService.getById(codeCommentId);

      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (!isAllowedcomment(codeComment, allowedProjectFileIds))
        throw new Error("non authorisé");

      const commentAnswerFromDB = await commentAnswerService.create(
        codeCommentId,
        userId,
        sanitizer.sanitize(comment),
        answerDate
      );
      return commentAnswerFromDB;
    } catch (e) {
      throw new Error("Can't createCommentAnswer");
    }
  }

  @Query(() => [CommentAnswer])
  async getAllCommentAnswers(
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CommentAnswer[]> {
    try {
      const commentAnswers = await commentAnswerService.getAll();
      const codeComments = await codeCommentService.getAll();

      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);

      return commentAnswers.filter((commentAnswer) =>
        isAllowedcommentAnswer(
          commentAnswer,
          codeComments,
          allowedProjectFileIds
        )
      );
    } catch (e) {
      throw new Error("Can't getAllCommentAnswers");
    }
  }

  @Query(() => CommentAnswer)
  async getCommentAnswerById(
    @Arg("commentAnswerId") commentAnswerId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CommentAnswer> {
    try {
      const commentAnswer = await commentAnswerService.getById(commentAnswerId);
      const codeComments = await codeCommentService.getAll();

      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (
        isAllowedcommentAnswer(
          commentAnswer,
          codeComments,
          allowedProjectFileIds
        )
      )
        return commentAnswer;
      else throw new Error("not allowed");
    } catch (e) {
      throw new Error("Can't getCommentAnswerById");
    }
  }

  @Mutation(() => CommentAnswer)
  async updateCommentAnswer(
    @Arg("CommentAnswer") commentAnswer: iCommentAnswer,
    @Arg("CommentAnswerId") commentAnswerId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CommentAnswer> {
    try {
      const commentAnswer = await commentAnswerService.getById(commentAnswerId);
      const codeComments = await codeCommentService.getAll();

      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (
        isAllowedcommentAnswer(
          commentAnswer,
          codeComments,
          allowedProjectFileIds
        )
      ) {
        if (commentAnswer.comment)
          commentAnswer.comment = sanitizer.sanitize(commentAnswer.comment);

        return await commentAnswerService.update(
          commentAnswer,
          commentAnswerId
        );
      } else throw new Error("not allowed");
    } catch (e) {
      throw new Error("Can't update CommentAnswer");
    }
  }

  @Mutation(() => CommentAnswer)
  async deleteCommentAnswer(
    @Arg("CommentAnswerId") commentAnswerId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CommentAnswer> {
    try {
      const commentAnswer = await commentAnswerService.getById(commentAnswerId);
      const codeComments = await codeCommentService.getAll();

      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (
        isAllowedcommentAnswer(
          commentAnswer,
          codeComments,
          allowedProjectFileIds
        )
      )
        return await commentAnswerService.delete(commentAnswerId);
      else throw new Error("not allowed");
    } catch (e) {
      throw new Error("Can't delete CommentAnswer");
    }
  }
}
