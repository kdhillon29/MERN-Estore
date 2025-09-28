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
import path from "path";
import process from "node:process";
dotenv.config();
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
//middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Cors setup to allow requests in production from the client
app.use(
  cors({
    origin: "https://mern-estore-henna.vercel.app",

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "/dist")));

  //express5 syntax
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the Ecommerce Store API" });
// });

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

export default app;
