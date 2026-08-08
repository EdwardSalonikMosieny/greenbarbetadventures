import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});

interface NewsletterSubscriberStore {
  create(args: { data: { email: string } }): Promise<unknown>;
}

const ACCEPTED_RESPONSE = { message: 'If eligible, the address has been subscribed.' } as const;

function isUniqueConstraintError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === 'P2002';
}

export function createSubscribeHandler(store: NewsletterSubscriberStore) {
  return async function subscribe(req: Request, res: Response) {
    const { email } = req.body as z.infer<typeof subscribeSchema>;

    try {
      await store.create({ data: { email } });
    } catch (err) {
      if (!isUniqueConstraintError(err)) {
        throw err;
      }
    }

    // Do not reveal whether this address was already present, its record ID,
    // or its original subscription time.
    res.status(202).json(ACCEPTED_RESPONSE);
  };
}

export const subscribe = createSubscribeHandler(prisma.newsletterSubscriber);
