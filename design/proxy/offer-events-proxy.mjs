/**
 * Offer Events REST proxy (MCP-backed)
 *
 * Thin local proxy so the Canvas Kit prototype at `design/offers-playground-v01.tsx`
 * can exercise the real SUV REST API from the browser without managing SUV auth
 * directly.
 *
 *   Browser -> Vite dev server (/api/offer-events/*) -> this proxy (:8787)
 *            -> hosted XO MCP (workbench-mcp) -> SUV REST
 *
 * Transport note: earlier versions of this file tried plain HTTP Basic directly
 * against the SUV (`/ccx/service/<tenant>/...`). That path is effectively gone
 * on modern XO SUVs - `/ccx/api/...` expects OAuth bearer tokens and the
 * legacy `/ccx/service/...` path returns 404 for new XO Agents resources.
 * The only auth channel that currently works end-to-end for XO Agents REST
 * is the one the hosted XO MCP server already owns at
 * https://workbench-mcp.prod.dev.megaleo.com/suv/mcp. This proxy forwards
 * browser HTTP calls to that MCP endpoint via JSON-RPC `tools/call` on the
 * `suv_rest_call` tool. The response body is identical to a direct REST call,
 * which preserves the "honest dogfood" drift story the playground exists to tell.
 *
 * Credentials come from the user-xo-mcp entry in ~/.cursor/mcp.json (Authorization,
 * SUV_HOSTNAME, SUV_PASSWORD, DEVELOPER_USERNAME). The proxy never reads or writes
 * secrets to disk.
 *
 * Routes (unchanged from before):
 *   GET    /offer-events?limit=&offset=
 *   GET    /offer-events/:id
 *   POST   /offer-events           (body JSON)
 *   PATCH  /offer-events/:id       (body JSON)
 *   DELETE /offer-events/:id
 *
 * Run with:  node proxy/offer-events-proxy.mjs
 * Or via:    npm run dev:proxy
 */

import http from 'node:http';
import https from 'node:https';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT ?? 8787);
const MCP_SERVER_NAME = 'xo-mcp';
const MCP_CONFIG_PATH = path.join(homedir(), '.cursor', 'mcp.json');
const MCP_TOOL = 'suv_rest_call';
const REST_SERVICE = 'XOAgents';
const REST_VERSION = 'labs';
const REST_RESOURCE = 'offer-events';

function loadMcpConfig(configPath, serverName) {
  let raw;
  try {
    raw = readFileSync(configPath, 'utf8');
  } catch (err) {
    throw new Error(`Could not read ${configPath}: ${err.message}. Expected xo-mcp entry with Authorization, SUV_HOSTNAME, SUV_PASSWORD headers.`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`${configPath} is not valid JSON: ${err.message}`);
  }
  const server = parsed?.mcpServers?.[serverName];
  if (!server?.url || !server?.headers) {
    throw new Error(`${configPath} has no ${serverName} entry with url + headers.`);
  }
  const required = ['Authorization', 'SUV_HOSTNAME', 'SUV_PASSWORD'];
  const missing = required.filter((k) => !server.headers[k]);
  if (missing.length) {
    throw new Error(`${serverName} is missing required header(s): ${missing.join(', ')}`);
  }
  return { url: server.url, headers: server.headers };
}

const mcp = loadMcpConfig(MCP_CONFIG_PATH, MCP_SERVER_NAME);
const mcpUrl = new URL(mcp.url);

console.log(`[offer-events-proxy] ready`);
console.log(`[offer-events-proxy] mcp:      ${mcp.url}`);
console.log(`[offer-events-proxy] suv host: ${mcp.headers.SUV_HOSTNAME}`);
console.log(`[offer-events-proxy] resource: ${REST_SERVICE}/${REST_VERSION}/${REST_RESOURCE}`);
console.log(`[offer-events-proxy] listen:   http://localhost:${PORT}`);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseSseJsonRpc(buf) {
  // Hosted MCP returns an SSE stream: one or more `event: message\ndata: <json>\n\n` frames.
  // For a single tools/call we only need the first data frame.
  const text = buf.toString('utf8');
  const dataLines = text
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart());
  if (dataLines.length === 0) {
    return null;
  }
  try {
    return JSON.parse(dataLines.join(''));
  } catch (err) {
    return { parseError: err.message, raw: dataLines.join('').slice(0, 400) };
  }
}

function callMcp(toolArgs) {
  const started = Date.now();
  const body = JSON.stringify({
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: { name: MCP_TOOL, arguments: toolArgs },
  });

  return new Promise((resolve) => {
    const options = {
      hostname: mcpUrl.hostname,
      port: mcpUrl.port || 443,
      path: mcpUrl.pathname + mcpUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'Content-Length': Buffer.byteLength(body),
        Authorization: mcp.headers.Authorization,
        SUV_HOSTNAME: mcp.headers.SUV_HOSTNAME,
        SUV_PASSWORD: mcp.headers.SUV_PASSWORD,
      },
    };
    if (mcp.headers.DEVELOPER_USERNAME) {
      options.headers.DEVELOPER_USERNAME = mcp.headers.DEVELOPER_USERNAME;
    }

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const duration = Date.now() - started;
        const raw = Buffer.concat(chunks);
        if ((res.statusCode ?? 0) >= 400) {
          resolve({
            ok: false,
            httpStatus: res.statusCode ?? 0,
            durationMs: duration,
            error: `MCP transport HTTP ${res.statusCode}`,
            rawBody: raw.toString('utf8').slice(0, 400),
          });
          return;
        }
        const parsed = parseSseJsonRpc(raw);
        if (!parsed || parsed.parseError) {
          resolve({ ok: false, httpStatus: res.statusCode ?? 0, durationMs: duration, error: 'Could not parse MCP SSE response', rawBody: raw.toString('utf8').slice(0, 400) });
          return;
        }
        if (parsed.error) {
          resolve({ ok: false, httpStatus: 500, durationMs: duration, error: `MCP error: ${parsed.error.message ?? JSON.stringify(parsed.error)}` });
          return;
        }
        const result = parsed.result;
        if (!result) {
          resolve({ ok: false, httpStatus: 500, durationMs: duration, error: 'MCP response missing result' });
          return;
        }
        const isError = result.isError === true;
        // Prefer structured string form; fall back to content[0].text
        const textResult =
          result?.structuredContent?.result ??
          result?.content?.[0]?.text ??
          null;
        resolve({
          ok: !isError,
          httpStatus: isError ? 500 : 200,
          durationMs: duration,
          textResult,
          raw: parsed,
        });
      });
    });
    req.on('error', (err) => {
      resolve({ ok: false, httpStatus: 502, durationMs: Date.now() - started, error: err.message });
    });
    req.setTimeout(20_000, () => {
      req.destroy(new Error('MCP call timed out after 20s'));
    });
    req.end(body);
  });
}

function tryParseJson(s) {
  if (typeof s !== 'string' || s.length === 0) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function describeCall(method, id, hasBody) {
  const idPart = id ? `/${id}` : '';
  return `${method} /offer-events${idPart}${hasBody ? ' + body' : ''}`;
}

async function handleApiCall({ method, id, params, body, res }) {
  // Build suv_rest_call arguments
  const args = {
    service_name: REST_SERVICE,
    version: REST_VERSION,
    resource: REST_RESOURCE,
    method,
  };
  if (id) args.object_reference = id;
  if (params && Object.keys(params).length > 0) args.params = params;
  if (body && body.length > 0) {
    const parsed = tryParseJson(body.toString('utf8'));
    if (parsed === null) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ proxyError: 'invalid_json_body' }));
      return;
    }
    args.data = parsed;
  }

  const mcpRes = await callMcp(args);
  const label = describeCall(method, id, Boolean(body && body.length));
  console.log(`[offer-events-proxy] ${label} -> mcp ${mcpRes.ok ? 'ok' : 'err'} ${mcpRes.httpStatus} (${mcpRes.durationMs}ms)`);

  if (!mcpRes.ok) {
    // Try to surface a 4xx/5xx from the underlying REST call if present in the MCP text payload.
    const restJson = tryParseJson(mcpRes.textResult ?? '');
    const upstreamStatus = restJson?.error?.status || restJson?.status || mcpRes.httpStatus;
    res.writeHead(upstreamStatus >= 400 ? upstreamStatus : 502, {
      'Content-Type': 'application/json',
      'X-Proxy-Duration-Ms': String(mcpRes.durationMs),
      'X-Proxy-Transport': 'xo-mcp',
    });
    res.end(JSON.stringify({
      proxyError: mcpRes.error ?? 'mcp_error',
      upstream: restJson ?? mcpRes.textResult ?? null,
    }));
    return;
  }

  // Pick the HTTP status we want to surface to the browser.
  // GET -> 200 (unless response was null)
  // POST -> 201 by convention (XO Agents returns empty bodies but 2xx at the REST layer)
  // PATCH -> 200
  // DELETE -> 204
  const statusByMethod = { GET: 200, POST: 201, PATCH: 200, DELETE: 204 };
  const status = statusByMethod[method] ?? 200;
  const payload = mcpRes.textResult ?? '';
  const isJson = payload.trim().startsWith('{') || payload.trim().startsWith('[');

  res.writeHead(status, {
    'Content-Type': isJson ? 'application/json' : 'text/plain',
    'X-Proxy-Duration-Ms': String(mcpRes.durationMs),
    'X-Proxy-Transport': 'xo-mcp',
  });
  // DELETE 204 should have no body.
  if (status === 204) {
    res.end();
  } else {
    res.end(payload);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      transport: 'xo-mcp',
      mcp_url: mcp.url,
      suv_host: mcp.headers.SUV_HOSTNAME,
      resource: `${REST_SERVICE}/${REST_VERSION}/${REST_RESOURCE}`,
    }));
    return;
  }

  if (!pathname.startsWith('/offer-events')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ proxyError: 'unknown_route', hint: 'expected /offer-events or /offer-events/:id' }));
    return;
  }

  const idPart = pathname.replace(/^\/offer-events/, '').replace(/^\//, '');
  const id = idPart || '';

  const method = (req.method ?? 'GET').toUpperCase();
  const allowed = new Set(['GET', 'POST', 'PATCH', 'DELETE']);
  if (!allowed.has(method)) {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ proxyError: 'method_not_allowed', allowed: [...allowed] }));
    return;
  }

  const params = Object.fromEntries(url.searchParams.entries());

  let body = Buffer.alloc(0);
  if (method === 'POST' || method === 'PATCH') {
    body = await readBody(req);
  }

  await handleApiCall({ method, id, params, body, res });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[offer-events-proxy] POST http://localhost:${PORT}/offer-events  (example)`);
});

process.on('SIGINT', () => {
  console.log('\n[offer-events-proxy] shutting down');
  server.close(() => process.exit(0));
});
