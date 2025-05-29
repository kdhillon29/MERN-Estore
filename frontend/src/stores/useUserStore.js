import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  signup: async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      set({ loading: true });
      const { data } = await axios.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      set({ user: data.user });
      toast.success("Signup successful");
    } catch (error) {
      console.log("error", error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Server error!Something went wrong");
      }
    } finally {
      set({ loading: false });
    }
  },
}));
