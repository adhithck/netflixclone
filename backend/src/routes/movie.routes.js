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
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

// ✅ Admin Upload (FILES + BODY)
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  addMovie
);

// Admin update
router.put("/:id", protect, adminOnly, updateMovie);

// Admin delete
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
