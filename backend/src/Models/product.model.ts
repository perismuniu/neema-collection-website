import mongoose, { Schema } from "mongoose";

// Product Interface
export interface IProduct {
  price: number;
  _id: mongoose.Schema.Types.ObjectId;
  title: String;
  description: String;
  image: String;
  colors: [
    {
      color: String;
      stock:
        {
          size: String;
          quantity: number;
        }
      ;
    }
  ];
  category: string;
  discount: number;
  rating: number;
  reviews: [
    {
      rating: number;
      review: String;
      username: String;
    }
  ];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// product schema
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
      format: /^[0-9]*$/,
    },
    image: [
      {
        type: String,
        required: false,
        match:
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    colors: [
      {
        color: String,
        stock:
          {
            size: {
              type: String,
              required: true,
              enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
            },
            quantity: {
              type: Number,
              required: true,
              match: /^[0-9]*$/,
            },
          },
      },
    ],
  },
  { timestamps: true }
);


export const Product = mongoose.model<IProduct>("product", ProductSchema);

ProductSchema.virtual("stock").get(function() {
  return this.colors.reduce((acc, color) => acc + color.stock.quantity, 0);
});