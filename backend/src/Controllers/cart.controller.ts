import { Cart } from "../Models/cart.model";
import { Product } from "../Models/product.model"; // Import Product here

export const addToCart = async (req: any, res: any) => {
    const { buyingQuantity } = req.body;
    const productId = req.params.productId;

    try {
        const item = await Product.findById(productId);
        if (!item) {
            return res.status(404).json({ message: "Product not found" });
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

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
            });
            await newCart.save();
            return res.status(200).json(newCart);
        }

        const cartItem = cart.items;
        const itemIndex = cartItem.findIndex((item: any) => item.productId.toString() === productId.toString());

        if (itemIndex > -1) {
            cartItem[itemIndex].buyingQuantity += buyingQuantity;
            cartItem[itemIndex].buyingItemTotalPrice += item.price * buyingQuantity;
        } else {
            cartItem.push({
                productId: productId,
                buyingQuantity: buyingQuantity,
                buyingItemTotalPrice: item.price * buyingQuantity
            });
        }

        cart.items = cartItem;
        cart.recalculateTotalPrice()
        await cart.save();
        return res.status(200).json(cart.toJSON({ virtuals: true }));
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

export const handleQuantityChange = async (req: any, res: any) => {
    const { itemId, quantity } = req.body;

    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === itemId.toString());
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const item = cart.items[itemIndex];
        item.buyingQuantity = quantity;
        item.buyingItemTotalPrice = item.productId.price * quantity;

        cart.recalculateTotalPrice()
        await cart.save();
        return res.status(200).json(cart.toJSON({ virtuals: true }));
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

export const getCart = async (req: any, res: any) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        return res.status(200).json({ cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const removeFromCart = async (req: any, res: any) => {
    const { itemId } = req.params;

    console.log(itemId)

    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === itemId.toString());
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const item = cart.items[itemIndex];
        cart.items.splice(itemIndex, 1);
        cart.buyingTotalPrice -= item.buyingItemTotalPrice;

        await cart.save();
        return res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};