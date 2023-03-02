import { ExpressControllerFunction } from "../interfaces";
import executeCode from "../services/vmService";

export const executeCodeController: ExpressControllerFunction = async (
  req,
  res
) => {
  const { code } = req.body;
  let nbExecutions = req.nbExecutions;

  const result = await executeCode(code);

  if (nbExecutions !== undefined) nbExecutions++;

  if (result) {
    res.send({ result, nbExecutions });
  } else {
    res.status(500).send("Internal server error");
  }
};
