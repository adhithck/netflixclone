import Movie from "../models/Movie.model.js";

// ✅ Upload Movie (video + thumbnail + details)
export const uploadMovie = async (req, res) => {
  try {
    const { title, description, genre, year, duration, isPremium } = req.body;

    // multer files
    const videoFile = req.files?.video?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    if (!videoFile) {
      return res.status(400).json({ message: "video file is required (mp4)" });
    }

    if (!thumbFile) {
      return res.status(400).json({ message: "thumbnail image is required" });
    }

    // ✅ Save relative paths
    const videoUrl = `uploads/videos/${videoFile.filename}`;
    const thumbnailUrl = `uploads/thumbnails/${thumbFile.filename}`;

    const movie = await Movie.create({
      title,
      description,
      genre,
      year,
      duration,
      isPremium: isPremium === "true" || isPremium === true,
      videoUrl,
      thumbnailUrl,
    });

    return res.status(201).json({
      message: "Movie uploaded ✅",
      movie,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
