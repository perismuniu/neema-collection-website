"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = require("../Models/cart.model");
const product_model_1 = require("../Models/product.model");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cart_model_1.Cart.findOne({ user: req.user._id }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity, color, size } = req.body;
        const userId = req.user._id;
        const product = yield product_model_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            cart = new cart_model_1.Cart({ user: userId, items: [], totalPrice: 0 });
        }
        const existingItem = cart.items.find(item => item.productId.toString() === productId &&
            item.color === color &&
            item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({
                productId,
                quantity,
                color,
                size,
                price: product.price
            });
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
});
exports.addToCart = addToCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity, color, size } = req.body;
        const userId = req.user._id;
        const cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const item = cart.items.find(item => item.productId.toString() === productId &&
            item.color === color &&
            item.size === size);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        item.quantity = quantity;
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error });
    }
});
exports.updateCartItem = updateCartItem;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, color, size } = req.params;
        const userId = req.user._id;
        const cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => !(item.productId.toString() === productId &&
            item.color === color &&
            item.size === size));
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        yield cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
});
exports.removeFromCart = removeFromCart;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const cart = yield cart_model_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        cart.totalPrice = 0;
        yield cart.save();
        res.status(200).json({ message: 'Cart cleared successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
});
exports.clearCart = clearCart;
