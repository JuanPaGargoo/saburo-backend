import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CommentController {
  // Crear un comentario
  static async createComment(req: Request, res: Response): Promise<void> {
    const { name, stars, text, productId } = req.body;

    if (!name || !stars || !text || !productId) {
      res.status(400).json({ error: "Todos los campos son obligatorios" });
      return;
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          name,
          stars,
          text,
          productId,
        },
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error al crear el comentario:", error);
      res.status(500).json({ error: "No se pudo crear el comentario" });
    }
  }

  // Obtener todos los comentarios
  static async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await prisma.comment.findMany();
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
      res.status(500).json({ error: "No se pudieron obtener los comentarios" });
    }
  }

  // Obtener comentarios por producto
  static async getCommentsByProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;

    try {
      const comments = await prisma.comment.findMany({
        where: { productId: parseInt(productId, 10) },
      });
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error al obtener los comentarios del producto:", error);
      res.status(500).json({ error: "No se pudieron obtener los comentarios del producto" });
    }
  }

  // Actualizar un comentario
  static async updateComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name, stars, text } = req.body;

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(id, 10) },
        data: { name, stars, text },
      });
      res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
      res.status(500).json({ error: "No se pudo actualizar el comentario" });
    }
  }

  // Eliminar un comentario
  static async deleteComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await prisma.comment.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      res.status(500).json({ error: "No se pudo eliminar el comentario" });
    }
  }

  // Obtener 4 comentarios al azar con stars > 4
  static async getRandomComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await prisma.$queryRaw`
        SELECT * FROM "Comment"
        WHERE "stars" >= 4
        ORDER BY RANDOM()
        LIMIT 4
      `;
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error al obtener comentarios al azar:", error);
      res.status(500).json({ error: "No se pudieron obtener los comentarios al azar" });
    }
  }
}