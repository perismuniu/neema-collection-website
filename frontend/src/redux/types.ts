export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    colors: string[];
    image: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CartItem {
    productId: string;
    buyingQuantity: number;
    buyingItemTotalPrice: number;
    product: Product;
    _id: string;
  }
  
  export interface UserCart {
    items: CartItem[];
    totalQuantity: number;
    buyingTotalPrice: number;
    user: string | null;
  }
  
  export interface Order {
    _id: string;
    user: string;
    items: CartItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Insight {
    _id: string;
    type: string;
    value: number;
    timestamp: string;
  }
  
  export interface PaymentInitiation {
    amount: number;
    phoneNumber: string;
  }
  