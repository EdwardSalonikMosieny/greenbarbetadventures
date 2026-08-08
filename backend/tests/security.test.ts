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

test('Cloudflare deployment overwrites client identity and blocks direct origin HTTP access', async () => {
  const nginx = await readFile(
    new URL('../../deploy/nginx-green-barbet.conf', import.meta.url),
    'utf8',
  );
  const setup = await readFile(new URL('../../deploy/setup-vps.sh', import.meta.url), 'utf8');

  assert.match(nginx, /proxy_set_header X-Forwarded-For \$remote_addr;/);
  assert.doesNotMatch(nginx, /\$proxy_add_x_forwarded_for/);
  assert.match(setup, /real_ip_header CF-Connecting-IP;/);
  assert.match(setup, /ufw allow proto tcp from "\$range" to any port 443/);
  assert.match(setup, /ufw --force delete allow 'Nginx Full'/);
  assert.match(setup, /HOST=127\.0\.0\.1/);
});
