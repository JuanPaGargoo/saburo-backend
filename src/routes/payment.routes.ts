import { Router } from "express";
import { createOrder, captureOrder } from "../controllers/payment.controller";

const router = Router();

router.post("/create-order", createOrder);
router.get("/capture-order", captureOrder);

export default router;
