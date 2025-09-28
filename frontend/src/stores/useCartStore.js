import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { URL } from "../config";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  loading: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/api/coupon");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/api/coupon/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    try {
      const res = await axios.get("/api/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    try {
      await axios.delete("/api/cart");
    } catch (error) {
      console.log("cart error", error);
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  addToCart: async (product) => {
    set({ loading: true });
    try {
      await axios.post("/api/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      console.log("cart error", error);
      if (
        error instanceof AxiosError &&
        error.response.data.message.includes("unauthorized")
      ) {
        toast.error("Unauthorized");
      }
      toast.error("An error occurred");
    } finally {
      set({ loading: false });
    }
  },
  removeFromCart: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`${URL}/api/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      set({ loading: false });
    } catch (error) {
      console.log("cart error", error);
      toast.error(error.response.data.message || "An error occurred");
      set({ loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true });
    if (quantity === 0) {
      if (confirm("Are you sure you want to remove this item?")) {
        get().removeFromCart(productId);
      }
      set({ loading: false });
      return;
    }

    await axios.put(`${URL}/api/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
    set({ loading: false });
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
