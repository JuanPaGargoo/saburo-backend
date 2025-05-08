import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes'; // Importar las rutas de productos
import path from 'path';
import { loggerMiddleware } from './middlewares/logger.middleware'; // Importar el middleware
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configurar CORS
app.use(cors());

// Usar el middleware de registro
app.use(loggerMiddleware);

// Registrar las rutas de usuario
app.use('/users', userRoutes);

// Registrar las rutas de productos
app.use('/products', productRoutes);

// Servir la carpeta uploads como estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
