import multer from 'multer';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const upload = multer({
  // Keep the untrusted bytes out of the public uploads directory. The route
  // decodes and re-encodes them before writing a server-named .webp file.
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, WEBP, or AVIF images are allowed'));
      return;
    }
    cb(null, true);
  },
});

export default upload;
