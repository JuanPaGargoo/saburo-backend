import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { FolderRequest } from '../types/request'; // Importa el tipo extendido

// Configuración de almacenamiento dinámico
const storage = multer.diskStorage({
  destination: (req: FolderRequest, _file, cb) => {
    const folder = req.folder || 'default'; // Usa la carpeta definida en el middleware o una predeterminada
    const uploadPath = path.join(__dirname, '../../uploads', folder);

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Guardar el archivo en la subcarpeta
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para cada archivo
  },
});

// Filtro para aceptar solo imágenes
const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'));
  }
};

export const upload = multer({ storage, fileFilter });