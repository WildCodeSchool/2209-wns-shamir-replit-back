import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Execution } from "../models/execution.model";
import executionService from "../services/executionService";

@Resolver(Execution)
export class ExecutionResolver {
  @Mutation(() => Execution)
  async createExecution(
    @Arg("output") output: string,
    @Arg("userId") userId: number,
    @Arg("projectId") projectId: number,
    @Arg("execution_date") execution_date: Date
  ): Promise<Execution> {
    const executionFromDB = await executionService.create(
      userId,
      output,
      projectId,
      execution_date
    );
    console.log(executionFromDB);
    return executionFromDB;
  }

  @Query(() => [Execution])
  async getAllExecutions(): Promise<Execution[]> {
    return await executionService.getAll();
  }
  @Query(() => Execution)
  async getExecutionById(
    @Arg("executionId") executionId: number
  ): Promise<Execution> {
    return await executionService.getById(executionId);
  }

  @Mutation(() => Execution)
  async updateExecution(
    @Arg("Execution") Execution: Execution,
    @Arg("ExecutionId") ExecutionId: number
  ): Promise<Execution> {
    try {
      return await executionService.update(Execution, ExecutionId);
    } catch (e) {
      throw new Error("Can't update Execution");
    }
  }

  @Mutation(() => Execution)
  async deleteExecution(
    @Arg("ExecutionId") ExecutionId: number
  ): Promise<Execution> {
    try {
      return await executionService.delete(ExecutionId);
    } catch (e) {
      throw new Error("Can't delete Execution");
    }
  }
}
