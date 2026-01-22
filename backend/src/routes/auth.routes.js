import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/auth.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getProfile);

export default router;
