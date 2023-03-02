import { ExpressControllerFunction } from "../interfaces";
import { IExecution } from "../interfaces/InputType";
import { Execution } from "../models";
import executionService from "../services/executionService";
import userService from "../services/userService";

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
      const executions: Execution[] = await executionService.getAll(userId);

      const nbExecutions = executions.filter((execution) =>
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

    const data: IExecution = {
      output: "",
      projectId: projectId,
      userId: userId,
    };

    await executionService.create(data, userId);

    if (next) return next();
  }

  console.log("boloss");

  res.sendStatus(500);
};
