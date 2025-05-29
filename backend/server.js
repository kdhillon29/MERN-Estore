import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Ecommerce Store API" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
