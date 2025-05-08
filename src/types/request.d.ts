import { Request } from 'express';

export interface FolderRequest extends Request {
  folder?: string; // Propiedad personalizada
}