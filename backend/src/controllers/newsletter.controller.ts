import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../config/prisma';

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});

export async function subscribe(req: Request, res: Response) {
  const { email } = req.body as z.infer<typeof subscribeSchema>;

  try {
    const subscriber = await prisma.newsletterSubscriber.create({ data: { email } });
    res.status(201).json(subscriber);
  } catch (err) {
    // Resubscribing with an email already on the list is a success from the
    // visitor's point of view, not an error — return the existing row instead of 409ing.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
      res.status(200).json(existing);
      return;
    }
    throw err;
  }
}
