import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateToken = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent xsrf cross site scripting  attacks
    secure: process.env.NODE_ENV === "production", //only send cookies over https
    sameSite: "strict", //prevent csrf attacks
    maxAge: 15 * 60 * 1000, // expired 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //only send cookies over https
    sameSite: "strict", //prevent csrf attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // expired 7 days
  });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateToken(newUser._id);

    await storeRefreshToken(newUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
    return res.status(401).json({ message: "Invalid user credentials" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    await redis.del(`refresh_token:${decoded.userID}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// this will refresh the access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    console.log("storedToken", storedToken);
    console.log("refreshToken", refreshToken);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
