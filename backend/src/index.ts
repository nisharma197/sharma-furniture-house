import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl) or any localhost origin
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback for dev mode
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// General API rate limiter
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ success: true, message: "Sharma Furniture House API is running" }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sharma Furniture House API listening on port ${PORT}`);
});
