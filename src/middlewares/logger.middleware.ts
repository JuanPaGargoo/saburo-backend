import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
};