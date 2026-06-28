const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const uploadDir = path.join(__dirname, '../../', config.upload.dest);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const imageAllowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  // Allow videos for the `animation` field (mp4, webm) and gifs as images
  if (file.fieldname === 'animation') {
    const videoAllowed = /\.mp4$|\.webm$|\.gif$/;
    const isVideoExt = videoAllowed.test(ext);
    const isVideoMime = file.mimetype.startsWith('video/') || file.mimetype === 'image/gif';
    if (isVideoExt && isVideoMime) return cb(null, true);
    return cb(new Error('Only animation files (mp4, webm, gif) are allowed for animation field'));
  }

  const isImageExt = imageAllowed.test(ext);
  const isImageMime = imageAllowed.test(file.mimetype);
  if (isImageExt && isImageMime) return cb(null, true);
  cb(new Error('Only image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxSize },
});

module.exports = upload;
