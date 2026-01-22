import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      required: true,
      // Example: "uploads/thumbnails/abc.jpg"
    },

    videoUrl: {
      type: String,
      required: true,
      // Example: "uploads/videos/abc.mp4"
    },

    genre: {
      type: String,
      default: "Unknown",
    },

    year: {
      type: Number,
      default: new Date().getFullYear(),
    },

    duration: {
      type: String,
      default: "0 min",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
