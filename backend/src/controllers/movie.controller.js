import Movie from "../models/Movie.model.js";

// ✅ Admin: Add movie metadata (manual method)
export const addMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      year,
      duration,
      isPremium,
      videoUrl,
      thumbnailUrl,
    } = req.body;

    if (!title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        message: "title, videoUrl, thumbnailUrl are required",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      year,
      duration,
      isPremium: isPremium || false,
      videoUrl, // ✅ local path (uploads/videos/xxx.mp4)
      thumbnailUrl, // ✅ local path (uploads/thumbnails/xxx.jpg)
    });

    return res.status(201).json({
      message: "Movie added ✅",
      movie,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    return res.status(200).json({
      count: movies.length,
      movies,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get movie by id
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    return res.status(200).json(movie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Search movies
export const searchMovies = async (req, res) => {
  try {
    const q = req.query.q || "";

    const movies = await Movie.find({
      title: { $regex: q, $options: "i" },
    }).limit(20);

    return res.status(200).json({
      count: movies.length,
      movies,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
