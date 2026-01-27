import multer from "multer";
import path from "path";
import fs from "fs";

const videosDir = path.join(process.cwd(), "uploads/videos");
const thumbsDir = path.join(process.cwd(), "uploads/thumbnails");

if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") cb(null, videosDir);
    else if (file.fieldname === "thumbnail") cb(null, thumbsDir);
    else cb(new Error("Invalid field"), null);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, "").replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video" && file.mimetype === "video/mp4")
    return cb(null, true);

  if (
    file.fieldname === "thumbnail" &&
    ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.mimetype)
  )
    return cb(null, true);

  cb(new Error("Invalid file type"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 500 },
});

export default upload;
