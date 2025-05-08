
import { Router } from 'express';
import { saludo } from '../controllers/home.controller';

const router = Router();

router.get('/', saludo);

export default router;
