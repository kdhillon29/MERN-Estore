import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development"
      ? "http://localhost:5000/api"
      : "https://mern-estore-backend.vercel.app",
  withCredentials: true, // send cookies to the server
});

export default axiosInstance;
