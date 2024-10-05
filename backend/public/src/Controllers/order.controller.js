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
exports.deleteOrder = exports.getOderById = exports.updateOrder = exports.getOrders = exports.checkPaymentStatus = exports.createOrder = void 0;
const order_model_1 = require("../Models/order.model");
const product_model_1 = require("../Models/product.model");
const mtn_1 = require("../utils/mtn");
const notification_1 = require("../utils/notification");
const initiateMpesaPayment = (phone, amount, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const token = await getOAuthToken();
        // const response: any = await mpesaStkPush(amount, token);
        return {
            MerchantRequestID: "123456789", //response.MerchantRequestID,
            CheckoutRequestID: "987654321", //response.CheckoutRequestID,
        };
    }
    catch (error) {
        console.error("Error initiating Mpesa payment:", error);
        throw error;
    }
});
const checkMpesaPaymentStatus = (checkoutRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement the logic to check the Mpesa payment status
    // This might involve making an API call to Mpesa to check the status
    // For now, we'll return a mock status
    const statuses = ["Success", "Failed", "Pending"];
    return statuses[Math.floor(Math.random() * 3)];
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { items, shippingInfo, total, paymentMethod, deliveryType } = req.body;
    try {
        // Check stock availability
        for (const item of items) {
            const productInStock = yield product_model_1.Product.findById(item.product);
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
        const newOrder = new order_model_1.Order({
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
                const mpesaResponse = yield initiateMpesaPayment(user.phone, total, newOrder._id);
                newOrder.mpesaRequestId = mpesaResponse.MerchantRequestID;
                newOrder.mpesaCheckoutRequestId = mpesaResponse.CheckoutRequestID;
                newOrder.status = 'pending_payment';
                yield newOrder.save();
            }
            catch (error) {
                console.error("Error initiating Mpesa payment:", error);
                return res.status(500).json({ message: "Error initiating Mpesa payment" });
            }
        }
        const savedOrder = yield newOrder.save();
        // Update product stock
        yield updateProductStock(savedOrder);
        // Update user orders
        user.orders = [...user.orders, savedOrder._id];
        yield user.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrder = createOrder;
const updateProductStock = (order) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of order.items) {
        const product = yield product_model_1.Product.findById(item.product);
        if (product) {
            const variant = product.variants.find((v) => v.color === item.color);
            if (variant) {
                const stockItem = variant.stock.find((s) => s.size === item.size);
                if (stockItem) {
                    stockItem.quantity -= item.quantity;
                    yield product.save();
                }
            }
        }
    }
});
const checkPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const order = yield order_model_1.Order.findById(orderId).populate('user');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === "pending_payment") {
            let paymentStatus;
            if (order.paymentMethod === "mpesa") {
                paymentStatus = yield checkMpesaPaymentStatus(order.mpesaCheckoutRequestId);
            }
            else if (order.paymentMethod === "mtn_ghana") {
                paymentStatus = yield (0, mtn_1.checkMtnGhanaPaymentStatus)(order.mtnGhanaTransactionId);
            }
            if (paymentStatus === "Success") {
                order.status = "completed";
                yield order.save();
                yield updateProductStock(order);
                // Emit order notification
                (0, notification_1.emitNotification)({
                    type: notification_1.NotificationTypes.ORDER,
                    title: 'New Order Received',
                    content: `New order #${order._id} received from ${order.user.username}`,
                    orderData: {
                        orderId: order._id,
                        customerName: order.user.username,
                        items: order.items,
                        totalAmount: order.total,
                        paymentMethod: order.paymentMethod,
                        status: order.status
                    }
                });
            }
            else if (paymentStatus === "Failed") {
                order.status = "cancelled";
                yield order.save();
            }
        }
        res.status(200).json({ status: order.status });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkPaymentStatus = checkPaymentStatus;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.Order.find({ user: req.user._id });
        orders.length === 0 ? res.status(404).json({ message: "You have no orders for now!" }) : res.status(200).json({ message: "Orders retrieved successfully", orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOrders = getOrders;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order updated successfully", order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateOrder = updateOrder;
const getOderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order retrieved successfully", order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOderById = getOderById;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully", order });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteOrder = deleteOrder;
