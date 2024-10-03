import mongoose, { Schema, Document } from "mongoose";
import { UserSchema } from "./user.model";
import { ProductSchema } from "./product.model";

export interface IOrder extends Document {
  user: typeof UserSchema;
  items: [
    {
      product: typeof ProductSchema;
      quantity: number;
      color: string;
      size: string;
      itemTotalPrice: number;
    }
  ];
  status: string;
  paymentMethod: string;
  deliveryType: string;
  total: number;
  shippingInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  mpesaRequestId?: string;
  paymentDetails?: any;
  mtnGhanaTransactionId?: string
  mpesaCheckoutRequestId?: string;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      itemTotalPrice: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'pending_payment', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, required: true, enum: ["mpesa", "payment on delivery"], default: "mpesa" },
  deliveryType: { type: String, enum: ["Shop pick-up", "Home delivery"], default: "Shop pick-up", required: true },
  total: { type: Number, required: true },
  shippingInfo: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
  },
  mpesaRequestId: { type: String },
  paymentDetails: { type: Schema.Types.Mixed },
  mtnGhanaTransactionId: {type:String},
  mpesaCheckoutRequestId: { type: String },
}, { timestamps: true });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);