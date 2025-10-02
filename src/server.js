import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./db.js";
import roleRoutes from "./routes/role.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  // Duplicate key error (unique)
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate key", detail: err.keyValue });
  }
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

if (!URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

connectDB(URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));
});
