export interface IProduct extends Document {
    _id: string
    price: number;
    title: string;
    description: string;
    images: string[];
    colors: {
      color: string;
      stock: {
        size: string;
        quantity: number;
        color: string
      };
    }[];
    category: string;
    discount: number;
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