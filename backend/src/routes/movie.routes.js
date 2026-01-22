import express from "express";
import {
  addMovie,
  getAllMovies,
  getMovieById,
  searchMovies,
} from "../controllers/movie.controller.js";

import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

// Admin
router.post("/", protect, adminOnly, addMovie);

export default router;
