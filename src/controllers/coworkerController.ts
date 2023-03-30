import { ExpressControllerFunction } from "../interfaces";
import { Coworker, ioManager } from "../websocket/ioManager";

export const coworkerController: ExpressControllerFunction = async (
  req,
  res
) => {
  try {
    const socketIds = req.body.socketIds as string[];
    const coworker = req.body.coworker as Coworker;

    await ioManager.coworkerSocket({
      socketIds,
      coworker,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);

    res.status(500).send("Internal server error");
  }
};
