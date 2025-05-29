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
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      console.log("res is ", res);
      set({ user: res.data, loading: false });
      toast.success("Login successful");
    } catch (error) {
      set({ loading: false });
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Server error!Something went wrong");
      }
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },
}));
