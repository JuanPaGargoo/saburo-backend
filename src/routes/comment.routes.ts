import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";

const router = Router();

// Crear un comentario
router.post("/", CommentController.createComment);

// Obtener todos los comentarios
router.get("/", CommentController.getAllComments);

// Obtener comentarios por producto
router.get("/product/:productId", CommentController.getCommentsByProduct);

// Actualizar un comentario
router.put("/:id", CommentController.updateComment);

// Eliminar un comentario
router.delete("/:id", CommentController.deleteComment);

// Ruta para obtener 4 comentarios al azar
router.get("/random", CommentController.getRandomComments);

export default router;