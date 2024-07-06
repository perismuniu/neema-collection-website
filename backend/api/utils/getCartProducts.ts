import { Cart } from "../Models/cart.model";
import { Product } from "../Models/product.model"; // <--- Add this line

export const getCartProducts = async (cartId: string) => {
  const cart = await Cart.findById(cartId).populate({ path: "items.productId", model: Product }); // <--- Update this line
  if (!cart) {
    throw new Error("Cart not found");
  }

  const products = cart.items.map((item) => item.productId);
  return products;
}