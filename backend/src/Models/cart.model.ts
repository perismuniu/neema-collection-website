
import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  color: string;
  size: string;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const CartSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
