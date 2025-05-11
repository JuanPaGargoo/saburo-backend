import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes'; // Importar las rutas de productos
import path from 'path';
import { loggerMiddleware } from './middlewares/logger.middleware'; // Importar el middleware
import paymentRoutes from "./routes/payment.routes";
import cors from 'cors';
import commentRoutes from "./routes/comment.routes";
import chatbotRoutes from "./routes/chatbot.routes";

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
app.use('/api/users', userRoutes);

// Registrar las rutas de productos
app.use('/api/products', productRoutes);

// Servir la carpeta uploads como estática
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/paypal", paymentRoutes); // <--- Esto agrega el endpoint 

// Rutas de comentarios
app.use("/api/comments", commentRoutes);

// Rutas del chatbot
app.use("/api/chatbot", chatbotRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
