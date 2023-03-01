import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ICodeComment } from "../interfaces/InputType";
import { Project } from "../models";
import { CodeComment } from "../models/code_comment.model";
import codeCommentService from "../services/codeCommentService";
import projectService from "../services/projectService";
import { TokenPayload } from "../tools/createApolloServer";

// const getAllowedProjectFileIds = async (ctx: TokenPayload) =>
//   (await projectService.getAll())
//     .filter(
//       (project) =>
//         project.userId === ctx.id ||
//         project.isPublic ||
//         project.projectShare.map((pshare) => pshare.userId === ctx.id)
//     )
//     .map((project) => project.file.map((file) => file.id))
//     .flat();

// export const isAllowedcomment = (
//   codeComment: CodeComment,
//   allowedProjectFileIds: number[]
// ) => {
//   const fileId = codeComment.file.id;

//   return allowedProjectFileIds.includes(fileId);
// };

//if project user is user or isPublic o

@Resolver(CodeComment)
export class CodeCommentResolver {
  @Mutation(() => CodeComment)
  async createCodeComment(
    @Arg("data") data: ICodeComment,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment> {
    try {
      // const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      // if (
      //   !allowedProjectFileIds.includes(data.fileId) ||
      //   data.userId !== ctx.id
      // )
      //   throw new Error("not authorized");
      // data.userId = ctx.id;
      // data.fileCodeId = 1;
      const userId = ctx.id;
      const codeCommentFromDB = await codeCommentService.create(data, userId);
      console.log(codeCommentFromDB);

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
      return await codeCommentService.getAllAllowed(ctx.id);

      // const codeComments = await codeCommentService.getAll(ctx.id, allowedProjectFileIds);
    } catch (e) {
      throw new Error("Can't getAllCodeComments");
    }
  }

  @Query(() => CodeComment)
  async getCodeCommentById(
    @Arg("codeCommentId") codeCommentId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment | null> {
    try {
      return await codeCommentService.getById(codeCommentId, ctx.id);
      // const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      // if (!isAllowedcomment(codeComment, allowedProjectFileIds))
      //   throw new Error("not authorized");

      // return codeComment;
    } catch (e) {
      throw new Error("Can't getCodeCommentById");
    }
  }

  @Mutation(() => CodeComment)
  async updateCodeComment(
    @Arg("data") data: ICodeComment,
    @Arg("CodeCommentId") codeCommentId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment | null> {
    try {
      // const _codeComment = await codeCommentService.getById(codeCommentId);
      // const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
      // if (!isAllowedcomment(_codeComment, allowedProjectFileIds))
      //   throw new Error("not authorized");
      const userId = ctx.id;
      return await codeCommentService.update(data, userId, codeCommentId);
    } catch (e) {
      throw new Error("Can't update CodeComment");
    }
  }

  // @Mutation(() => CodeComment)
  // async deleteCodeComment(
  //   @Arg("CodeCommentId") codeCommentId: number,
  //   @Ctx() ctx: Context<TokenPayload>
  // ): Promise<CodeComment> {
  //   try {
  //     const codeComment = await codeCommentService.getById(codeCommentId);
  //     const allowedProjectFileIds = await getAllowedProjectFileIds(ctx);
  //     if (!isAllowedcomment(codeComment, allowedProjectFileIds))
  //       throw new Error("not authorized");

  //     return await codeCommentService.delete(codeCommentId);
  //   } catch (e) {
  //     throw new Error("Can't delete CodeComment");
  //   }
  // }
}
