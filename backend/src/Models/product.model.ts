import mongoose, { Schema, Document } from "mongoose";


interface StockItem {
  size: string;
  quantity: number;
}
// Product Interface
export interface IProduct extends Document {
  price: number;
  title: string;
  description: string;
  images: string[];
  variants: {
    color: string;
    stock: {
      size: string;
      quantity: number;
    }[];
  }[];
  category: string;
  discount: number;
  active: boolean;
  rating: number;
  reviews: {
    rating: number;
    review: string;
    username: string;
  }[];
  // stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
export const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      match: /^[0-9]*$/,
    },
    active: {
      type: Boolean,
      require: true,
      default: true
    },
    images: [
      {
        type: String,
        required: false,
        match:
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      },
    ],
    category: {
      type: String,
      required: false,
    },
    variants: [
      {
        color: { type: String, required: true },
        stock: [{
          size: {
            type: String,
            required: true,
            enum: ["XS", "S", "X" , "M", "L", "XL", "XXL", "XXXL"],
          },
          quantity: {
            type: Number,
            required: true,
            match: /^[0-9]*$/,
          },
        }],
      },
    ],
    discount: { type: Number, required: false },
    rating: { type: Number, required: false },
    reviews: [
      {
        rating: { type: Number, required: false },
        review: { type: String, required: false },
        username: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

// ProductSchema.virtual("stock").get(function () {
//   return this.colors.reduce((acc, color) => acc + color.stock.quantity, 0);
// });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);