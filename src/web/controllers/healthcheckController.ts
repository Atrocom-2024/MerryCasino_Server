import { Request, Response } from "express";

export const getHealthcheck = async (_: Request, res: Response) => {
  res.status(200).send('OK');
}