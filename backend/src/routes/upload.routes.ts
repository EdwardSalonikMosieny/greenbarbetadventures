import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import multer from 'multer';
import requireAuth from '../middleware/requireAuth';
import upload from '../middleware/upload';
import asyncHandler from '../middleware/asyncHandler';
import { processImageUpload } from '../lib/processImageUpload';

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

router.post(
  '/',
  requireAuth,
  handleUpload,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    let image;
    try {
      image = await processImageUpload(req.file.buffer);
    } catch {
      res.status(400).json({ error: 'Only valid JPEG, PNG, WEBP, or AVIF images are allowed' });
      return;
    }

    const uploadsDirectory = path.join(__dirname, '../../uploads');
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(path.join(uploadsDirectory, image.filename), image.data, { flag: 'wx' });
    res.status(201).json({ url: `/uploads/${image.filename}` });
  }),
);

export default router;
