import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.method === 'GET' ? req.query : req.body;
      await schema.parseAsync(data);
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Validation error', error });
    }
  };
};