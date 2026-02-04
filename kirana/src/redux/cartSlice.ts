import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  quantity: number;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  finalTotal: 40,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find((i) => i._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      cartSlice.caseReducers.calculateTotal(state);
    },

    decreaceQty: (state, action: PayloadAction<string>) => {
      const item = state.cartData.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      }
      cartSlice.caseReducers.calculateTotal(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartData = state.cartData.filter((i) => i._id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },

    calculateTotal: (state) => {
      state.subTotal = state.cartData.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      state.deliveryFee = state.subTotal > 200 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliveryFee;
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaceQty,
  removeFromCart,
  calculateTotal,
} = cartSlice.actions;

export default cartSlice.reducer;
