/**
 * Offer Events REST proxy
 *
 * Thin local proxy so the Canvas Kit prototype at `design/offers-playground-v01.tsx`
 * can hit the real SUV REST API from the browser without CORS or bundled credentials.
 *
 * Browser -> Vite dev server (/api/offer-events/*) -> this proxy (:8787) -> SUV REST
 *
 * Reads SUV credentials from ~/contexto/.env (same file Contexto's suv_rest_call uses).
 * Tenant slug defaults to `super` for *.workdaysuv.com hosts; override with SUV_TENANT.
 *
 * Routes:
 *   GET    /offer-events?limit=&offset=
 *   GET    /offer-events/:id
 *   POST   /offer-events           (body JSON)
 *   PATCH  /offer-events/:id       (body JSON)
 *   DELETE /offer-events/:id
 *
 * Run with:  node proxy/offer-events-proxy.mjs
 * Or via:    npm run dev:proxy
 *
 * Never commit this file's runtime env. `~/contexto/.env` is already gitignored.
 */

import http from 'node:http';
import https from 'node:https';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT ?? 8787);
const ENV_PATH = path.join(homedir(), 'contexto', '.env');

function loadEnv(envPath) {
  let raw;
  try {
    raw = readFileSync(envPath, 'utf8');
  } catch (err) {
    throw new Error(`Could not read ${envPath}: ${err.message}. Expected SUV credentials here (SUV_HOST, SUV_USERNAME, SUV_PASSWORD).`);
  }
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[m[1]] = val;
  }
  return env;
}

const env = loadEnv(ENV_PATH);
const required = ['SUV_HOST', 'SUV_USERNAME', 'SUV_PASSWORD'];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  console.error(`[offer-events-proxy] Missing required env vars in ${ENV_PATH}: ${missing.join(', ')}`);
  process.exit(1);
}

const suvHost = env.SUV_HOST.replace(/^https?:\/\//, '').replace(/\/$/, '');
const tenant = env.SUV_TENANT ?? 'super';
const basePath = `/ccx/service/${tenant}/XOAgents/labs/offer-events`;
const authHeader = 'Basic ' + Buffer.from(`${env.SUV_USERNAME}:${env.SUV_PASSWORD}`).toString('base64');

console.log(`[offer-events-proxy] ready`);
console.log(`[offer-events-proxy] upstream: https://${suvHost}${basePath}`);
console.log(`[offer-events-proxy] tenant:   ${tenant}${env.SUV_TENANT ? '' : ' (default)'}`);
console.log(`[offer-events-proxy] listen:   http://localhost:${PORT}`);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function forwardToSuv({ method, suvPath, body, res }) {
  const started = Date.now();
  const options = {
    hostname: suvHost,
    port: 443,
    path: suvPath,
    method,
    headers: {
      Authorization: authHeader,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const upstream = https.request(options, (upRes) => {
    const chunks = [];
    upRes.on('data', (c) => chunks.push(c));
    upRes.on('end', () => {
      const duration = Date.now() - started;
      const buf = Buffer.concat(chunks);
      console.log(`[offer-events-proxy] ${method} ${suvPath} -> ${upRes.statusCode} (${duration}ms, ${buf.length}b)`);
      res.writeHead(upRes.statusCode ?? 502, {
        'Content-Type': upRes.headers['content-type'] ?? 'application/json',
        'X-Proxy-Duration-Ms': String(duration),
        'X-Proxy-Upstream-Status': String(upRes.statusCode ?? 0),
      });
      res.end(buf);
    });
  });

  upstream.on('error', (err) => {
    console.error(`[offer-events-proxy] upstream error for ${method} ${suvPath}:`, err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ proxyError: 'upstream_failed', message: err.message }));
    }
  });

  if (body && body.length > 0) {
    upstream.setHeader('Content-Length', body.length);
    upstream.end(body);
  } else {
    upstream.end();
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, upstream: `https://${suvHost}${basePath}`, tenant }));
    return;
  }

  if (!pathname.startsWith('/offer-events')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ proxyError: 'unknown_route', hint: 'expected /offer-events or /offer-events/:id' }));
    return;
  }

  const idPart = pathname.replace(/^\/offer-events/, '');
  const suvPath = basePath + idPart + (url.search || '');
  const method = req.method ?? 'GET';

  let body = Buffer.alloc(0);
  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    body = await readBody(req);
  }

  forwardToSuv({ method, suvPath, body, res });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[offer-events-proxy] POST http://localhost:${PORT}/offer-events  (example)`);
});

process.on('SIGINT', () => {
  console.log('\n[offer-events-proxy] shutting down');
  server.close(() => process.exit(0));
});
