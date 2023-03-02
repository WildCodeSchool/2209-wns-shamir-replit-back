import { ExpressControllerFunction } from "../interfaces";
import { Execution, User } from "../models";
import executionService from "../services/executionService";
import userService from "../services/userService";

type ReqExecution = Omit<Execution, "userId"> & {
  userId: User;
  // id_storage_number: string;
};

const compareDate = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const executionCountMiddleware: ExpressControllerFunction = async (
  req,
  res,
  next
) => {
  console.log("executionCountMiddleware");

  const userId = req.token?.id;

  if (userId) {
    const { projectId }: { projectId: number } = req.body;
    const execution_date = new Date();

    const user = await userService.getById(userId);
    if (!user.length) throw new Error("user not found");

    const date_end_subscription = user[0].date_end_subscription;
    const date_start_subscription = user[0].date_start_subscription;

    if (
      !date_end_subscription ||
      !date_start_subscription ||
      date_start_subscription.getTime() > execution_date.getTime() ||
      date_end_subscription.getTime() < execution_date.getTime()
    ) {
      // check nb executions in free mode
      const executions =
        (await executionService.getAll()) as unknown as ReqExecution[];

      const nbExecutions = executions.filter(
        (execution) =>
          execution.userId.id === userId &&
          compareDate(execution.execution_date, execution_date)
      ).length;

      console.log("nbExecutions", nbExecutions);

      req.nbExecutions = nbExecutions;

      if (nbExecutions >= 50) {
        res
          .status(429)
          .send({ outOfLimit: "outOfLimit free plan", nbExecutions });
        return;
      }
    }

    const output = "";

    await executionService.create(projectId, userId, output, execution_date);

    if (next) return next();
  }

  console.log("boloss");

  res.sendStatus(500);
};
