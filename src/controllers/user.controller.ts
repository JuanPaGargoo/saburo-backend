import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { FolderRequest } from '../types/request';

// Registrar usuario
export const registerUser = async (req: FolderRequest, res: Response) => {
  const { name, email, password } = req.body;
  const profilePhoto = req.file ? `/uploads/${req.folder}/${req.file.filename}` : null; // Usa req.folder

  try {
    // Validar datos
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profilePhoto,
      },
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Mostrar usuario por ID
export const showUser = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    // Buscar usuario por ID
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto
        ? `http://localhost:3000${user.profilePhoto}` // Agregar prefijo a la imagen
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Actualizar usuario
export const updateUser = async (req: FolderRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const profilePhoto = req.file ? `/uploads/${req.folder}/${req.file.filename}` : undefined;

  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar los datos del usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name: name || user.name,
        email: email || user.email,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        profilePhoto: profilePhoto || user.profilePhoto, // Actualizar la foto si se subió una nueva
      },
    });

    res.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// Iniciar sesión
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Buscar usuario por correo
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Inicio de sesión exitoso',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};