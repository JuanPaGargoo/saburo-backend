import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
  // Obtener todos los productos
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  }

  // Agregar un nuevo producto
  static async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        price,
        description,
        category,
        gender,
        discount = '0', // Valor predeterminado como cadena "0"
        soldOut,
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const frontImage = files?.['frontImage']?.[0]?.filename || '';
      const backImage = files?.['backImage']?.[0]?.filename || '';
      const modelImage = files?.['modelImage']?.[0]?.filename || '';

      // Convertir discount a un número entero, manejar cadena vacía
      const parsedDiscount = discount.trim() === '' ? 0 : parseInt(discount, 10);

      // Convertir soldOut a booleano
      const isSoldOut = soldOut === 'true' ? true : soldOut === 'false' ? false : false;

      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          frontImage,
          backImage,
          modelImage,
          description,
          category,
          gender,
          discount: parsedDiscount, // Usar el valor convertido
          soldOut: isSoldOut,
        },
      });

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({
        error: 'Error al agregar el producto',
        details: (error as Error).message,
      });
    }
  }

  // Editar un producto por ID
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const frontImage = files?.['frontImage']?.[0]?.filename;
      const backImage = files?.['backImage']?.[0]?.filename;
      const modelImage = files?.['modelImage']?.[0]?.filename;

      if (frontImage) updatedData.frontImage = frontImage;
      if (backImage) updatedData.backImage = backImage;
      if (modelImage) updatedData.modelImage = modelImage;

      // Convertir discount a un número entero o asignar 0 si está vacío
      updatedData.discount = updatedData.discount?.trim() === '' ? 0 : parseInt(updatedData.discount, 10);

      // Convertir soldOut a booleano
      updatedData.soldOut = updatedData.soldOut === 'true' ? true : updatedData.soldOut === 'false' ? false : false;

      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: updatedData,
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar el producto',
        details: (error as Error).message,
      });
    }
  }

  // Eliminar un producto por ID
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await prisma.product.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar el producto' });
    }
  }

  // Obtener un producto por ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' }); 
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener el producto',
        details: (error as Error).message,
      });
    }
  }
}