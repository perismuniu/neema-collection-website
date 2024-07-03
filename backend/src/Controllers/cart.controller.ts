import { Cart } from "../Models/cart.model";
import { Product } from "../Models/product.model";
import { getCartProducts } from "../utils/getCartProducts";

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
        return res.status(200).json({cart});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeFromCart = async (req: any, res: any) => {
    const { productId } = req.body;


    try {
        const userId = req.user._id
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  cart.items.splice(itemIndex, 1);

  cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.buyingQuantity, 0);

  cart.buyingTotalPrice = cart.items.reduce((acc, item) => acc + (item.buyingQuantity * item.productId.price), 0);

  await cart.save();
 return res.status(201).json(cart);

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}