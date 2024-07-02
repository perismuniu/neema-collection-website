import mongoose, { Schema, Document } from "mongoose";
import { UserSchema } from "./user.model";
import { ProductSchema } from "./product.model";

export interface IOrder extends Document {
  user: typeof UserSchema;
  items:[
    {
      product: typeof ProductSchema;
      quantity: number;
      itemTotalPrice: number;
    }
  ]
  status: string;
  paymentMethod: string;
  deliveryType: string;
  total: number;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      itemTotalPrice: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled' ],
    default: 'pending'
  } ,
  paymentMethod: { type: String, required: true, enum: ["payment on delivery", "wallet"], default: "wallet" },
  deliveryType: {type: String, enum: ["Shop pick-up", "Home delivery"], default: "Home delivery", require: true},
  total: { type: Number, required: true },
}, { timestamps: true });

// total is the sum of all itemTotalPrices
OrderSchema.virtual("total").get( function (this:any) {
  return (this.items ?? []).reduce((total: any, item:any) => total + item.itemTotalPrice, 0);
});

export const order = mongoose.model<IOrder>("Order", OrderSchema);