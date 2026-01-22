import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import streamRoutes from "./routes/stream.routes.js";

import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import uploadRoutes from "./routes/upload.routes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve thumbnails as static files
// So frontend can load: http://localhost:5000/uploads/thumbnails/xyz.jpg
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/upload", uploadRoutes);


// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
