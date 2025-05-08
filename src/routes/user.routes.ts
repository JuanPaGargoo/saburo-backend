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

const router = Router();

router.post('/register', upload.single('profilePhoto'), registerUser); // Registrar usuario con foto de perfil
router.patch('/:id/update', upload.single('profilePhoto'), updateUser); // Actualizar usuario parcialmente
router.post('/login', loginUser); // Iniciar sesión
router.get('/allUsers', getAllUsers); // Obtener todos los usuarios
router.get('/:id', showUser); // Mostrar usuario por ID
router.delete('/:id', deleteUser); // Eliminar un usuario

export default router;