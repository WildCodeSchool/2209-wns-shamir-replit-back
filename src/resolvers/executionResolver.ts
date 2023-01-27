import { Context } from "apollo-server-core";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { iExecution } from "../interfaces/InputType";
import { Execution } from "../models/execution.model";
import executionService from "../services/executionService";
import { TokenPayload } from "../tools/createApolloServer";

@Resolver(iExecution)
export class ExecutionResolver {
  @Mutation(() => Execution)
  async createExecution(
    @Arg("projectId") projectId: number,
    @Arg("output") output: string,
    @Arg("execution_date") execution_date: Date,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution> {
    try {
      const userId = ctx.id;

      const executionFromDB = await executionService.create(
        projectId,
        userId,
        output,
        execution_date
      );
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
      const executions = await executionService.getAll();
      return executions.filter((execution) => execution.id === ctx.id);
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Executions");
    }
  }

  @Query(() => Execution)
  async getExecutionById(
    @Arg("executionId") executionId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution> {
    try {
      const execution = (await executionService.getById(executionId))[0];

      if (execution.userId !== ctx.id) throw new Error("not allowed");

      return execution;
    } catch (err) {
      console.error(err);
      throw new Error("Can't find Execution");
    }
  }

  @Mutation(() => Execution)
  async updateExecution(
    @Arg("Execution") execution: iExecution,
    @Arg("ExecutionId") executionId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution> {
    try {
      const execution = (await executionService.getById(executionId))[0];
      if (execution.userId !== ctx.id) throw new Error("not allowed");

      return await executionService.update(execution, executionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Execution");
    }
  }

  @Mutation(() => Execution)
  async deleteExecution(
    @Arg("ExecutionId") executionId: number,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution> {
    try {
      const execution = (await executionService.getById(executionId))[0];
      if (execution.userId !== ctx.id) throw new Error("not allowed");

      return await executionService.delete(executionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete Execution");
    }
  }
}
