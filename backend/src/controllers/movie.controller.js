import Movie from "../models/Movie.model.js";

// ✅ Admin: Add movie
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
      videoUrl,
      thumbnailUrl,
    });

    res.status(201).json({
      message: "Movie added ✅",
      movie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.json({
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get movie by id
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Search movies
export const searchMovies = async (req, res) => {
  try {
    const q = req.query.q || "";

    const movies = await Movie.find({
      title: { $regex: q, $options: "i" },
    });

    res.json({
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Update movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    Object.assign(movie, req.body);
    await movie.save();

    res.json({
      message: "Movie updated ✅",
      movie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await movie.deleteOne();

    res.json({ message: "Movie deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
