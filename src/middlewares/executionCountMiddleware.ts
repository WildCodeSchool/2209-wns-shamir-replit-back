import { ExpressControllerFunction } from "../interfaces";
import { IExecution } from "../interfaces/InputType";
// import { Execution, User } from "../models";
import executionService from "../services/executionService";
import projectService from "../services/projectService";
import userService from "../services/userService";

// type ReqExecution = Omit<Execution, "userId"> & {
//   userId: User;
//   // id_storage_number: string;
// };

const compareDate = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const executionCountMiddleware: ExpressControllerFunction = async (
  req,
  res,
  next
) => {
  const userId = req.token?.id;

  if (userId) {
    const { projectId }: { projectId: number } = req.body;
    const execution_date = new Date();

    const user = await userService.getById(userId);
    if (!user) throw new Error("user not found");

    const project = await projectService.getByProjId(userId, projectId);
    if (!project) throw new Error("project not found");

    const date_end_subscription = user.date_end_subscription;
    const date_start_subscription = user.date_start_subscription;

    if (
      !date_end_subscription ||
      !date_start_subscription ||
      date_start_subscription.getTime() > execution_date.getTime() ||
      date_end_subscription.getTime() < execution_date.getTime()
    ) {
      // check nb executions in free mode
      const executions = await executionService.getAll(userId);

      const nbExecutions = executions.filter(
        (execution) =>
          execution.user.id === userId &&
          compareDate(execution.execution_date, execution_date)
      ).length;

      req.nbExecutions = nbExecutions;

      if (nbExecutions >= 50) {
        res
          .status(429)
          .send({ outOfLimit: "outOfLimit free plan", nbExecutions });
        return;
      }
    }

    const output = "";
    const executionData: IExecution = { projectId, userId, output };

    await executionService.create(executionData, userId);

    if (next) return next();
  }

  res.sendStatus(500);
};
