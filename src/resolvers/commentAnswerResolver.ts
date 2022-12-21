import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CodeComment } from "../models";
import { CommentAnswer } from "../models/comment_answer.model";
import commentAnswerService from "../services/commentAnswerService";

@Resolver(CommentAnswer)
export class CommentAnswerResolver {
  @Mutation(() => CommentAnswer)
  async createCommentAnswer(
    @Arg("comment") comment: string,
    @Arg("answer_date") answerDate: Date
  ): Promise<CommentAnswer> {
    const commentAnswerFromDB = await commentAnswerService.create(
      comment,
      answerDate
    );
    console.log(commentAnswerFromDB);
    return commentAnswerFromDB;
  }

  @Query(() => [CommentAnswer])
  async getAllCommentAnswers(): Promise<CommentAnswer[]> {
    return await commentAnswerService.getAll();
  }
  @Query(() => CommentAnswer)
  async getCommentAnswerById(
    @Arg("commentAnswerId") commentAnswerId: number
  ): Promise<CommentAnswer> {
    return await commentAnswerService.getById(commentAnswerId);
  }

  @Mutation(() => CommentAnswer)
  async updateCommentAnswer(
    @Arg("CommentAnswer") CommentAnswer: CommentAnswer,
    @Arg("CommentAnswerId") CommentAnswerId: number
  ): Promise<CommentAnswer> {
    try {
      return await commentAnswerService.update(CommentAnswer, CommentAnswerId);
    } catch (e) {
      throw new Error("Can't update CommentAnswer");
    }
  }

  @Mutation(() => CommentAnswer)
  async deleteCommentAnswer(
    @Arg("CommentAnswerId") CommentAnswerId: number
  ): Promise<CommentAnswer> {
    try {
      return await commentAnswerService.delete(CommentAnswerId);
    } catch (e) {
      throw new Error("Can't delete CommentAnswer");
    }
  }
}
