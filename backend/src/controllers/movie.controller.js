import Movie from "../models/Movie.model.js";

// ================= ADD MOVIE =================
export const addMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      year,
      duration,

      // ⭐ PREMIUM / PREMIERE
      premiumOnly,
      isPremiere,
      premiereAt,
      premiereUntil,
    } = req.body;

    // files from multer
    const video = req.files?.video?.[0];
    const thumbnail = req.files?.thumbnail?.[0];

    if (!title || !video || !thumbnail) {
      return res.status(400).json({
        message: "Title, video and thumbnail required",
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre: genre || "Unknown",
      year: year || new Date().getFullYear(),
      duration: duration || "0 min",

      // ⭐ PREMIUM / PREMIERE FLAGS
      premiumOnly: premiumOnly === "true" || premiumOnly === true,
      isPremiere: isPremiere === "true" || isPremiere === true,
      premiereAt: premiereAt || null,
      premiereUntil: premiereUntil || null,

      videoUrl: `uploads/videos/${video.filename}`,
      thumbnailUrl: `uploads/thumbnails/${thumbnail.filename}`,
    });

    res.status(201).json({
      message: "Movie uploaded ✅",
      movie,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL MOVIES =================
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ONE MOVIE =================
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // 🔒 BLOCK NON-PREMIUM USERS
    if (movie.premiumOnly && !req.user?.isPremium) {
      return res.status(403).json({
        message: "Premium members only 🔒",
      });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SEARCH MOVIES =================
export const searchMovies = async (req, res) => {
  try {
    const q = req.query.q || "";
    const movies = await Movie.find({
      title: { $regex: q, $options: "i" },
    });

    res.json({ count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE MOVIE =================
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // allow updating premium / premiere fields
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

// ================= DELETE MOVIE =================
export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
