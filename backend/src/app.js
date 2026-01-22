import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import streamRoutes from "./routes/stream.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files (thumbnails + videos if needed)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Netflix Clone Backend Running ✅",
    status: "OK",
  });
});

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK ✅",
    message: "Server is healthy",
    time: new Date().toISOString(),
  });
});

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/upload", uploadRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
