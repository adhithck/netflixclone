const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie.model.js");

exports.streamMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // movie.videoUrl = "uploads/videos/abc.mp4"
    const videoPath = path.join(__dirname, "..", "..", movie.videoUrl);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: "Video file not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      return res.status(400).send("Requires Range header");
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

    const contentLength = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    });

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
