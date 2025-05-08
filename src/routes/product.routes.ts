import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { upload } from '../config/multer'; // Usar la configuración existente de multer

const router = Router();

router.get('/allProducts', ProductController.getAllProducts);
router.post(
  '/addProduct',
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'modelImage', maxCount: 1 },
  ]),
  ProductController.addProduct
);
router.patch(
  '/updateProduct/:id',
  upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'modelImage', maxCount: 1 },
  ]),
  ProductController.updateProduct
);
router.delete('/deleteProduct/:id', ProductController.deleteProduct);
router.get('/getProduct/:id', ProductController.getProductById);

export default router;