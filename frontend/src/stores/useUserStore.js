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
      const { data } = await axios.post("/auth/login", { email, password });
      console.log("res is ", data);
      set({ user: data.user, loading: false });
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
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
