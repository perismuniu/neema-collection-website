import { Request, Response } from 'express';
import { Cart, ICart } from '../Models/cart.model';
import { Product } from '../Models/product.model';

export const getCart = async (req: any, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

export const addToCart = async (req: any, res: Response) => {
  try {
    const { productId, quantity, color, size } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId && 
      item.color === color && 
      item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        color,
        size,
        price: product.price
      });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const { productId, quantity, color, size } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => 
      item.productId.toString() === productId && 
      item.color === color && 
      item.size === size
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  try {
    const { productId, color, size } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      !(item.productId.toString() === productId && 
        item.color === color && 
        item.size === size)
    );

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

export const clearCart = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};
