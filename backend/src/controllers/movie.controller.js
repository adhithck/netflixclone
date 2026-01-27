import Movie from "../models/Movie.model.js";

// ================= ADD MOVIE (UPLOAD) =================
export const addMovie = async (req, res) => {
  try {
    const { titles, descriptions, genres, years, durations } = req.body;

    const videos = req.files?.videos || [];
    const thumbs = req.files?.thumbnails || [];

    if (!videos.length || !thumbs.length) {
      return res.status(400).json({ message: "Files required" });
    }

    const movies = [];

    for (let i = 0; i < videos.length; i++) {
      movies.push({
        title: Array.isArray(titles) ? titles[i] : titles,
        description: descriptions?.[i] || "",
        genre: genres?.[i] || "Unknown",
        year: years?.[i] || new Date().getFullYear(),
        duration: durations?.[i] || "0 min",

        videoUrl: `uploads/videos/${videos[i].filename}`,
        thumbnailUrl: `uploads/thumbnails/${thumbs[i].filename}`,
      });
    }

    const created = await Movie.insertMany(movies);

    res.status(201).json({
      message: `${created.length} movies uploaded ✅`,
      movies: created,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET ALL =================
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

// ================= GET ONE =================
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SEARCH =================
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

// ================= UPDATE =================
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

// ================= DELETE =================
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
