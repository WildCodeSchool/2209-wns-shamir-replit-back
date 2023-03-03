import { Repository } from "typeorm";
import { Execution } from "../models/execution.model";
import { dataSource } from "../tools/createDataSource";

const repository: Repository<Execution> = dataSource.getRepository(Execution);

const executionService = {
  getById: async (executionId: number): Promise<Execution[]> =>
    await repository.find({
      relations: { userId: true, projectId: true },
      where: {
        id: executionId,
      },
    }),

  getAll: async (): Promise<Execution[]> =>
    await repository.find({
      relations: { userId: true, projectId: true },
    }),
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
    return (await executionService.getById(executionId))[0];
  },

  delete: async (executionId: number): Promise<Execution> => {
    const execution = (await executionService.getById(executionId))[0];
    await repository.delete(executionId);
    return execution;
  },
};

export default executionService;
