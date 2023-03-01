import { Repository } from "typeorm";
import { IExecution } from "../interfaces/InputType";
import { Project, User } from "../models";
import { Execution } from "../models/execution.model";
import { ProjectResolver } from "../resolvers/projectResolver";
import { dataSource } from "../tools/createDataSource";

const execRepo: Repository<Execution> = dataSource.getRepository(Execution);
const userRepo: Repository<User> = dataSource.getRepository(User);
const projectRepo: Repository<Project> = dataSource.getRepository(Project);

const executionService = {
  getById: async (
    uid: number,
    executionId: number
  ): Promise<Execution | null> => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("inputs null");

    return await execRepo.findOne({
      relations: { user: true, project: true },
      where: {
        id: executionId,
        user: user,
      },
    }),


  getAll: async (uid: number): Promise<Execution[]> => {
    const user = await userRepo.findOneBy({ id: uid });
    if (user === null) throw new Error("inputs null");
    return await execRepo.find({
      relations: { user: true, project: true },
      where: { user: user },
    });
  },
  create: async (data: IExecution, uid: number): Promise<Execution> => {
    const user = await userRepo.findOneBy({ id: uid });
    const project = await projectRepo.findOneBy({ id: data.projectId });
    if (user === null) throw new Error("user null");
    if (project === null) throw new Error("project null");

    return await execRepo.save({ ...data, user, project });

  },
  update: async (
    execution: IExecution,
    uid: number,
    executionId: number
  ): Promise<Execution | null> => {
    const exec = await executionService.getById(uid, executionId);
    if (exec === null) throw new Error("fu");
    await execRepo.update(executionId, execution);
    return await execRepo.findOneBy({
      id: executionId,
    });
  },

  delete: async (
    uid: number,
    executionId: number
  ): Promise<Execution | null> => {
    const exec = await executionService.getById(uid, executionId);
    if (exec === null) throw new Error("fu");
    await execRepo.delete(executionId);
    return exec;
  },
};

export default executionService;
