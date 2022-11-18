import { Request, Response } from "express";
import executeCode from "../services/vmService";

export const executeCodeController = async (req: Request, res: Response) => {
  const { code } = req.body;
  const result = await executeCode(code);
  if (result) {
    res.send(result);
  } else {
    res.status(500).send("Internal server error");
  }
};
