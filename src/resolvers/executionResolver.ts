import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { iExecution } from "../interfaces/InputType";
import { Execution } from "../models/execution.model";
import executionService from "../services/executionService";

@Resolver(iExecution)
export class ExecutionResolver {
  @Mutation(() => Execution)
  async createExecution(
    @Arg("projectId") projectId: number,
    @Arg("userId") userId: number,
    @Arg("output") output: string,
    @Arg("execution_date") execution_date: Date
  ): Promise<Execution> {
    try {
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
  async getAllExecutions(): Promise<Execution[]> {
    try {
      return await executionService.getAll();
    } catch (err) {
      console.error(err);
      throw new Error("Can't find all Executions");
    }
  }

  @Query(() => Execution)
  async getExecutionById(
    @Arg("executionId") executionId: number
  ): Promise<Execution> {
    try {
      return await executionService.getById(executionId);
    } catch (err) {
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
