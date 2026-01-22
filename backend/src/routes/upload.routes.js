import express from "express";
import upload from "../middlewares/upload.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

import { uploadMovie } from "../controllers/upload.controller.js";

const router = express.Router();

// Admin Upload Route
// Fields must be EXACT names: "video", "thumbnail"
router.post(
  "/movie",
  protect,
  adminOnly,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadMovie
);

export default router;
