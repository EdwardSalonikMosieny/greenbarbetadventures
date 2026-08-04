import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

/** Validates req.body against `schema`, replacing it with the parsed (typed) result on success. */
function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export default validateBody;
