import { Repository } from "typeorm";
import { Execution } from "../models/execution.model";
import { dataSource } from "../tools/utils";

const repository: Repository<Execution> = dataSource.getRepository(Execution);

const executionService = {
  getById: async (executionId: number) => {
    return (await repository.findBy({ id: executionId }))[0];
  },

  getAll: async (): Promise<Execution[]> => {
    return await repository.find();
  },
  create: async (
    projectId: number,
    userId: number,
    output: string,
    execution_date: Date
  ): Promise<Execution> => {
    const newExecution = {
      projectId,
      userId,
      output,
      execution_date,
    };
    return await repository.save(newExecution);
  },
  update: async (
    execution: Execution,
    executionId: number
  ): Promise<Execution> => {
    await repository.update(executionId, execution);
    return await executionService.getById(executionId);
  },

  delete: async (executionId: number): Promise<Execution> => {
    const execution = await executionService.getById(executionId);
    await repository.delete(executionId);
    return execution;
  },
};

export default executionService;
