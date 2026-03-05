import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Route imports
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import { documentRouter } from "./modules/employees/employee.document";
import serviceRecordRoutes from "./modules/service-records/service-record.routes";
import beneficiaryRoutes from "./modules/peso/beneficiary.routes";
import programRoutes from "./modules/peso/program.routes";

const app = express();

// ─── GLOBAL MIDDLEWARE ──────────────────────────────

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// Login rate limiting (stricter)
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5, // 5 login attempts per minute
  message: { message: "Too many login attempts, please try again later." },
});
app.use("/api/v1/auth/login", loginLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ─── API ROUTES ─────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "LGUIS API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/employees", employeeRoutes);
// global document endpoints (download, etc.)
app.use("/api/v1", documentRouter);
app.use("/api/v1/service-records", serviceRecordRoutes);
app.use("/api/v1/peso/beneficiaries", beneficiaryRoutes);
app.use("/api/v1/peso", programRoutes);

// ─── ERROR HANDLING ─────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
