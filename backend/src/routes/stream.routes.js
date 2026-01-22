import express from "express";
import { streamMovie } from "../controllers/stream.controller.js";

const router = express.Router();

router.get("/:movieId", streamMovie);

export default router;
