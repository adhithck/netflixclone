import multer from "multer";
import path from "path";
import fs from "fs";

const videosDir = path.join(process.cwd(), "uploads/videos");
const thumbsDir = path.join(process.cwd(), "uploads/thumbnails");

// Create folders
fs.mkdirSync(videosDir, { recursive: true });
fs.mkdirSync(thumbsDir, { recursive: true });

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") return cb(null, videosDir);
    if (file.fieldname === "thumbnail") return cb(null, thumbsDir);

    cb(new Error("Invalid field"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ================= FILTER =================
const fileFilter = (req, file, cb) => {
  // ✅ ACCEPT ANY VIDEO FORMAT
  if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) return cb(null, true);
    return cb(new Error("Video file required"));
  }

  // ✅ Thumbnail images
  if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Image file required"));
  }

  cb(new Error("Invalid file"));
};

// ================= EXPORT =================
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2000 }, // 2GB
});

export default upload;
