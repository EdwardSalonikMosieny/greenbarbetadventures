import type { Express } from 'express';

export function configureProxyTrust(app: Express) {
  app.set('trust proxy', 'loopback');
}
