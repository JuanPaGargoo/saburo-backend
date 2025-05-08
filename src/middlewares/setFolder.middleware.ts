import { FolderRequest } from '../types/request'; // Importa el tipo extendido
import { Response, NextFunction } from 'express';

/**
 * Middleware para establecer dinámicamente la carpeta de destino para Multer.
 * @param folder - Nombre de la carpeta donde se guardarán los archivos.
 */
export const setFolder = (folder: string) => {
  return (req: FolderRequest, _res: Response, next: NextFunction) => {
    req.folder = folder; // Agrega la carpeta al objeto de la solicitud
    next();
  };
};