// cart.service.js

import { Cart } from "../Models/cart.model";

export const getCartProducts = async (cartId: string) => {
  const cart = await Cart.findById(cartId).populate("items.productId");
  if (!cart) {
    throw new Error("Cart not found");
  }

  const products = cart.items.map((item) => item.productId);
  return products;
};