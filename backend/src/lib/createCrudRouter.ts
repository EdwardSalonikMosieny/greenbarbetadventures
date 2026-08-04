import { Router } from 'express';
import type { Request, Response } from 'express';
import type { ZodType } from 'zod';
import requireAuth from '../middleware/requireAuth';
import validateBody from '../middleware/validate';
import asyncHandler from '../middleware/asyncHandler';

// Minimal shape every Prisma model delegate satisfies — enough for a flat CRUD resource
// with no relations (Destination, Activity, Experience). Tours has real relations
// (destination FK, gallery images, itinerary) and gets its own bespoke controller instead.
// `data: any` (not `unknown`) is deliberate: Prisma's generated per-model input types are
// each structurally distinct, and Zod has already validated the request body by the time
// it reaches here — this interface only needs to describe the shape loosely enough for
// every model delegate to satisfy it.
interface CrudDelegate<T> {
  findMany: (args?: { orderBy?: Record<string, 'asc' | 'desc'> }) => Promise<T[]>;
  findUnique: (args: { where: { id: string } }) => Promise<T | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (args: { data: any }) => Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (args: { where: { id: string }; data: any }) => Promise<T>;
  delete: (args: { where: { id: string } }) => Promise<T>;
}

interface CrudRouterOptions<T> {
  delegate: CrudDelegate<T>;
  createSchema: ZodType;
  updateSchema: ZodType;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

/** All routes require admin auth — these are internal management endpoints, not public reads. */
function createCrudRouter<T>({ delegate, createSchema, updateSchema, orderBy }: CrudRouterOptions<T>) {
  const router = Router();

  router.use(requireAuth);

  router.get(
    '/',
    asyncHandler(async (_req: Request, res: Response) => {
      const items = await delegate.findMany(orderBy ? { orderBy } : undefined);
      res.json(items);
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const item = await delegate.findUnique({ where: { id: req.params.id! } });
      if (!item) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(item);
    }),
  );

  router.post(
    '/',
    validateBody(createSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const item = await delegate.create({ data: req.body });
      res.status(201).json(item);
    }),
  );

  router.put(
    '/:id',
    validateBody(updateSchema),
    asyncHandler(async (req: Request, res: Response) => {
      const item = await delegate.update({ where: { id: req.params.id! }, data: req.body });
      res.json(item);
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      await delegate.delete({ where: { id: req.params.id! } });
      res.status(204).send();
    }),
  );

  return router;
}

export default createCrudRouter;
