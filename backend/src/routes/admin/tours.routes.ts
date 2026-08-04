import { Router } from 'express';
import requireAuth from '../../middleware/requireAuth';
import validateBody from '../../middleware/validate';
import asyncHandler from '../../middleware/asyncHandler';
import { create, getOne, list, remove, tourSchema, update } from '../../controllers/admin/tours.controller';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(getOne));
router.post('/', validateBody(tourSchema), asyncHandler(create));
router.put('/:id', validateBody(tourSchema), asyncHandler(update));
router.delete('/:id', asyncHandler(remove));

export default router;
