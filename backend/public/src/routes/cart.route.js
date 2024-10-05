"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../utils/auth.middleware");
const cart_controller_1 = require("../Controllers/cart.controller");
const router = express_1.default.Router();
router.get('/cart', auth_middleware_1.isAuthenticated, cart_controller_1.getCart);
router.post('/cart', auth_middleware_1.isAuthenticated, cart_controller_1.addToCart);
router.put('/cart', auth_middleware_1.isAuthenticated, cart_controller_1.updateCartItem);
router.delete('/cart/:productId', auth_middleware_1.isAuthenticated, cart_controller_1.removeFromCart);
router.delete('/cart', auth_middleware_1.isAuthenticated, cart_controller_1.clearCart);
exports.default = router;
