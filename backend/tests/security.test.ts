import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import express from 'express';
import sharp from 'sharp';
import type { Request, Response } from 'express';
import { configureProxyTrust } from '../src/config/http';
import { parseAdminCredentials } from '../src/lib/adminCredentials';
import { processImageUpload } from '../src/lib/processImageUpload';

function responseRecorder() {
  const recorded: { status?: number; body?: unknown } = {};
  const response = {
    status(code: number) {
      recorded.status = code;
      return response;
    },
    json(body: unknown) {
      recorded.body = body;
      return response;
    },
  } as unknown as Response;
  return { recorded, response };
}

test('only the loopback Nginx hop is trusted by Express', () => {
  const app = express();
  configureProxyTrust(app);
  const trust = app.get('trust proxy fn') as (address: string) => boolean;

  assert.equal(trust('127.0.0.1'), true);
  assert.equal(trust('::1'), true);
  assert.equal(trust('203.0.113.10'), false);
});

test('new and existing newsletter subscriptions have identical public responses', async () => {
  process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
  const { createSubscribeHandler } = await import('../src/controllers/newsletter.controller');
  const request = { body: { email: 'traveler@example.com' } } as Request;
  const created = responseRecorder();
  const duplicate = responseRecorder();

  await createSubscribeHandler({ create: async () => ({ id: 'private-id' }) })(
    request,
    created.response,
  );
  await createSubscribeHandler({ create: async () => Promise.reject({ code: 'P2002' }) })(
    request,
    duplicate.response,
  );

  assert.deepEqual(created.recorded, duplicate.recorded);
  assert.equal(created.recorded.status, 202);
  assert.deepEqual(created.recorded.body, {
    message: 'If eligible, the address has been subscribed.',
  });
  assert.doesNotMatch(JSON.stringify(created.recorded.body), /private-id|subscribedAt/);
});

test('uploads are decoded and emitted under a server-controlled WEBP filename', async () => {
  const png = await sharp({
    create: { width: 2, height: 2, channels: 3, background: '#228b22' },
  })
    .png()
    .toBuffer();

  const processed = await processImageUpload(png);
  const metadata = await sharp(processed.data).metadata();

  assert.equal(metadata.format, 'webp');
  assert.match(processed.filename, /^\d+-[a-f0-9]{24}\.webp$/);
});

test('active content spoofed as an image is rejected', async () => {
  await assert.rejects(
    processImageUpload(Buffer.from('<!doctype html><script>alert(document.domain)</script>')),
  );
  await assert.rejects(
    processImageUpload(
      Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
    ),
  );
});

test('administrator bootstrap rejects the former default and content seed creates no admin', async () => {
  assert.throws(() =>
    parseAdminCredentials({
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'ChangeMe123!',
    }),
  );

  assert.deepEqual(
    parseAdminCredentials({
      ADMIN_EMAIL: 'ADMIN@EXAMPLE.COM',
      ADMIN_PASSWORD: 'a-unique-24-character-secret',
      ADMIN_NAME: 'Owner',
    }),
    {
      email: 'admin@example.com',
      password: 'a-unique-24-character-secret',
      name: 'Owner',
    },
  );

  const seed = await readFile(new URL('../prisma/seed.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(seed, /prisma\.admin|ChangeMe123!/);
});

// The reverse proxy and server provisioning live outside this repo, so there is
// nothing here to assert about them. What this repo still controls is that
// neither process is reachable except through that proxy: both bind to loopback
// only, and the API trusts loopback alone as its forwarding proxy.
test('both processes bind to loopback only in production', async () => {
  for (const app of ['../ecosystem.config.production.json', '../../frontend/ecosystem.config.production.json']) {
    const config = JSON.parse(await readFile(new URL(app, import.meta.url), 'utf8'));
    for (const entry of config.apps) {
      assert.equal(entry.env.HOST, '127.0.0.1', `${entry.name} must not bind a public interface`);
      assert.equal(entry.env.NODE_ENV, 'production');
    }
  }
});

test('the API trusts only loopback as its forwarding proxy', () => {
  // Anything broader would let a direct client spoof the address that
  // express-rate-limit buckets on, so the limiter could be evaded.
  const app = express();
  configureProxyTrust(app);
  assert.equal(app.get('trust proxy'), 'loopback');
});

test('the frontend static server refuses to serve outside its build directory', async () => {
  const server = await readFile(new URL('../../frontend/server.js', import.meta.url), 'utf8');

  // The guard has to run on the *resolved* path — checking the raw URL for
  // ".." misses encoded and normalised traversals.
  assert.match(server, /path\.resolve\(/);
  assert.match(server, /startsWith\(ROOT \+ path\.sep\)/);
  assert.match(server, /includes\('\\0'\)/);
});
