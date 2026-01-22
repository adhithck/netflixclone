import multer from "multer";
import path from "path";
import fs from "fs";

const videosDir = path.join(process.cwd(), "uploads/videos");
const thumbsDir = path.join(process.cwd(), "uploads/thumbnails");

// ✅ Ensure folders exist
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

// ✅ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") cb(null, videosDir);
    else if (file.fieldname === "thumbnail") cb(null, thumbsDir);
    else cb(new Error("Invalid field name"), null);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname
      .replace(ext, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

// ✅ File filter (only mp4 + images)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (file.mimetype === "video/mp4") return cb(null, true);
    return cb(new Error("Only MP4 videos are allowed"), false);
  }

  if (file.fieldname === "thumbnail") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp"
    ) {
      return cb(null, true);
    }
    return cb(new Error("Only image files are allowed (png/jpg/jpeg/webp)"), false);
  }

  cb(new Error("Invalid file upload field"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB max (change if you want)
  },
});

export default upload;
