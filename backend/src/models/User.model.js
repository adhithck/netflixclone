import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
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

    /* ================= PREMIUM SYSTEM ================= */

    // ⭐ Paid premium flag
    isPremium: {
      type: Boolean,
      default: false,
    },

    // ⭐ Premium expiry date
    premiumUntil: {
      type: Date,
      default: null,
    },

    // ⭐ Trial expiry (7 days)
    trialUntil: {
      type: Date,
      default: null,
    },

    // ⭐ Source of premium
    premiumSource: {
      type: String,
      enum: ["trial", "razorpay", null],
      default: null,
    },

    // ⭐ When premium activated
    premiumActivatedAt: {
      type: Date,
      default: null,
    },

    /* ================= ANALYTICS ================= */

    premiumAnalytics: {
      totalWatchTime: {
        type: Number,
        default: 0, // seconds
      },

      lastWatchedAt: {
        type: Date,
        default: null,
      },

      totalMoviesWatched: {
        type: Number,
        default: 0,
      },
    },

    /* ================= MY LIST ================= */
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

/* ================= VIRTUAL ================= */
// ⭐ Single source of truth for premium access
userSchema.virtual("hasPremium").get(function () {
  const now = new Date();

  if (this.premiumUntil && this.premiumUntil > now) return true;
  if (this.trialUntil && this.trialUntil > now) return true;

  return false;
});

/* ================= MODEL SAFE EXPORT ================= */
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
