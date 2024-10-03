import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  type: 'order' | 'whatsapp_contact' | 'email_contact';
  title: string;
  content: string;
  read: boolean;
  soundType: 'order' | 'message' | 'reminder';
  orderData?: {
    orderId: string;
    customerName: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
    status: string;
  };
  contactData?: {
    name: string;
    email?: string;
    phoneNumber?: string;
    message: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema({
  type: { 
    type: String, 
    enum: ['order', 'whatsapp_contact', 'email_contact'],
    required: true 
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  soundType: {
    type: String,
    enum: ['order', 'message', 'reminder'],
    required: true
  },
  orderData: {
    orderId: String,
    customerName: String,
    items: [{
      productId: String,
      productName: String,
      quantity: Number,
      price: Number
    }],
    totalAmount: Number,
    paymentMethod: String,
    status: String
  },
  contactData: {
    name: String,
    email: String,
    phoneNumber: String,
    message: String
  }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);