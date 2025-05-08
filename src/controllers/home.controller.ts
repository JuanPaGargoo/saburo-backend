import { Request, Response } from 'express';

export const saludo = (req: Request, res: Response) => {
  res.send('¡Hola desde el controlador!');
};
