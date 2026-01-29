import express from "express";
import User from "../models/User.model.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// ================= GET FAVORITES =================
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  res.json(user.favorites || []);
});

// ================= TOGGLE FAVORITE =================
router.post("/:movieId", auth, async (req, res) => {
  const { movieId } = req.params;

  const user = await User.findById(req.user.id);

  if (!user.favorites) user.favorites = [];

  const exists = user.favorites.includes(movieId);

  if (exists) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== movieId
    );
  } else {
    user.favorites.push(movieId);
  }

  await user.save();

  const updated = await User.findById(req.user.id).populate("favorites");

  res.json(updated.favorites);
});

export default router;
