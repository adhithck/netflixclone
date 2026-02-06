import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    // ⭐ Premium flag (manual)
    isPremium: {
      type: Boolean,
      default: false,
    },

    // ⭐ Premium expiry
    premiumUntil: {
      type: Date,
      default: null,
    },

    // ✅ Favorites (My List)
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
