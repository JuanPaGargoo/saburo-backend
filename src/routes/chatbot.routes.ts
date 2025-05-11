import { Router } from "express";
import { ChatbotController } from "../controllers/chatbot.controller";

const router = Router();

// Ruta para interactuar con el chatbot
router.post("/chat", ChatbotController.chat);

export default router;