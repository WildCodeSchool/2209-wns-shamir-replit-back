import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ICodeComment } from "../interfaces/InputType";
import { CodeComment } from "../models/code_comment.model";
import codeCommentService from "../services/codeCommentService";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(CodeComment)
export class CodeCommentResolver {
  @Mutation(() => CodeComment)
  async createCodeComment(
    @Arg("data") data: ICodeComment,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment> {
    try {
      return await codeCommentService.create(data, ctx.id);
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
      return await codeCommentService.getByCodeCommentId(ctx.id, codeCommentId);
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
      return await codeCommentService.update(data, ctx.id, codeCommentId);
    } catch (e) {
      throw new Error("Can't update CodeComment");
    }
  }

  @Mutation(() => CodeComment)
  async deleteCodeComment(
    @Arg("CodeCommentId") codeCommentId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<CodeComment | null> {
    try {
      return await codeCommentService.delete(ctx.id, codeCommentId);
    } catch (e) {
      throw new Error("Can't delete CodeComment");
    }
  }
}
