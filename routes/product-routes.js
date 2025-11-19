import express from 'express';
import {
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product-controller.js';

import { protect, adminOnly } from '../middleware/auth-middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductsById);

// Protected routes (admin only) 
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
