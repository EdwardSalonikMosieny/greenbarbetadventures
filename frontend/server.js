/**
 * Production entrypoint for the built frontend.
 *
 * Vite emits a static SPA, but the VPS fronts every app with Nginx acting as a
 * reverse proxy rather than serving files off disk (same shape as the sibling
 * Salama/Johjam deployments). This is the process Nginx proxies `/` to: a
 * dependency-free static file server over `dist/`, with client-side-routing
 * fallback to `index.html`.
 *
 * Intentionally uses only `node:` built-ins — the frontend ships no runtime
 * dependencies, so `npm ci --omit=dev` on the server stays possible and there
 * is no production supply chain beyond Node itself.
 *
 * Run under PM2 via ecosystem.config.production.json (greenbarbet-web-prod).
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const INDEX = path.join(ROOT, 'index.html');

const PORT = Number.parseInt(process.env.PORT ?? '5070', 10);
const HOST = process.env.HOST ?? '127.0.0.1';

/**
 * Extension -> Content-Type. Only the types Vite actually emits for this site,
 * plus the fonts and media used by the hero. Anything unlisted is served as an
 * opaque download rather than guessed, so an unexpected file can never be
 * interpreted as script by the browser.
 */
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json; charset=utf-8',
};

/**
 * Resolve a request path to a file inside ROOT, or null if it escapes.
 *
 * Rejecting on the resolved path (not the raw URL) is what stops
 * `/../../etc/passwd` and its encoded variants: `path.resolve` collapses the
 * traversal first, then the prefix check runs against the real location.
 */
function resolveWithinRoot(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null; // malformed percent-encoding
  }

  // A NUL byte can truncate the path in some downstream syscalls.
  if (decoded.includes('\0')) return null;

  const resolved = path.resolve(ROOT, '.' + path.posix.normalize(decoded));
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) return null;
  return resolved;
}

/**
 * Cache policy. Vite fingerprints everything under /assets/ with a content
 * hash, so those are safe to cache forever; index.html must never be cached or
 * a deploy would keep serving links to asset hashes that no longer exist.
 */
function cacheControlFor(urlPath, filePath) {
  if (filePath === INDEX) return 'no-cache';
  if (urlPath.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  return 'public, max-age=3600';
}

async function statFile(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.isFile() ? stats : null;
  } catch {
    return null;
  }
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  // Nginx terminates TLS and handles the real HTTP surface; this server only
  // ever needs to answer reads.
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { 'Content-Type': 'text/plain; charset=utf-8', Allow: 'GET, HEAD' }, 'Method Not Allowed');
    return;
  }

  const urlPath = (req.url ?? '/').split('?')[0].split('#')[0];
  const requested = resolveWithinRoot(urlPath);

  if (requested === null) {
    send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad Request');
    return;
  }

  // Try the literal file, then the directory's index.html, then fall back to
  // the SPA shell so React Router can resolve the route on the client.
  let filePath = requested;
  let stats = await statFile(filePath);

  if (!stats && !path.extname(urlPath)) {
    filePath = path.join(requested, 'index.html');
    stats = await statFile(filePath);
  }

  if (!stats) {
    // A missing *asset* is a genuine 404 — only extensionless paths are routes.
    // Serving index.html for a missing .js would hand the browser HTML where it
    // expects a module, which fails confusingly instead of visibly.
    if (path.extname(urlPath)) {
      send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
      return;
    }
    filePath = INDEX;
    stats = await statFile(filePath);
    if (!stats) {
      send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Frontend build missing');
      return;
    }
  }

  const etag = `W/"${stats.size.toString(16)}-${stats.mtimeMs.toString(16)}"`;
  const headers = {
    'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
    'Content-Length': stats.size,
    'Cache-Control': cacheControlFor(urlPath, filePath),
    'Last-Modified': stats.mtime.toUTCString(),
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
  };

  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag, 'Cache-Control': headers['Cache-Control'] });
    res.end();
    return;
  }

  if (req.method === 'HEAD') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  res.writeHead(200, headers);
  const stream = createReadStream(filePath);
  stream.on('error', () => res.destroy());
  stream.pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Green Barbet Adventures frontend listening on ${HOST}:${PORT}`);
  // Tells PM2 (wait_ready) the socket is live, so a reload isn't reported as
  // successful until this process can actually serve.
  process.send?.('ready');
});

// PM2 sends SIGINT on reload/stop; finish in-flight responses before exiting.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
