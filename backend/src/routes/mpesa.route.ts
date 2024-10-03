import express, { Request, Response } from 'express';
import { mpesaStkPush } from '../utils/mpesaAuth';
import getOAuthToken from '../utils/mpesaAuth';
import { Order } from '../Models/order.model';

export const initMpesaRoutes = (app: express.Application) => {
  app.post('/api/mpesa/stkpush', async (req, res) => {
    try {
      const { amount, phone } = req.body;
      const token = await getOAuthToken();
      const response = await mpesaStkPush(amount, token);
      res.json(response);
    } catch (error) {
      console.error('Error in STK push:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/callback', async (req: Request, res: Response) => {
    try {
      const { Body } = req.body;
  
      if (!Body || !Body.stkCallback) {
        return res.status(400).json({ message: 'Invalid callback data' });
      }
  
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;
  
      // Find the order associated with this payment
      const order = await Order.findOne({ mpesaRequestId: MerchantRequestID });
  
      if (!order) {
        console.error(`Order not found for MerchantRequestID: ${MerchantRequestID}`);
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Update the order status based on the callback result
      if (ResultCode === 0) {
        // Payment was successful
        order.status = 'paid';
      } else {
        // Payment failed
        order.status = 'payment_failed';
      }
  
      // Save the full callback details
      order.paymentDetails = Body.stkCallback;
  
      await order.save();
  
      // Log the callback for debugging purposes
      console.log('M-Pesa Callback received:', JSON.stringify(Body, null, 2));
  
      // Respond to Safaricom
      res.status(200).json({ message: 'Callback processed successfully' });
    } catch (error) {
      console.error('Error processing M-Pesa callback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })
};

