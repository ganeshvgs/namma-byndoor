import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import heroVideoRoutes from "./routes/heroVideoRoutes.js";
// Load Environment Variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/* ===========================
   Middleware
=========================== */

// Security Headers
app.use(helmet());

// Allow Frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://nammabyndoor.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Logger
app.use(morgan("dev"));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

/* ===========================
   Routes
=========================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Namma Byndoor Backend Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/hero-videos", heroVideoRoutes);
/* ===========================
   404 Handler
=========================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* ===========================
   Global Error Handler
=========================== */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ===========================
   Start Server
=========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("======================================");
});