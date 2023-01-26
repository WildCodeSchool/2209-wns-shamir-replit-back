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
    @Arg("userId") userId: number,
    @Arg("output") output: string,
    @Arg("execution_date") execution_date: Date,
    @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution> {
    try {
      if (userId !== ctx.id) throw new Error("userId not allowed");

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
  async getAllExecutions(  @Ctx() ctx: Context<TokenPayload>
  ): Promise<Execution[]> {
    try {
      const exe = await executionService.getAll();
      return exe.filter(x => x.id === ctx.id)    
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
      const exec = await executionService.getById(executionId);
      return exec.filter((exe) => exe.user.id === ctx.id);   } catch (err) {
      console.error(err);
      throw new Error("Can't find Execution");
    }
  }

  @Mutation(() => Execution)
  async updateExecution(
    @Arg("Execution") Execution: iExecution,
    @Arg("ExecutionId") ExecutionId: number
  ): Promise<Execution> {
    try {
      return await executionService.update(Execution, ExecutionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't update Execution");
    }
  }

  @Mutation(() => Execution)
  async deleteExecution(
    @Arg("ExecutionId") ExecutionId: number
  ): Promise<Execution> {
    try {
      return await executionService.delete(ExecutionId);
    } catch (err) {
      console.error(err);
      throw new Error("Can't delete Execution");
    }
  }
}
