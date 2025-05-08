import { Router } from 'express';
import { upload } from '../config/multer';
import {
  registerUser,
  loginUser,
  showUser,
  updateUser,
  getAllUsers,
  deleteUser,
} from '../controllers/user.controller';
import { setFolder } from '../middlewares/setFolder.middleware';

const router = Router();

// Rutas equivalentes a las de Laravel
router.post('/register', setFolder('profilePhotos'), upload.single('profilePhoto'), registerUser); // Registrar usuario con foto de perfil
router.post('/login', loginUser); // Iniciar sesión
router.patch('/:id/update', setFolder('profilePhotos'), upload.single('profilePhoto'), updateUser); // Actualizar usuario parcialmente
router.get('/allUsers', getAllUsers); // Obtener todos los usuarios
router.get('/:id', showUser); // Mostrar usuario por ID
router.delete('/:id', deleteUser); // Eliminar un usuario

export default router;