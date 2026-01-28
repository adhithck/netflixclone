import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import streamRoutes from "./routes/stream.routes.js";

import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ✅ VERY IMPORTANT — serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.json({
    message: "Netflix Clone Backend Running ✅",
  });
});

// ================= HEALTH =================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    time: new Date().toISOString(),
  });
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/stream", streamRoutes);

// ================= ERRORS =================
app.use(notFound);
app.use(errorHandler);

export default app;
