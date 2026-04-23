#!/usr/bin/env node

/*
 * Contract smoke for XOAgents/labs/offer-events through local Vite proxy.
 *
 * Usage:
 *   node scripts/offer-events-contract-smoke.mjs
 *
 * Preconditions:
 *   - npm run dev (port 5199) is running
 *   - npm run dev:proxy (port 8787) is running
 */

const BASE_URL = process.env.OFFER_EVENTS_BASE_URL ?? 'http://localhost:5199/api/offer-events';
const ROLE_WID = process.env.OFFER_EVENTS_ROLE_WID ?? 'd22c8a7a15b74cbd8cfb23b0cd290ebb';
const JOB_WID = process.env.OFFER_EVENTS_JOB_WID ?? '050b87e77f414a37a7fe9d20baa7085d';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function api(path = '', init = undefined) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: res.status, body, headers: res.headers };
}

function getMissingFields(record, expected) {
  return expected.filter((field) => !(field in record));
}

async function main() {
  const report = [];

  const list = await api('?limit=5');
  report.push({ step: 'GET list', status: list.status, body: list.body });
  assert(list.status === 200, `GET list failed: ${list.status}`);
  assert(list.body && Array.isArray(list.body.data) && list.body.data.length > 0, 'GET list returned no rows');

  const first = list.body.data[0];
  const getById = await api(`/${first.id}`);
  report.push({ step: 'GET by id', status: getById.status, body: getById.body });
  assert(getById.status === 200, `GET by id failed: ${getById.status}`);

  const post = await api('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: ROLE_WID,
      job: { id: JOB_WID },
    }),
  });
  report.push({ step: 'POST', status: post.status, body: post.body });
  assert(post.status === 201, `POST failed: ${post.status}`);

  const patch = await api(`/${first.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job: { id: JOB_WID },
    }),
  });
  report.push({ step: 'PATCH', status: patch.status, body: patch.body });
  assert(patch.status === 200, `PATCH failed: ${patch.status}`);

  // Field-level expectations (currently drifts in this environment)
  const expectedFields = ['id', 'descriptor', 'role', 'job', 'photo'];
  const listMissing = getMissingFields(first, expectedFields);
  const byIdMissing = getMissingFields(getById.body ?? {}, expectedFields);
  const postEmptyBody = post.body && typeof post.body === 'object' && Object.keys(post.body).length === 0;
  const patchEmptyBody = patch.body && typeof patch.body === 'object' && Object.keys(patch.body).length === 0;

  const summary = {
    baseUrl: BASE_URL,
    checks: {
      listMissingFields: listMissing,
      byIdMissingFields: byIdMissing,
      postReturnsEmptyBody: Boolean(postEmptyBody),
      patchReturnsEmptyBody: Boolean(patchEmptyBody),
    },
    report,
  };

  console.log(JSON.stringify(summary, null, 2));

  // Fail if full contract is not met.
  assert(listMissing.length === 0, `GET list missing fields: ${listMissing.join(', ')}`);
  assert(byIdMissing.length === 0, `GET by id missing fields: ${byIdMissing.join(', ')}`);
  assert(!postEmptyBody, 'POST returned empty body');
  assert(!patchEmptyBody, 'PATCH returned empty body');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
