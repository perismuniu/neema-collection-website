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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMpesaRoutes = void 0;
const mpesaAuth_1 = require("../utils/mpesaAuth");
const mpesaAuth_2 = __importDefault(require("../utils/mpesaAuth"));
const order_model_1 = require("../Models/order.model");
const initMpesaRoutes = (app) => {
    app.post('/api/mpesa/stkpush', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { amount, phone } = req.body;
            const token = yield (0, mpesaAuth_2.default)();
            const response = yield (0, mpesaAuth_1.mpesaStkPush)(amount, token);
            res.json(response);
        }
        catch (error) {
            console.error('Error in STK push:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }));
    app.post('/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Body } = req.body;
            if (!Body || !Body.stkCallback) {
                return res.status(400).json({ message: 'Invalid callback data' });
            }
            const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
            // Find the order associated with this payment
            const order = yield order_model_1.Order.findOne({ mpesaRequestId: MerchantRequestID });
            if (!order) {
                console.error(`Order not found for MerchantRequestID: ${MerchantRequestID}`);
                return res.status(404).json({ message: 'Order not found' });
            }
            // Update the order status based on the callback result
            if (ResultCode === 0) {
                // Payment was successful
                order.status = 'paid';
            }
            else {
                // Payment failed
                order.status = 'payment_failed';
            }
            // Save the full callback details
            order.paymentDetails = Body.stkCallback;
            yield order.save();
            // Log the callback for debugging purposes
            console.log('M-Pesa Callback received:', JSON.stringify(Body, null, 2));
            // Respond to Safaricom
            res.status(200).json({ message: 'Callback processed successfully' });
        }
        catch (error) {
            console.error('Error processing M-Pesa callback:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }));
};
exports.initMpesaRoutes = initMpesaRoutes;
