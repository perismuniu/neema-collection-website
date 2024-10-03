
import express from 'express';
import { isAuthenticated } from '../utils/auth.middleware';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../Controllers/cart.controller';


const router = express.Router();

router.get('/cart', isAuthenticated, getCart);
router.post('/cart', isAuthenticated, addToCart);
router.put('/cart', isAuthenticated, updateCartItem);
router.delete('/cart/:productId', isAuthenticated, removeFromCart);
router.delete('/cart', isAuthenticated, clearCart);

export default router;
