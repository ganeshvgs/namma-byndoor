import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * POST /api/auth/login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { username, password, turnstileToken } = req.body;

    // Validate request fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    if (!turnstileToken) {
      return res.status(400).json({
        success: false,
        message: "Security verification is required.",
      });
    }

    // Validate Turnstile Token
    const turnstileSecret = process.env.TURNSTILE_SECRET;
    
    if (!turnstileSecret) {
      console.error("TURNSTILE_SECRET is not configured on the server.");
      return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }

    const formData = new URLSearchParams();
    formData.append("secret", turnstileSecret);
    formData.append("response", turnstileToken);
    
    // Express 'trust proxy' is on, req.ip will reflect the real client IP behind Vercel/proxies
    if (req.ip) {
      formData.append("remoteip", req.ip);
    }

    // Call Cloudflare Siteverify
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const verifyData = await verifyRes.json();

    // Require result.success === true (Fail closed)
    if (!verifyData.success) {
      return res.status(400).json({
        success: false,
        message: "Security verification failed. Please try again.",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Compare password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Generate JWT
    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

/**
 * GET /api/auth/me
 * Protected Route
 */
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};