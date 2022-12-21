import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iCodeComment } from "../interfaces/InputType";
import { CodeComment } from "../models/code_comment.model";
import codeCommentService from "../services/codeCommentService";

@Resolver(iCodeComment)
export class CodeCommentResolver {
  @Mutation(() => CodeComment)
  async createCodeComment(
    @Arg("fileId") fileId: number,
    @Arg("userId") userId: number,
    @Arg("line_number") lineNumber: number,
    @Arg("char_number") charNumber: number,
    @Arg("char_length") charNength: number,
    @Arg("resolved") resolved: boolean,
    @Arg("comment") comment: string,
    @Arg("comment_date") commentDate: boolean
  ): Promise<CodeComment> {
    const codeCommentFromDB = await codeCommentService.create(
      fileId,
      userId,
      lineNumber,
      charNumber,
      charNength,
      resolved,
      comment,
      commentDate
    );
    console.log(codeCommentFromDB);
    return codeCommentFromDB;
  }

  @Query(() => [CodeComment])
  async getAllCodeComments(): Promise<CodeComment[]> {
    return await codeCommentService.getAll();
  }
  @Query(() => CodeComment)
  async getCodeCommentById(
    @Arg("codeCommentId") codeCommentId: number
  ): Promise<CodeComment> {
    return await codeCommentService.getById(codeCommentId);
  }

  @Mutation(() => CodeComment)
  async updateCodeComment(
    @Arg("CodeComment") CodeComment: iCodeComment,
    @Arg("CodeCommentId") CodeCommentId: number
  ): Promise<CodeComment> {
    try {
      return await codeCommentService.update(CodeComment, CodeCommentId);
    } catch (e) {
      throw new Error("Can't update CodeComment");
    }
  }

  @Mutation(() => CodeComment)
  async deleteCodeComment(
    @Arg("CodeCommentId") CodeCommentId: number
  ): Promise<CodeComment> {
    try {
      return await codeCommentService.delete(CodeCommentId);
    } catch (e) {
      throw new Error("Can't delete CodeComment");
    }
  }
}
