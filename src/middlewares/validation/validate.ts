import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";

const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    await schema.validate(data)
    next()
  } catch (error) {
    next(error)
  }
}
export default validate;