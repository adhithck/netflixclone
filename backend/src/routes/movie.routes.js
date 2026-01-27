import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  searchMovies,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";

import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = express.Router();

// ================= PUBLIC =================

// Get all movies
router.get("/", getAllMovies);

// Search
router.get("/search", searchMovies);

// Get single movie
router.get("/:id", getMovieById);

// ================= ADMIN =================

// Add movie
router.post("/", protect, adminOnly, addMovie);

// Update movie
router.put("/:id", protect, adminOnly, updateMovie);

// Delete movie
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
