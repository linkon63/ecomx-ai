import { create } from "zustand";
import { DataClient } from "@/context/dataContext";

type CartItem = {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  options: Record<string, string>;
  image: string;
};

type Cart = {
  lineItems: CartItem[];
};

type CartState = {
  cart: Cart;
  isLoading: boolean;
  counter: number;
  getCart: (dataClient: DataClient) => void;
  addItem: (
    dataClient: DataClient,
    productId: string,
    quantity: number,
    options: Record<string, string>
  ) => void;
  removeItem: (dataClient: DataClient, itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: { lineItems: [] },
  isLoading: false,
  counter: 0,
  getCart: async (dataClient) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const cart = dataClient.getCart();
      set({
        cart: cart || { lineItems: [] },
        isLoading: false,
        counter: cart?.lineItems?.length || 0,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  addItem: async (dataClient, productId, quantity, options) => {
    set((state) => ({ ...state, isLoading: true }));
    
    dataClient.addToCart(productId, quantity, options);
    const updatedCart = dataClient.getCart();

    set({
      cart: updatedCart,
      counter: updatedCart?.lineItems?.length || 0,
      isLoading: false,
    });
  },
  removeItem: async (dataClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    
    dataClient.removeFromCart(itemId);
    const updatedCart = dataClient.getCart();

    set({
      cart: updatedCart,
      counter: updatedCart?.lineItems?.length || 0,
      isLoading: false,
    });
  },
}));
