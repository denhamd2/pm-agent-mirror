/**
 * Offer Events REST API playground v01
 *
 * Dogfooding surface for the Offer Events REST API built via rest-from-task mode.
 * Every button in this prototype makes a real HTTP call to the development SUV:
 *
 *   browser -> Vite (/api/offer-events) -> local proxy (:8787) -> SUV REST
 *
 * Run `npm run dev:proxy` in one terminal and `npm run dev` in another.
 *
 * Purpose: visible, honest proof that all four operations (GET / POST / PATCH / DELETE)
 * work end-to-end, AND surface the runtime-vs-design drift so the PM can see exactly
 * what the API returns today vs what the View representation promised.
 *
 * Known drift (from Phase 4 smoke, recorded in docs/xo/rest-apis/offer-events/README.md):
 *   - GET returns only `id` + `descriptor`; `role`, `job`, `photo` are missing.
 *   - POST/PATCH return empty body despite 2xx status.
 *
 * Route: /offers-playground-v01
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, Box } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText } from '@workday/canvas-kit-react/text';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@workday/canvas-kit-react/button';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { StatusIndicator, StatusIndicatorType, StatusIndicatorEmphasis } from '@workday/canvas-kit-react/status-indicator';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { homeIcon, userIcon, homeBuildingIcon, linkIcon, dotIcon } from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  WorkdayLeftTabBar,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  SANA_PAGE_CANVAS,
  SANA_CARD_RADIUS_LG,
  type WorkdayLeftTabBarPrimaryItem,
} from './components';

const NAV_PRIMARY: WorkdayLeftTabBarPrimaryItem[] = [
  { icon: homeIcon, ariaLabel: 'Home', railLabel: 'HOME' },
  { icon: userIcon, ariaLabel: 'Recruiting', railLabel: 'RECRUIT' },
  { icon: homeBuildingIcon, ariaLabel: 'Organisation', railLabel: 'ORG' },
  { icon: linkIcon, ariaLabel: 'External links', railLabel: 'LINKS' },
  { icon: dotIcon, ariaLabel: 'More', railLabel: 'MORE' },
];

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type OpKey = 'list' | 'get' | 'post' | 'patch' | 'delete';

type CallLogEntry = {
  id: string;
  at: string;
  method: HttpMethod;
  url: string;
  status: number | null;
  durationMs: number | null;
  ok: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
  error?: string;
};

const EXPECTED_VIEW_FIELDS = ['id', 'descriptor', 'role', 'job', 'photo'] as const;
const DRIFT_FIELDS = ['role', 'job', 'photo'] as const;

const PROXY_PREFIX = '/api/offer-events';

function newCallId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function callApi(
  method: HttpMethod,
  subpath: string,
  body?: Record<string, unknown>
): Promise<{ status: number; body: unknown; durationMs: number; ok: boolean; error?: string }> {
  const started = performance.now();
  const url = `${PROXY_PREFIX}${subpath}`;
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const durationMs = Math.round(performance.now() - started);
    let parsed: unknown = text;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      /* not JSON; keep as text */
    }
    return { status: res.status, body: parsed, durationMs, ok: res.ok };
  } catch (err) {
    const durationMs = Math.round(performance.now() - started);
    return { status: 0, body: null, durationMs, ok: false, error: (err as Error).message };
  }
}

export function OffersPlaygroundV01() {
  const [op, setOp] = useState<OpKey>('list');
  const [log, setLog] = useState<CallLogEntry[]>([]);
  const [listLimit, setListLimit] = useState('10');
  const [listOffset, setListOffset] = useState('0');
  const [lookupId, setLookupId] = useState('');
  const [patchId, setPatchId] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [postBody, setPostBody] = useState<string>(
    JSON.stringify(
      {
        role: { id: '<role-wid>' },
        job: { id: '<requisition-wid>' },
      },
      null,
      2
    )
  );
  const [patchBody, setPatchBody] = useState<string>(
    JSON.stringify({ descriptor: 'Updated by playground at ' + new Date().toISOString() }, null, 2)
  );
  const [proxyHealth, setProxyHealth] = useState<'unknown' | 'ok' | 'down'>('unknown');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/offer-events/healthz').catch(() => null);
        if (cancelled) return;
        if (res && res.ok) {
          setProxyHealth('ok');
        } else {
          // /healthz isn't on the offer-events subtree; try direct to the proxy root
          const res2 = await fetch('/api/offer-events?limit=1', { method: 'GET' });
          setProxyHealth(res2.ok || res2.status >= 400 ? 'ok' : 'down');
        }
      } catch {
        if (!cancelled) setProxyHealth('down');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const appendLog = useCallback((entry: CallLogEntry) => {
    setLog((prev) => [entry, ...prev].slice(0, 25));
  }, []);

  const runList = useCallback(async () => {
    const params = new URLSearchParams();
    if (listLimit) params.set('limit', listLimit);
    if (listOffset && listOffset !== '0') params.set('offset', listOffset);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const callId = newCallId();
    const pending: CallLogEntry = {
      id: callId,
      at: new Date().toISOString(),
      method: 'GET',
      url: `${PROXY_PREFIX}${qs}`,
      status: null,
      durationMs: null,
      ok: false,
    };
    appendLog(pending);
    const result = await callApi('GET', qs);
    appendLog({ ...pending, status: result.status, durationMs: result.durationMs, ok: result.ok, responseBody: result.body, error: result.error });
  }, [listLimit, listOffset, appendLog]);

  const runGet = useCallback(async () => {
    if (!lookupId) return;
    const callId = newCallId();
    const pending: CallLogEntry = {
      id: callId,
      at: new Date().toISOString(),
      method: 'GET',
      url: `${PROXY_PREFIX}/${lookupId}`,
      status: null,
      durationMs: null,
      ok: false,
    };
    appendLog(pending);
    const result = await callApi('GET', `/${lookupId}`);
    appendLog({ ...pending, status: result.status, durationMs: result.durationMs, ok: result.ok, responseBody: result.body, error: result.error });
  }, [lookupId, appendLog]);

  const runPost = useCallback(async () => {
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(postBody);
    } catch (err) {
      appendLog({
        id: newCallId(),
        at: new Date().toISOString(),
        method: 'POST',
        url: PROXY_PREFIX,
        status: null,
        durationMs: null,
        ok: false,
        error: `Invalid JSON in POST body: ${(err as Error).message}`,
      });
      return;
    }
    const callId = newCallId();
    const pending: CallLogEntry = {
      id: callId,
      at: new Date().toISOString(),
      method: 'POST',
      url: PROXY_PREFIX,
      status: null,
      durationMs: null,
      ok: false,
      requestBody: body,
    };
    appendLog(pending);
    const result = await callApi('POST', '', body);
    appendLog({ ...pending, status: result.status, durationMs: result.durationMs, ok: result.ok, responseBody: result.body, error: result.error });
  }, [postBody, appendLog]);

  const runPatch = useCallback(async () => {
    if (!patchId) return;
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(patchBody);
    } catch (err) {
      appendLog({
        id: newCallId(),
        at: new Date().toISOString(),
        method: 'PATCH',
        url: `${PROXY_PREFIX}/${patchId}`,
        status: null,
        durationMs: null,
        ok: false,
        error: `Invalid JSON: ${(err as Error).message}`,
      });
      return;
    }
    const callId = newCallId();
    const pending: CallLogEntry = {
      id: callId,
      at: new Date().toISOString(),
      method: 'PATCH',
      url: `${PROXY_PREFIX}/${patchId}`,
      status: null,
      durationMs: null,
      ok: false,
      requestBody: body,
    };
    appendLog(pending);
    const result = await callApi('PATCH', `/${patchId}`, body);
    appendLog({ ...pending, status: result.status, durationMs: result.durationMs, ok: result.ok, responseBody: result.body, error: result.error });
  }, [patchId, patchBody, appendLog]);

  const runDelete = useCallback(async () => {
    if (!deleteId) return;
    if (!window.confirm(`Delete offer event ${deleteId}? This is a real call against the development SUV.`)) return;
    const callId = newCallId();
    const pending: CallLogEntry = {
      id: callId,
      at: new Date().toISOString(),
      method: 'DELETE',
      url: `${PROXY_PREFIX}/${deleteId}`,
      status: null,
      durationMs: null,
      ok: false,
    };
    appendLog(pending);
    const result = await callApi('DELETE', `/${deleteId}`);
    appendLog({ ...pending, status: result.status, durationMs: result.durationMs, ok: result.ok, responseBody: result.body, error: result.error });
  }, [deleteId, appendLog]);

  const latestListData = useMemo(() => {
    const last = log.find((e) => e.method === 'GET' && !e.url.includes(`${PROXY_PREFIX}/`) && e.responseBody);
    if (!last || !last.responseBody || typeof last.responseBody !== 'object') return null;
    const body = last.responseBody as { total?: number; data?: Array<Record<string, unknown>> };
    return body;
  }, [log]);

  const stats = useMemo(() => {
    const total = log.length;
    const ok = log.filter((e) => e.ok).length;
    const fail = log.filter((e) => e.status !== null && !e.ok).length;
    const pending = log.filter((e) => e.status === null).length;
    return { total, ok, fail, pending };
  }, [log]);

  return (
    <Flex style={{ height: '100vh', backgroundColor: SANA_PAGE_CANVAS }}>
      <WorkdayLeftTabBar
        primaryItems={NAV_PRIMARY}
        secondaryTitle="Recruiting"
        secondarySubtitle="Alex Morgan · Senior Recruiter"
        tabs={[
          { id: 'playground', label: 'API playground' },
          { id: 'offers', label: 'Offers dashboard' },
          { id: 'candidates', label: 'Candidates' },
          { id: 'requisitions', label: 'Requisitions' },
        ]}
        activeTabId="playground"
        onTabChange={() => {}}
      />

      <Flex flex={1} flexDirection="column" style={{ minWidth: 0 }}>
        <WorkdayTopNav searchPlaceholder="Search..." searchValue="" onSearchChange={() => {}} />

        <Box
          flex={1}
          style={{
            marginTop: WORKDAY_TOP_NAV_HEIGHT_PX,
            overflowY: 'auto',
            padding: space.xl,
          }}
        >
          <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="l" flexWrap="wrap" gap="m">
            <Box>
              <Heading size="large" marginY="zero" color={colors.blackPepper600}>
                Offer Events REST playground
              </Heading>
              <BodyText size="medium" color={colors.blackPepper500} marginTop="xxs">
                Dogfooding the four XO Agent Tools end to end. Every button below exercises
                <code style={{ margin: '0 4px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  XOAgents/labs/offer-events
                </code>
                on the development SUV via the local proxy on port 8787, which forwards through the hosted XO MCP. Response bodies are identical to a direct REST call.
              </BodyText>
            </Box>
            <Flex gap="s" alignItems="center">
              <StatusIndicator
                type={proxyHealth === 'ok' ? StatusIndicatorType.Green : proxyHealth === 'down' ? StatusIndicatorType.Red : StatusIndicatorType.Gray}
                emphasis={StatusIndicatorEmphasis.Low}
                label={
                  proxyHealth === 'ok'
                    ? 'Proxy reachable'
                    : proxyHealth === 'down'
                    ? 'Proxy unreachable - run npm run dev:proxy'
                    : 'Checking proxy...'
                }
              />
              <BodyText size="small" color={colors.blackPepper400}>
                {stats.total} calls ({stats.ok} ok, {stats.fail} fail, {stats.pending} pending)
              </BodyText>
            </Flex>
          </Flex>

          <DriftBanner />

          <Flex gap="xs" marginBottom="m" style={{ flexWrap: 'wrap' }}>
            {(
              [
                { id: 'list', label: 'GET list' },
                { id: 'get', label: 'GET by id' },
                { id: 'post', label: 'POST' },
                { id: 'patch', label: 'PATCH' },
                { id: 'delete', label: 'DELETE' },
              ] as { id: OpKey; label: string }[]
            ).map((tab) => {
              const active = op === tab.id;
              return (
                <Box
                  key={tab.id}
                  as="button"
                  onClick={() => setOp(tab.id)}
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    padding: '10px 16px',
                    borderRadius: 999,
                    backgroundColor: active ? colors.blackPepper600 : colors.frenchVanilla100,
                    color: active ? colors.frenchVanilla100 : colors.blackPepper500,
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    border: active ? 'none' : `1px solid ${colors.soap300}`,
                  }}
                >
                  {tab.label}
                </Box>
              );
            })}
          </Flex>

          <Flex gap="l" style={{ alignItems: 'stretch', flexWrap: 'wrap' }}>
            <Box flex="1 1 520px" minWidth={420}>
              {op === 'list' && (
                <OpCard title="GET /offer-events" description="List offer events. Renders runtime drift against the design-time View rep.">
                  <Flex gap="s" flexWrap="wrap" marginBottom="m">
                    <LabelledInput label="Limit" id="limit-input" value={listLimit} onChange={setListLimit} />
                    <LabelledInput label="Offset" id="offset-input" value={listOffset} onChange={setListOffset} />
                  </Flex>
                  <PrimaryButton onClick={runList}>Send</PrimaryButton>
                  {latestListData && <ListResponseTable body={latestListData} />}
                </OpCard>
              )}
              {op === 'get' && (
                <OpCard title="GET /offer-events/:id" description="Fetch a single offer event. Same drift will be visible at the instance level.">
                  <LabelledInput
                    label="Offer event id"
                    id="id-input"
                    value={lookupId}
                    onChange={setLookupId}
                    placeholder="e.g. f09da9823133100f4fd07ea4cfef0124"
                    fullWidth
                  />
                  <Box marginTop="m">
                    <PrimaryButton onClick={runGet} disabled={!lookupId}>Send</PrimaryButton>
                    <TertiaryButton
                      onClick={() => {
                        const first = latestListData?.data?.[0] as { id?: string } | undefined;
                        if (first?.id) setLookupId(first.id);
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      Use first id from list
                    </TertiaryButton>
                  </Box>
                </OpCard>
              )}
              {op === 'post' && (
                <OpCard
                  title="POST /offer-events"
                  description="Create a new offer event. Expect 2xx with empty body (known drift - confirm in response panel)."
                >
                  <LabelledTextarea
                    label="Request body (JSON)"
                    id="post-body"
                    value={postBody}
                    onChange={setPostBody}
                    minHeight={180}
                  />
                  <Box marginTop="m">
                    <PrimaryButton onClick={runPost}>Send</PrimaryButton>
                  </Box>
                </OpCard>
              )}
              {op === 'patch' && (
                <OpCard
                  title="PATCH /offer-events/:id"
                  description="Update an existing offer event. Expect 2xx with empty body (known drift)."
                >
                  <LabelledInput label="Offer event id" id="patch-id" value={patchId} onChange={setPatchId} fullWidth />
                  <Box marginTop="m">
                    <LabelledTextarea
                      label="Request body (JSON)"
                      id="patch-body"
                      value={patchBody}
                      onChange={setPatchBody}
                      minHeight={140}
                    />
                  </Box>
                  <Box marginTop="m">
                    <PrimaryButton onClick={runPatch} disabled={!patchId}>Send</PrimaryButton>
                  </Box>
                </OpCard>
              )}
              {op === 'delete' && (
                <OpCard
                  title="DELETE /offer-events/:id"
                  description="Delete an offer event. Confirmation required. Expect 204 No Content."
                >
                  <LabelledInput label="Offer event id" id="delete-id" value={deleteId} onChange={setDeleteId} fullWidth />
                  <Box marginTop="m">
                    <SecondaryButton onClick={runDelete} disabled={!deleteId}>Send DELETE</SecondaryButton>
                  </Box>
                </OpCard>
              )}
            </Box>

            <Box flex="1 1 460px" minWidth={380}>
              <CallLogPanel log={log} onClear={() => setLog([])} />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

function DriftBanner() {
  return (
    <Box
      marginBottom="l"
      padding="m"
      style={{
        backgroundColor: colors.cantaloupe100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.cantaloupe300}`,
      }}
    >
      <Flex gap="s" alignItems="flex-start">
        <Box style={{ minWidth: 24, fontSize: 20 }}>!</Box>
        <Box>
          <BodyText size="small" color={colors.blackPepper600} style={{ fontWeight: 600 }}>
            Known runtime drift (Phase 4 smoke)
          </BodyText>
          <BodyText size="small" color={colors.blackPepper500} marginTop="xxs">
            The View representation designs for <code>id</code>, <code>descriptor</code>, <code>role</code>, <code>job</code>, <code>photo</code> - but the runtime currently returns only <code>id</code> and <code>descriptor</code>. POST and PATCH return 2xx with empty bodies. Fields flagged in red below are expected-but-missing - this is the honest gap between the schema and the live API.
          </BodyText>
        </Box>
      </Flex>
    </Box>
  );
}

function OpCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Box
      padding="l"
      style={{
        backgroundColor: colors.frenchVanilla100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
      }}
    >
      <Heading size="small" marginY="zero" color={colors.blackPepper600}>
        {title}
      </Heading>
      <BodyText size="small" color={colors.blackPepper400} marginTop="xxs" marginBottom="m">
        {description}
      </BodyText>
      {children}
    </Box>
  );
}

function ListResponseTable({ body }: { body: { total?: number; data?: Array<Record<string, unknown>> } }) {
  const rows = body.data ?? [];
  return (
    <Box marginTop="l">
      <BodyText size="small" color={colors.blackPepper500} marginBottom="xxs">
        Total: {body.total ?? 'unknown'} • Showing {rows.length} row{rows.length === 1 ? '' : 's'}
      </BodyText>
      <Box
        style={{
          border: `1px solid ${colors.soap300}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${EXPECTED_VIEW_FIELDS.length}, 1fr)`,
            backgroundColor: colors.soap100,
            borderBottom: `1px solid ${colors.soap300}`,
            padding: '8px 12px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: colors.blackPepper500,
          }}
        >
          {EXPECTED_VIEW_FIELDS.map((f) => (
            <Box key={f}>{f}</Box>
          ))}
        </Box>
        {rows.length === 0 && (
          <Box padding="m">
            <BodyText size="small" color={colors.blackPepper400}>No rows.</BodyText>
          </Box>
        )}
        {rows.map((row, i) => (
          <Box
            key={(row.id as string) ?? i}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${EXPECTED_VIEW_FIELDS.length}, 1fr)`,
              padding: '8px 12px',
              fontSize: 12,
              borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${colors.soap200}`,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: colors.blackPepper600,
            }}
          >
            {EXPECTED_VIEW_FIELDS.map((field) => {
              const value = row[field];
              const isDrift = DRIFT_FIELDS.includes(field as (typeof DRIFT_FIELDS)[number]) && (value === undefined || value === null);
              if (isDrift) {
                return (
                  <Box
                    key={field}
                    style={{
                      backgroundColor: colors.cinnamon100,
                      color: colors.cinnamon600,
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontStyle: 'italic',
                      display: 'inline-block',
                      width: 'fit-content',
                    }}
                  >
                    missing (drift)
                  </Box>
                );
              }
              if (value === undefined || value === null) {
                return (
                  <Box key={field} style={{ color: colors.blackPepper300 }}>
                    -
                  </Box>
                );
              }
              const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
              return (
                <Box
                  key={field}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 8,
                  }}
                  title={text}
                >
                  {text}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function CallLogPanel({ log, onClear }: { log: CallLogEntry[]; onClear: () => void }) {
  return (
    <Box
      padding="l"
      style={{
        backgroundColor: colors.frenchVanilla100,
        borderRadius: SANA_CARD_RADIUS_LG,
        border: `1px solid ${colors.soap300}`,
        minHeight: 400,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center" marginBottom="m">
        <Heading size="small" marginY="zero" color={colors.blackPepper600}>
          Call log
        </Heading>
        <TertiaryButton onClick={onClear} disabled={log.length === 0}>
          Clear
        </TertiaryButton>
      </Flex>
      {log.length === 0 && (
        <BodyText size="small" color={colors.blackPepper400}>
          No calls yet. Fire one from the panel on the left.
        </BodyText>
      )}
      <Flex flexDirection="column" gap="s">
        {log.map((entry) => (
          <CallLogRow key={entry.id} entry={entry} />
        ))}
      </Flex>
    </Box>
  );
}

function CallLogRow({ entry }: { entry: CallLogEntry }) {
  const [open, setOpen] = useState(false);
  const statusColor =
    entry.status === null
      ? colors.blackPepper300
      : entry.ok
      ? colors.kiwi500
      : entry.status === 0
      ? colors.cinnamon500
      : colors.cantaloupe500;
  const emptyBodyDrift =
    (entry.method === 'POST' || entry.method === 'PATCH') &&
    entry.ok &&
    (entry.responseBody === null || entry.responseBody === '' || (typeof entry.responseBody === 'object' && entry.responseBody !== null && Object.keys(entry.responseBody as object).length === 0));

  return (
    <Box
      style={{
        border: `1px solid ${colors.soap300}`,
        borderRadius: 8,
        padding: 10,
        backgroundColor: colors.frenchVanilla100,
      }}
    >
      <Flex justifyContent="space-between" alignItems="center" gap="s">
        <Flex gap="s" alignItems="center" style={{ minWidth: 0, flex: 1 }}>
          <Box
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 700,
              color: colors.frenchVanilla100,
              backgroundColor: statusColor,
              minWidth: 48,
              textAlign: 'center',
            }}
          >
            {entry.method}
          </Box>
          <Box style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, color: colors.blackPepper600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }} title={entry.url}>
            {entry.url}
          </Box>
        </Flex>
        <Flex gap="xs" alignItems="center" style={{ flexShrink: 0 }}>
          <BodyText size="small" color={colors.blackPepper400}>
            {entry.status === null ? '…' : entry.status}
          </BodyText>
          {entry.durationMs !== null && (
            <BodyText size="small" color={colors.blackPepper400}>
              {entry.durationMs}ms
            </BodyText>
          )}
          <TertiaryButton onClick={() => setOpen((o) => !o)} size="small">
            {open ? 'Hide' : 'Inspect'}
          </TertiaryButton>
        </Flex>
      </Flex>
      {emptyBodyDrift && (
        <Box marginTop="xs">
          <StatusIndicator type={StatusIndicatorType.Orange} emphasis={StatusIndicatorEmphasis.Low} label="2xx with empty body (known drift)" />
        </Box>
      )}
      {entry.error && (
        <Box marginTop="xs">
          <BodyText size="small" color={colors.cinnamon500}>
            Error: {entry.error}
          </BodyText>
        </Box>
      )}
      {open && (
        <Box marginTop="s">
          {entry.requestBody !== undefined && (
            <Box marginBottom="xxs">
              <BodyText size="small" color={colors.blackPepper400} style={{ fontWeight: 600 }}>
                Request body
              </BodyText>
              <pre style={prePreStyle}>{JSON.stringify(entry.requestBody, null, 2)}</pre>
            </Box>
          )}
          <Box>
            <BodyText size="small" color={colors.blackPepper400} style={{ fontWeight: 600 }}>
              Response body
            </BodyText>
            <pre style={prePreStyle}>{entry.responseBody === null || entry.responseBody === undefined ? '(empty)' : typeof entry.responseBody === 'string' ? entry.responseBody : JSON.stringify(entry.responseBody, null, 2)}</pre>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function LabelledInput({
  label,
  id,
  value,
  onChange,
  placeholder,
  fullWidth,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}) {
  return (
    <Box style={{ minWidth: 160, flex: fullWidth ? 1 : undefined, width: fullWidth ? '100%' : undefined }}>
      <BodyText
        as="label"
        size="small"
        color={colors.blackPepper500}
        style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}
      >
        <label htmlFor={id}>{label}</label>
      </BodyText>
      <TextInput
        id={id}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        style={fullWidth ? { width: '100%' } : undefined}
      />
    </Box>
  );
}

function LabelledTextarea({
  label,
  id,
  value,
  onChange,
  minHeight,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  minHeight: number;
}) {
  return (
    <Box>
      <BodyText
        size="small"
        color={colors.blackPepper500}
        style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}
      >
        <label htmlFor={id}>{label}</label>
      </BodyText>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          minHeight,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
          padding: 10,
          borderRadius: 6,
          border: `1px solid ${colors.soap400}`,
          resize: 'vertical',
        }}
      />
    </Box>
  );
}

const prePreStyle: React.CSSProperties = {
  backgroundColor: colors.soap100,
  border: `1px solid ${colors.soap300}`,
  borderRadius: 6,
  padding: 10,
  fontSize: 11,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  color: colors.blackPepper600,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  maxHeight: 280,
  overflow: 'auto',
  margin: 0,
};

export default OffersPlaygroundV01;
