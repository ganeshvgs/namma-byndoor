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
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";

import { connectCloudinary } from "./config/cloudinary.js";

/* =========================================================
   ENVIRONMENT
========================================================= */

dotenv.config();

/* =========================================================
   SERVICES
========================================================= */

connectCloudinary();

const app = express();

/* =========================================================
   PROXY
========================================================= */

/*
  Vercel / reverse proxy support.

  Required so express-rate-limit can identify the real
  client IP correctly behind the proxy.
*/
app.set("trust proxy", 1);

/* =========================================================
   SECURITY
========================================================= */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://byndoor.kundapura.in",
  "https://www.byndoor.kundapura.in",
  "https://nammabyndoor.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      /*
        Allow requests without Origin:
        Postman, server-to-server, health checks, etc.
      */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================================================
   BASIC MIDDLEWARE
========================================================= */

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

/* =========================================================
   RATE LIMITING
========================================================= */

/*
  PUBLIC READ LIMITER

  Applies only to GET / HEAD.

  Public pages naturally make several requests and should
  not share the old tiny 100-request limit.
*/

const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit:
    process.env.NODE_ENV === "production"
      ? 1500
      : 10000,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  skip: (req) => {
    return !["GET", "HEAD"].includes(req.method);
  },

  message: {
    success: false,
    message:
      "Too many requests. Please wait a moment and try again.",
  },
});

/*
  WRITE LIMITER

  POST / PUT / PATCH / DELETE remain more restricted.
*/

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit:
    process.env.NODE_ENV === "production"
      ? 200
      : 2000,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  skip: (req) => {
    return [
      "GET",
      "HEAD",
      "OPTIONS",
    ].includes(req.method);
  },

  message: {
    success: false,
    message:
      "Too many update requests. Please wait and try again.",
  },
});

/*
  LOGIN LIMITER

  Keep login much stricter than normal API traffic.
*/

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit:
    process.env.NODE_ENV === "production"
      ? 20
      : 500,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    success: false,
    message:
      "Too many login attempts. Please wait and try again.",
  },
});

/*
  Apply generic API protection.
*/

app.use(
  "/api",
  publicReadLimiter
);

app.use(
  "/api",
  writeLimiter
);

/*
  Only LOGIN gets the strict auth limiter.

  /api/auth/me is a normal authenticated GET and doesn't
  need to share the login-attempt bucket.
*/

app.use(
  "/api/auth/login",
  loginLimiter
);

/* =========================================================
   DATABASE
========================================================= */

/*
  Your connectDB() already caches the Mongoose connection.

  Calling it here does NOT create a new connection on every
  request once the serverless instance is warm.
*/

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   HEALTH ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Namma Byndoor Backend Running 🚀",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/places",
  placeRoutes
);

app.use(
  "/api/hero-videos",
  heroVideoRoutes
);

/* =========================================================
   404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error(
    "Global Error:",
    err?.stack || err
  );

  /*
    CORS errors.
  */

  if (
    err?.message === "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message: "Origin is not allowed.",
    });
  }

  /*
    Multer file-size errors, etc. can still be handled
    by their own middleware if you have one.
  */

  return res.status(
    err?.status || 500
  ).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err?.message ||
          "Internal Server Error",
  });
});

/* =========================================================
   LOCAL SERVER
========================================================= */

if (process.env.NODE_ENV !== "production") {
  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      "======================================"
    );

    console.log(
      `🚀 Server Running on Port ${PORT}`
    );

    console.log(
      `🌐 http://localhost:${PORT}`
    );

    console.log(
      "======================================"
    );
  });
}

/* =========================================================
   VERCEL EXPORT
========================================================= */

export default app;