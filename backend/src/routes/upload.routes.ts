import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import requireAuth from '../middleware/requireAuth';
import upload from '../middleware/upload';

const router = Router();

function handleUpload(req: Request, res: Response, next: NextFunction) {
  upload.single('image')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    next();
  });
}

router.post('/', requireAuth, handleUpload, (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file provided' });
    return;
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;
