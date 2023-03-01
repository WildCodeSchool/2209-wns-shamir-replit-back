import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { IExecution } from "../interfaces/InputType";
import { Execution } from "../models/execution.model";
import executionService from "../services/executionService";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(Execution)
export class ExecutionResolver {
  @Mutation(() => Execution)
  async createExecution(
    @Arg("data") data: IExecution,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution> {
    try {
      const executionFromDB = await executionService.create(data, ctx.id);
      return executionFromDB;
    } catch (err) {
      console.error(err);
      throw new Error("Can't create Execution");
    }
  }

  @Query(() => [Execution])
  async getAllExecutions(
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution[]> {
    try {
      return await executionService.getAll(ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Executions");
    }
  }

  @Query(() => Execution)
  async getExecutionById(
    @Arg("executionId") executionId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution | null> {
    try {
      return await executionService.getById(ctx.id, executionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Execution");
    }
  }

  @Mutation(() => Execution)
  async updateExecution(
    @Arg("data") data: IExecution,
    @Arg("ExecutionId") executionId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution | null> {
    try {
      return await executionService.update(data, ctx.id, executionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Execution");
    }
  }

  @Mutation(() => Execution)
  async deleteExecution(
    @Arg("ExecutionId") executionId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution | null> {
    try {
      return await executionService.delete(ctx.id, executionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete Execution");
    }
  }
}
