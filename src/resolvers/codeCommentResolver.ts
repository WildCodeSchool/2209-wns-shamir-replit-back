import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { iCodeComment } from "../interfaces/InputType";
import { CodeComment } from "../models/code_comment.model";
import codeCommentService from "../services/codeCommentService";
import projectService from "../services/projectService";
import { TokenPayload } from "../tools/createApolloServer";
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

export const isAllowedcomment = (
  codeComment: CodeComment,
  allowedProjectFileIds: number[]
) => {
  const fileId = codeComment.fileId;

  return allowedProjectFileIds.includes(fileId);
};

@Resolver(iCodeComment)
export class CodeCommentResolver {
  @Mutation(() => CodeComment)
  async createCodeComment(
    @Arg("fileId") fileId: number,
    @Arg("line_number") lineNumber: number,
    @Arg("char_number") charNumber: number,
    @Arg("char_length") charNength: number,
    @Arg("resolved") resolved: boolean,
    @Arg("comment") comment: string,
    @Arg("comment_date") commentDate: Date,
    @Arg("is_report") isReport: boolean,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment> {
    try {
      const userId = ctx.id;

      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (!allowedProjectFileIds.includes(fileId) || userId !== ctx.id)
        throw new Error("not authorized");

      const codeCommentFromDB = await codeCommentService.create(
        fileId,
        userId,
        lineNumber,
        charNumber,
        charNength,
        resolved,
        sanitizer.sanitize(comment),
        commentDate,
        isReport
      );
      return codeCommentFromDB;
    } catch (e) {
      throw new Error("Can't createCodeComment");
    }
  }

  @Query(() => [CodeComment])
  async getAllCodeComments(
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment[]> {
    try {
      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);

      const codeComments = await codeCommentService.getAll();

      return codeComments.filter((codeComment) =>
        isAllowedcomment(codeComment, allowedProjectFileIds)
      );
    } catch (e) {
      throw new Error("Can't getAllCodeComments");
    }
  }

  @Query(() => CodeComment)
  async getCodeCommentById(
    @Arg("codeCommentId") codeCommentId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment> {
    try {
      const codeComment = await codeCommentService.getById(codeCommentId);
      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (!isAllowedcomment(codeComment, allowedProjectFileIds))
        throw new Error("not authorized");

      return codeComment;
    } catch (e) {
      throw new Error("Can't getCodeCommentById");
    }
  }

  @Mutation(() => CodeComment)
  async updateCodeComment(
    @Arg("CodeComment") codeComment: iCodeComment,
    @Arg("CodeCommentId") codeCommentId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment> {
    try {
      const _codeComment = await codeCommentService.getById(codeCommentId);
      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (!isAllowedcomment(_codeComment, allowedProjectFileIds))
        throw new Error("not authorized");

      if (codeComment.comment)
        codeComment.comment = sanitizer.sanitize(codeComment.comment);

      return await codeCommentService.update(codeComment, codeCommentId);
    } catch (e) {
      throw new Error("Can't update CodeComment");
    }
  }

  @Mutation(() => CodeComment)
  async deleteCodeComment(
    @Arg("CodeCommentId") codeCommentId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment> {
    try {
      const codeComment = await codeCommentService.getById(codeCommentId);
      const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      if (!isAllowedcomment(codeComment, allowedProjectFileIds))
        throw new Error("not authorized");

      return await codeCommentService.delete(codeCommentId);
    } catch (e) {
      throw new Error("Can't delete CodeComment");
    }
  }
}
