import { Request, Response } from "express";
import { IOrder, Order } from "../Models/order.model";
import { Product } from "../Models/product.model";
import getOAuthToken, { mpesaStkPush } from "../utils/mpesaAuth";
import { checkMtnGhanaPaymentStatus } from "../utils/mtn";
import { emitNotification, NotificationTypes } from "../utils/notification";


const initiateMpesaPayment = async (phone: string, amount: number, orderId: string) => {
  try {
    // const token = await getOAuthToken();
    // const response: any = await mpesaStkPush(amount, token);
    return {
      MerchantRequestID: "123456789",//response.MerchantRequestID,
      CheckoutRequestID: "987654321",//response.CheckoutRequestID,
    };
  } catch (error) {
    console.error("Error initiating Mpesa payment:", error);
    throw error;
  }
};

const checkMpesaPaymentStatus = async (checkoutRequestId: string) => {
  // Implement the logic to check the Mpesa payment status
  // This might involve making an API call to Mpesa to check the status
  // For now, we'll return a mock status
  const statuses = ["Success", "Failed", "Pending"];
  return statuses[1];
};

export const createOrder = async (req: any, res: Response) => {
  const user = req.user;
  const { items, shippingInfo, total, paymentMethod, deliveryType } = req.body;

  try {
    // Check stock availability
    for (const item of items) {
      const productInStock = await Product.findById(item.product);
      if (!productInStock) {
        return res.status(404).json({ message: `Product not found` });
      }
      const variant = productInStock.variants.find((v) => v.color === item.color);
      if (!variant) {
        return res.status(404).json({ message: `Variant not found` });
      }
      const stockItem = variant.stock.find((s) => s.size === item.size);
      if (!stockItem || stockItem.quantity < item.quantity) {
        return res.status(404).json({ message: `Not enough stock for product ${item.product}` });
      }
    }

    const newOrder = new Order({
      user: user._id,
      items,
      total,
      shippingInfo,
      deliveryType,
      paymentMethod,
      status: 'pending',
    });

    if (paymentMethod === "mpesa") {
      try {
        const mpesaResponse = await initiateMpesaPayment(user.phone, total, newOrder._id);
        newOrder.mpesaRequestId = mpesaResponse.MerchantRequestID;
        newOrder.mpesaCheckoutRequestId = mpesaResponse.CheckoutRequestID;
        newOrder.status = 'pending_payment';
        await newOrder.save();

      } catch (error) {
        console.error("Error initiating Mpesa payment:", error);
        return res.status(500).json({ message: "Error initiating Mpesa payment" });
      }
    }

    const savedOrder = await newOrder.save();

    // Update product stock
    await updateProductStock(savedOrder);

    // Update user orders
    user.orders = [...user.orders, savedOrder._id];

    await user.save();


    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProductStock = async (order: any) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find((v) => v.color === item.color);
      if (variant) {
        const stockItem = variant.stock.find((s) => s.size === item.size);
        if (stockItem) {
          stockItem.quantity -= item.quantity;
          await product.save();
        }
      }
    }
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.status === "pending_payment") {
      let paymentStatus;
      
      if (order.paymentMethod === "mpesa") {
        paymentStatus = await checkMpesaPaymentStatus(order.mpesaCheckoutRequestId as string);
      } else if (order.paymentMethod === "mtn_ghana") {
        paymentStatus = await checkMtnGhanaPaymentStatus(order.mtnGhanaTransactionId as string);
      }
      
      if (paymentStatus === "Success") {
        order.status = "completed";
        await order.save();
        await updateProductStock(order);
        
        // Emit order notification
        emitNotification({
          type: NotificationTypes.ORDER,
          title: 'New Order Received',
          content: `New order #${order._id} received from ${(order.user as any).username}`,
          orderData: {
            orderId: order._id,
            customerName: (order.user as any).username,
            items: order.items as any,
            totalAmount: order.total,
            paymentMethod: order.paymentMethod,
            status: order.status
          }
        });
      } else if (paymentStatus === "Failed") {
        order.status = "cancelled";
        await order.save();
      }
    }
    
    res.status(200).json({ status: order.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getOrders = async (req: any, res: Response) => {
  try {
    const orders: IOrder[] = await Order.find({ user: req.user._id });

    orders.length === 0 ? res.status(404).json({ message: "You have no orders for now!" }) : res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })!;

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};