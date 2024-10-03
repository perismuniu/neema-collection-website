import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

// Product Slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
      state.loading = false;
      state.error = null;
    },
    setProductLoading: (state) => {
      state.loading = true;
    },
    setProductError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});


  
  interface CartItem {
    _id: string;
    title: string;
    price: number;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
    image: string;
  }
  
  interface CartState {
    items: CartItem[];
  }
  
  interface RemoveFromCartPayload {
    id: string;
    color: string;
    size: string;
  }
  
  interface UpdateQuantityPayload {
    id: string;
    color: string;
    size: string;
    quantity: number;
  }
  
  const cartSlice = createSlice({
    name: 'cart',
    initialState: {
      items: [],
    } as CartState,
    reducers: {
      addToCart: (state, action: PayloadAction<CartItem>) => {
        const newItem = action.payload;
        const existingItemIndex = state.items.findIndex(item => 
          item._id === newItem._id && 
          item.selectedColor === newItem.selectedColor && 
          item.selectedSize === newItem.selectedSize
        );
  
        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      },
      removeFromCart: (state, action: PayloadAction<RemoveFromCartPayload>) => {
        const { id, color, size } = action.payload;
        state.items = state.items.filter(item => 
          !(item._id === id && 
            item.selectedColor === color && 
            item.selectedSize === size)
        );
      },
      updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
        const { id, color, size, quantity } = action.payload;
        const item = state.items.find(item => 
          item._id === id && 
          item.selectedColor === color && 
          item.selectedSize === size
        );
        if (item) {
          item.quantity = quantity;
        }
      },
      clearCart: (state) => {
        state.items = [];
      },
    },
  });
// Search Slice
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

interface User {
  username?: string;
  phone?: string;
  email?: string;
  address?: string;
  wallet?: number;
  deliveryType?: string;
  isAdmin?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
  } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const {
  setCredentials,
  setUser,
  updateProfile,
  logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;


// Export actions
export const { setCurrentProduct, setProductLoading, setProductError } = productSlice.actions;
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const { setSearchQuery } = searchSlice.actions;
// Export reducers
export const productReducer = productSlice.reducer;
export const cartReducer = cartSlice.reducer;
export const searchReducer = searchSlice.reducer;
