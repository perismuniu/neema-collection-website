import { Cart } from "../Models/cart.model";
import { Product } from "../Models/product.model";

export const addToCart = async (req: any, res: any) => {
    const { buyingQuantity } = req.body;
    const productId = req.params.productId

    try {
        const item = await Product.findById(productId)
        if (item) {
            const userId = req.user._id
            const cart = await Cart.findOne({ user: userId })
            if (!cart) {
                const newCart = new Cart({
                    user: userId,
                    items: [
                        {
                            productId: productId,
                            buyingQuantity: buyingQuantity,
                            buyingItemTotalPrice: item.price * buyingQuantity
                        }
                    ],
                    buyingTotalPrice: item.price * buyingQuantity
                })
                await newCart.save()
                return res.status(200).json(newCart)
            }

            const cartItem = cart.items
            const itemIndex = cartItem.findIndex((item: any) => item.productId.toString() === productId.toString())
            if (itemIndex > -1) {
                cartItem[itemIndex].buyingQuantity += buyingQuantity
                cartItem[itemIndex].buyingItemTotalPrice += item.price * buyingQuantity
                cart.buyingTotalPrice += item.price * buyingQuantity
            }
            else {
                cartItem.push({
                    productId: productId,
                    buyingQuantity: buyingQuantity,
                    buyingItemTotalPrice: item.price * buyingQuantity
                })
                cart.buyingTotalPrice += item.price * buyingQuantity
            }

            cart.items = cartItem
            await cart.save()
            return res.status(200).json(cart.toJSON({ virtuals: true }))

        } else {
            return res.status(404).json({ message: "Product not found" })
        }

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export const getCart = async (req: any, res: any) => {
    try {
        const userId = req.user._id
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // const products = await getCartProducts(cart._id);
        return res.status(200).json({ cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeFromCart = async (req: any, res: any) => {
  const { id } = req.params;
  let itemIndex;

  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedCart = await getcartwithproducts(cart);
    itemIndex = updatedCart.items.findIndex((item: any) => item._id.toString() === id.toString());

    if (itemIndex === -1) {
      return res.status(403).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    // No need to recalculate totalQuantity and buyingTotalPrice manually
    // as they are virtual properties that will be updated automatically

    await cart.save();
    const finalCart = await getcartwithproducts(cart);  // Get the updated cart after removal
    return res.status(201).json(finalCart);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getcartwithproducts = async (cart: any) => {
    if (!cart) {
        return "not a cart";
    }

    const productIds = cart.items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).exec();

    cart.items = cart.items.map((item: any) => {
        const product = products.find(p => p._id.toString() === item.productId.toString());
        return { ...item, product };
    });

    return cart;
};
