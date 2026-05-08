/**
 * E2E clickable walkthrough — 2-Way Email Recruiting (Figma `HpAOHGAeXBORpHnyhsCMja`).
 * Opens on **Cover** (step 1); includes **feature highlights** (6887:23551), **field-level invalid email**
 * (6887:18369), **collapsed Not Delivered** thread row (6913:20249), **inbound-expanded-read** (7064:12437),
 * **audience filters + empty** (6887:12040 / 6887:20380), **hover + expand read** (6887:13504 / 6887:12795),
 * and hash routing `#e2e-2way-email-recruiting-v01/<stepKey>`.
 */

import React, { useMemo, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@workday/canvas-kit-react/button';
import { SystemIcon } from '@workday/canvas-kit-react/icon';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Heading, BodyText, Subtext } from '@workday/canvas-kit-react/text';
import { TextInput } from '@workday/canvas-kit-react/text-input';
import { StatusIndicator } from '@workday/canvas-kit-react/status-indicator';
import { Table } from '@workday/canvas-kit-react/table';
import { colors } from '@workday/canvas-kit-react/tokens';
import { plusIcon } from '@workday/canvas-system-icons-web';
import {
  WorkdayTopNav,
  TWEMAIL_DOC_CARD_RADIUS_LG,
  TWEMAIL_DOC_CARD_SHADOW,
  TWEMAIL_DOC_PAGE_BG,
  WORKDAY_TOP_NAV_HEIGHT_PX,
  CONV_EMAIL_THREAD_DIVIDER,
  CONV_EMAIL_THREAD_ROW_HOVER_BG,
  CONV_EMAIL_THREAD_SELECTED_BAR,
  CONV_EMAIL_THREAD_SELECTED_BG,
  protoDockIconButtonStyle,
  protoDockPrimaryButtonStyle,
} from './components';
import { buildTwoWayEmailPrototypeHref } from './2-way-email-prototype';

export type TwoWayEmailStep = {
  key: string;
  title: string;
  figmaNodeId: string;
  kind:
    | 'cover'
    | 'list'
    | 'thread'
    | 'compose'
    | 'modal-action'
    | 'error'
    | 'empty'
    | 'toolbar-extra'
    | 'threads'
    | 'expandedInbound'
    | 'audienceFilterDemo'
    | 'threadChromeDemo'
    | 'featureHighlights'
    | 'fieldError'
    | 'notDeliveredCollapsed';
};

const STEPS: TwoWayEmailStep[] = [
  { key: 'cover', title: 'Cover Page', figmaNodeId: '208:10116', kind: 'cover' },
  {
    key: 'feature-highlights',
    title: 'Feature highlights (feedback)',
    figmaNodeId: '6887:23551',
    kind: 'featureHighlights',
  },
  { key: 'my-conversations', title: 'MyConversations', figmaNodeId: '6887:11499', kind: 'list' },
  { key: 'overview', title: 'Overview', figmaNodeId: '6887:11657', kind: 'thread' },
  {
    key: 'inbound-expanded-read',
    title: 'Incoming email — expanded (Threads Linear)',
    figmaNodeId: '7064:12437',
    kind: 'expandedInbound',
  },
  { key: 'overview-long', title: 'Overview — long page', figmaNodeId: '6887:20294', kind: 'thread' },
  {
    key: 'collapsed-not-delivered',
    title: 'Collapsed Not Delivered (thread row)',
    figmaNodeId: '6913:20249',
    kind: 'notDeliveredCollapsed',
  },
  { key: 'overview-1089', title: 'Overview (extended)', figmaNodeId: '6971:21750', kind: 'thread' },
  { key: 'recipient-threads', title: "Recipient's View — Threads", figmaNodeId: '6887:13469', kind: 'thread' },
  {
    key: 'audience-filter-empty',
    title: 'Filters — All / Candidate / Agency & empty inbox',
    figmaNodeId: '6887:12040',
    kind: 'audienceFilterDemo',
  },
  {
    key: 'thread-hover-expand-read',
    title: 'Hover states & expand / read email',
    figmaNodeId: '6887:12795',
    kind: 'threadChromeDemo',
  },
  { key: 'compose', title: 'Compose', figmaNodeId: '6887:14115', kind: 'compose' },
  { key: 'reply', title: 'Reply', figmaNodeId: '6887:15547', kind: 'compose' },
  { key: 'forward', title: 'Forward', figmaNodeId: '6887:16008', kind: 'compose' },
  { key: 'discard', title: 'Discard', figmaNodeId: '6887:15086', kind: 'modal-action' },
  {
    key: 'field-level-invalid-email',
    title: 'Field-level error — Invalid email',
    figmaNodeId: '6887:18369',
    kind: 'fieldError',
  },
  { key: 'err-no-recipient', title: 'Error — No Recipient', figmaNodeId: '6887:18849', kind: 'error' },
  { key: 'err-multiple', title: 'Error — Multiple', figmaNodeId: '6887:19329', kind: 'error' },
  { key: 'empty-agency', title: 'Empty State (Agency)', figmaNodeId: '6887:20380', kind: 'empty' },
  { key: 'empty-no-agency', title: 'Empty State (No Agency)', figmaNodeId: '6887:20754', kind: 'empty' },
  { key: 'empty-expanded', title: 'Empty State (Expanded)', figmaNodeId: '6887:21131', kind: 'empty' },
  { key: 'action-bar', title: 'Action Bar', figmaNodeId: '6887:21505', kind: 'toolbar-extra' },
  { key: 'threads-stepper', title: 'Threads — Stepper / Reddit', figmaNodeId: '7063:28486', kind: 'threads' },
];

function canonicalPrototypeHrefForStep(stepKey: string): string {
  const presets: Record<string, Record<string, string>> = {
    cover: { proto: '1', panel: '0', surface: 'list', nav: 'overview' },
    'feature-highlights': { proto: '1', panel: '0', surface: 'list' },
    'my-conversations': { proto: '1', panel: '1', surface: 'list' },
    overview: { proto: '1', panel: '1', surface: 'list' },
    'inbound-expanded-read': { proto: '1', panel: '1', surface: 'split', thread: '1', audience: 'candidate' },
    'overview-long': { proto: '1', panel: '1', surface: 'split', thread: '1' },
    'collapsed-not-delivered': { proto: '1', panel: '1', surface: 'split', thread: '4', error: 'generic' },
    'overview-1089': { proto: '1', panel: '1', surface: 'split', thread: '1' },
    'recipient-threads': { proto: '1', panel: '1', surface: 'split', thread: '2' },
    'audience-filter-empty': { proto: '1', panel: '1', surface: 'empty', audience: 'candidate' },
    'thread-hover-expand-read': { proto: '1', panel: '1', surface: 'split', thread: '1' },
    compose: { proto: '1', panel: '1', surface: 'compose', composePlace: 'begin' },
    reply: { proto: '1', panel: '1', surface: 'compose', composePlace: 'begin' },
    forward: { proto: '1', panel: '1', surface: 'compose', composePlace: 'begin' },
    discard: { proto: '1', panel: '1', surface: 'compose' },
    'field-level-invalid-email': { proto: '1', panel: '1', surface: 'compose' },
    'err-no-recipient': { proto: '1', panel: '1', surface: 'compose' },
    'err-multiple': { proto: '1', panel: '1', surface: 'compose' },
    'empty-agency': { proto: '1', panel: '1', surface: 'empty', audience: 'agency' },
    'empty-no-agency': { proto: '1', panel: '1', surface: 'empty', audience: 'all' },
    'empty-expanded': { proto: '1', panel: '1', surface: 'empty' },
    'action-bar': { proto: '1', panel: '1', surface: 'split', thread: '1', nav: 'summary' },
    'threads-stepper': { proto: '1', panel: '1', surface: 'split', thread: '3' },
  };
  return buildTwoWayEmailPrototypeHref(presets[stepKey] ?? { proto: '1', panel: '0', surface: 'list' });
}

function figmaDeepLink(nodeId: string): string {
  return `https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=${nodeId.replace(':', '-')}`;
}

function cardShellWide(children: React.ReactNode): JSX.Element {
  return (
    <Box
      padding="xl"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: TWEMAIL_DOC_CARD_RADIUS_LG,
        boxShadow: TWEMAIL_DOC_CARD_SHADOW,
        border: `1px solid ${colors.soap300}`,
        maxWidth: 1200,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
}

function cardShell(children: React.ReactNode): JSX.Element {
  return (
    <Box
      padding="xl"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: TWEMAIL_DOC_CARD_RADIUS_LG,
        boxShadow: TWEMAIL_DOC_CARD_SHADOW,
        border: `1px solid ${colors.soap300}`,
        maxWidth: 960,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
}

function AudienceFilterStepDemo(): JSX.Element {
  const [filter, setFilter] = useState<'all' | 'candidate' | 'agency'>('all');
  return (
    <>
      <BodyText size="small" style={{ marginTop: 12 }}>
        Interactive stub — aligns with India dock filters (Figma{' '}
        <a href={figmaDeepLink('6887:12040')} target="_blank" rel="noreferrer">
          6887:12040
        </a>
        ). Empty Candidate / Agency inbox (Figma{' '}
        <a href={figmaDeepLink('6887:20380')} target="_blank" rel="noreferrer">
          6887:20380
        </a>
        ): use <strong>Empty inbox (demo)</strong> on{' '}
        <strong>#2-way-email-prototype</strong> (legacy <strong>#india-candidate-profile-email-v92</strong>).
      </BodyText>
      <Flex marginTop="m" gap="xs" flexWrap="wrap">
        {(['all', 'candidate', 'agency'] as const).map((f) => (
          <SecondaryButton
            key={f}
            size="small"
            onClick={() => setFilter(f)}
            style={
              filter === f
                ? {
                    backgroundColor: CONV_EMAIL_THREAD_SELECTED_BG,
                    borderColor: CONV_EMAIL_THREAD_SELECTED_BAR,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    fontWeight: 700,
                  }
                : undefined
            }
          >
            {f === 'all' ? 'All' : f === 'candidate' ? 'Candidate' : 'Agency'}
          </SecondaryButton>
        ))}
      </Flex>
      <Subtext size="small" style={{ marginTop: 'm' }}>
        Selected: <strong>{filter}</strong>
      </Subtext>
    </>
  );
}

function FeatureHighlightsStepDemo(): JSX.Element {
  const [gotIt, setGotIt] = useState(false);
  if (gotIt) {
    return (
      <BodyText size="small" style={{ marginTop: 12, color: colors.blackPepper500 }}>
        You chose <strong>Got it</strong> for this step — highlights stay dismissed until you leave and return (stub only).
      </BodyText>
    );
  }
  return (
    <>
      <BodyText size="small" style={{ marginTop: 12 }}>
        Feedback-driven highlights (Figma{' '}
        <a href={figmaDeepLink('6887:23551')} target="_blank" rel="noreferrer">
          6887:23551
        </a>
        ).
      </BodyText>
      <Flex as="ul" marginTop="m" flexDirection="column" gap="s" style={{ margin: '16px 0 0', paddingLeft: 20 }}>
        <BodyText as="li" size="small" style={{ margin: 0, display: 'list-item' }}>
          Filter conversations by Candidate vs Agency from the mail dock.
        </BodyText>
        <BodyText as="li" size="small" style={{ margin: 0, display: 'list-item' }}>
          Compose two-way email with preview and delivery outcomes on the India prototype.
        </BodyText>
        <BodyText as="li" size="small" style={{ margin: 0, display: 'list-item' }}>
          Spot failed delivery in the thread list before opening details.
        </BodyText>
      </Flex>
      <Flex marginTop="l">
        <SecondaryButton size="small" onClick={() => setGotIt(true)}>
          Got it
        </SecondaryButton>
      </Flex>
    </>
  );
}

function NotDeliveredCollapsedDemo(): JSX.Element {
  return (
    <>
      <BodyText size="small" style={{ marginTop: 12 }}>
        Collapsed thread row when delivery fails (Figma{' '}
        <a href={figmaDeepLink('6913:20249')} target="_blank" rel="noreferrer">
          6913:20249
        </a>
        ). Full interactive list:{' '}
        <a href="#2-way-email-prototype">2-way email prototype → Email dock</a>.
      </BodyText>
      <Box
        marginTop="m"
        style={{
          maxWidth: 320,
          border: `1px solid ${colors.soap300}`,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: colors.frenchVanilla100,
        }}
      >
        <Box padding="xs" style={{ borderBottom: `1px solid ${colors.soap300}`, backgroundColor: colors.soap100 }}>
          <BodyText size="small" fontWeight="bold" style={{ margin: 0 }}>
            Threads
          </BodyText>
        </Box>
        <button
          type="button"
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '12px 14px',
            border: 'none',
            borderBottom: `1px solid ${CONV_EMAIL_THREAD_DIVIDER}`,
            cursor: 'pointer',
            backgroundColor: CONV_EMAIL_THREAD_SELECTED_BG,
            borderLeft: `3px solid ${CONV_EMAIL_THREAD_SELECTED_BAR}`,
          }}
        >
          <Flex alignItems="center" gap="xs" flexWrap="wrap">
            <StatusIndicator type={StatusIndicator.Type.Red} emphasis={StatusIndicator.Emphasis.Low} label="Not delivered" />
            <BodyText size="small" fontWeight="bold" style={{ margin: 0 }}>
              Interview confirmation
            </BodyText>
          </Flex>
          <Subtext size="small" style={{ marginTop: 6, display: 'block', color: colors.cinnamon600 }}>
            Could not deliver — mailbox unavailable…
          </Subtext>
          <Subtext size="small" style={{ marginTop: 4 }}>
            Mon
          </Subtext>
        </button>
      </Box>
    </>
  );
}

function ThreadChromeStepDemo(): JSX.Element {
  const [hover, setHover] = useState<number | null>(null);
  const [readingExpanded, setReadingExpanded] = useState(false);
  return (
    <>
      <BodyText size="small" style={{ marginTop: 12 }}>
        Expand panel + read detail (Figma{' '}
        <a href={figmaDeepLink('6887:12795')} target="_blank" rel="noreferrer">
          6887:12795
        </a>
        ). Row hover (Figma{' '}
        <a href={figmaDeepLink('6887:13504')} target="_blank" rel="noreferrer">
          6887:13504
        </a>
        ) — hover a stub row below.
      </BodyText>
      <Flex marginTop="m" gap="m" flexWrap="wrap" alignItems="stretch">
        {!readingExpanded ? (
          <Box
            style={{
              width: 240,
              flexShrink: 0,
              border: `1px solid ${colors.soap300}`,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: colors.frenchVanilla100,
            }}
          >
            {[1, 2].map((i) => (
              <Box
                key={i}
                padding="s"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{
                  borderBottom: `1px solid ${CONV_EMAIL_THREAD_DIVIDER}`,
                  backgroundColor: hover === i ? CONV_EMAIL_THREAD_ROW_HOVER_BG : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <BodyText size="small" style={{ margin: 0 }}>
                  Email stub {i}
                </BodyText>
                <Subtext size="small" style={{ marginTop: 4 }}>
                  Preview line…
                </Subtext>
              </Box>
            ))}
          </Box>
        ) : null}
        <Box flex={1} style={{ minWidth: 260 }}>
          <SecondaryButton size="small" onClick={() => setReadingExpanded((e) => !e)}>
            {readingExpanded ? 'Show thread list' : 'Expand reading pane'}
          </SecondaryButton>
          <Box marginTop="s" padding="m" style={{ backgroundColor: colors.soap100, borderRadius: 8, minHeight: 120 }}>
            <BodyText size="small" style={{ margin: 0, lineHeight: 1.6 }}>
              Reading pane — matches India dock behavior after selecting a thread. Collapse the list with Expand for a
              wider read view (prototype stub).
            </BodyText>
          </Box>
        </Box>
      </Flex>
    </>
  );
}

function ScreenBody({
  step,
  onStart,
  onOpenOverview,
}: {
  step: TwoWayEmailStep;
  onStart: () => void;
  onOpenOverview: () => void;
}): JSX.Element {
  switch (step.kind) {
    case 'cover':
      return (
        <>
          <Heading size="large">2-Way Conversational Email</Heading>
          <BodyText size="medium" style={{ marginTop: 12 }}>
            Click-through of canonical Figma frames — stub UI; refine against exports or design context when
            available.
          </BodyText>
          <Flex marginTop="l" gap="s">
            <button type="button" onClick={onStart} style={protoDockPrimaryButtonStyle()}>
              Start → MyConversations
            </button>
          </Flex>
        </>
      );
    case 'list':
      return (
        <>
          <Heading size="medium">My conversations</Heading>
          <Box marginTop="m" style={{ overflowX: 'auto' }}>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header scope="col">Subject</Table.Header>
                  <Table.Header scope="col">Candidate</Table.Header>
                  <Table.Header scope="col">Updated</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Re: Invitation for an Interview</Table.Cell>
                  <Table.Cell>Chloe Clarkson</Table.Cell>
                  <Table.Cell>Today</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Follow-up on application</Table.Cell>
                  <Table.Cell>Alex Morgan</Table.Cell>
                  <Table.Cell>Yesterday</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
          <Flex marginTop="l" gap="s">
            <button type="button" onClick={onOpenOverview} style={protoDockPrimaryButtonStyle()}>
              Open Overview →
            </button>
          </Flex>
        </>
      );
    case 'thread':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <Box
            marginTop="m"
            padding="l"
            style={{
              backgroundColor: colors.soap100,
              borderRadius: 12,
              border: `1px solid ${colors.soap300}`,
              minHeight: 220,
            }}
          >
            <BodyText size="small" fontWeight="bold">
              Thread preview (stub)
            </BodyText>
            <BodyText size="small" style={{ marginTop: 12 }}>
              From: recruiter@gms.com · To: candidate@email.com
            </BodyText>
            <BodyText size="medium" style={{ marginTop: 16 }}>
              Hi — sharing next steps for your interview loop.
            </BodyText>
          </Box>
          <Flex marginTop="l" gap="s" flexWrap="wrap">
            <SecondaryButton>Reply</SecondaryButton>
            <SecondaryButton>Forward</SecondaryButton>
            <button type="button" aria-label="More actions" style={protoDockIconButtonStyle()}>
              <SystemIcon icon={plusIcon} size={24} color={colors.blackPepper400} />
            </button>
          </Flex>
        </>
      );
    case 'compose':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
            <Box marginTop="m" style={{ maxWidth: 560 }}>
              <label htmlFor="tw-to" style={{ display: 'block' }}>
                <Subtext size="small">To</Subtext>
              </label>
              <TextInput id="tw-to" value="candidate@example.com" onChange={() => undefined} />
              <Box marginTop="s">
                <label htmlFor="tw-subject" style={{ display: 'block' }}>
                  <Subtext size="small">Subject</Subtext>
                </label>
                <TextInput id="tw-subject" value="Re: Invitation for an Interview" onChange={() => undefined} />
              </Box>
              <Box marginTop="s">
                <label htmlFor="tw-body" style={{ display: 'block' }}>
                  <Subtext size="small">Message</Subtext>
                </label>
                <TextInput
                  id="tw-body"
                  value="Thanks — here is the Zoom link for Wednesday at 2pm PT."
                  onChange={() => undefined}
                />
              </Box>
            </Box>
          <Flex marginTop="l" gap="s">
            <PrimaryButton>Send</PrimaryButton>
            <SecondaryButton>Save draft</SecondaryButton>
          </Flex>
        </>
      );
    case 'modal-action':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <BodyText size="small" style={{ marginTop: 12 }}>
            Discard this draft and return to the thread?
          </BodyText>
          <Flex marginTop="l" gap="s">
            <PrimaryButton>Discard</PrimaryButton>
            <SecondaryButton>Keep editing</SecondaryButton>
          </Flex>
        </>
      );
    case 'featureHighlights':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <FeatureHighlightsStepDemo />
        </>
      );
    case 'fieldError':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <BodyText size="small" style={{ marginTop: 12 }}>
            Field-level validation (Figma{' '}
            <a href={figmaDeepLink('6887:18369')} target="_blank" rel="noreferrer">
              6887:18369
            </a>
            ) — inline error under <strong>To</strong>, not only a page-level alert.
          </BodyText>
          <Box marginTop="m" style={{ maxWidth: 420 }}>
            <label htmlFor="tw-to-err" style={{ display: 'block' }}>
              <Subtext size="small">To</Subtext>
            </label>
            <TextInput
              id="tw-to-err"
              value="not-a-valid-email"
              onChange={() => undefined}
              style={{
                marginTop: 4,
                borderColor: colors.cinnamon500,
                boxShadow: `0 0 0 1px ${colors.cinnamon500}`,
              }}
            />
            <Subtext size="small" style={{ marginTop: 8, color: colors.cinnamon600 }}>
              Enter a valid email address
            </Subtext>
          </Box>
          <Flex marginTop="l" gap="s">
            <PrimaryButton>Send</PrimaryButton>
            <SecondaryButton>Cancel</SecondaryButton>
          </Flex>
        </>
      );
    case 'notDeliveredCollapsed':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <NotDeliveredCollapsedDemo />
        </>
      );
    case 'error':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <Box
            marginTop="m"
            padding="m"
            role="alert"
            style={{
              backgroundColor: colors.cantaloupe100,
              border: `1px solid ${colors.cantaloupe400}`,
              borderRadius: 8,
            }}
          >
            <BodyText size="medium" fontWeight="bold">
              We could not send this message
            </BodyText>
            <BodyText size="small" style={{ marginTop: 8 }}>
              Fix the highlighted fields and try again.
            </BodyText>
          </Box>
          <Flex marginTop="l" gap="s">
            <SecondaryButton>Back to compose</SecondaryButton>
          </Flex>
        </>
      );
    case 'empty':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <Flex
            marginTop="xl"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            style={{ minHeight: 160 }}
          >
            <BodyText size="medium" style={{ color: colors.blackPepper400 }}>
              No conversations match your filters yet.
            </BodyText>
            <button type="button" style={{ ...protoDockPrimaryButtonStyle(), marginTop: 16 }}>
              Adjust filters
            </button>
          </Flex>
        </>
      );
    case 'toolbar-extra':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <BodyText size="small" style={{ marginTop: 12 }}>
            Extended actions strip (stub) — see India profile for bottom bar + dock stacking (Figma 6887:21505).
          </BodyText>
          <Flex marginTop="m" gap="xs" flexWrap="wrap">
            <SecondaryButton size="small">Pin</SecondaryButton>
            <SecondaryButton size="small">Assign</SecondaryButton>
            <SecondaryButton size="small">Templates</SecondaryButton>
          </Flex>
        </>
      );
    case 'threads':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <Box marginTop="m" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                padding="m"
                style={{
                  borderLeft: `4px solid ${CONV_EMAIL_THREAD_SELECTED_BAR}`,
                  backgroundColor: colors.soap100,
                  borderRadius: 8,
                }}
              >
                <BodyText size="small" fontWeight="bold">
                  Message {i}
                </BodyText>
                <BodyText size="small" style={{ marginTop: 8 }}>
                  Stub thread body — align with Figma frame {step.figmaNodeId}.
                </BodyText>
              </Box>
            ))}
          </Box>
        </>
      );
    case 'expandedInbound':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <Subtext size="small" style={{ marginTop: 8 }}>
            Simulates recruiter expanding an inbound message from the thread list (Figma{' '}
            <strong>7064:12437</strong> — Threads Linear).
          </Subtext>
          <Flex marginTop="l" gap="m" flexWrap="wrap" alignItems="stretch">
            <Box
              style={{
                width: 280,
                flexShrink: 0,
                border: `1px solid ${colors.soap300}`,
                borderRadius: 8,
                backgroundColor: colors.frenchVanilla100,
                overflow: 'hidden',
              }}
            >
              <Box padding="xs" style={{ borderBottom: `1px solid ${colors.soap300}`, backgroundColor: colors.soap100 }}>
                <BodyText size="small" fontWeight="bold">
                  Thread
                </BodyText>
              </Box>
              <Box as="ul" padding="zero" margin="zero" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {[
                  { sub: 'Re: Interview invitation', sel: true },
                  { sub: 'Application received', sel: false },
                  { sub: 'Earlier: Thank you for applying', sel: false },
                ].map((row) => (
                  <Box
                    key={row.sub}
                    as="li"
                    padding="s"
                    style={{
                      borderBottom: `1px solid ${CONV_EMAIL_THREAD_DIVIDER}`,
                      cursor: 'pointer',
                      backgroundColor: row.sel ? CONV_EMAIL_THREAD_SELECTED_BG : 'transparent',
                      borderLeft: row.sel ? `3px solid ${CONV_EMAIL_THREAD_SELECTED_BAR}` : '3px solid transparent',
                    }}
                  >
                    <BodyText size="small" fontWeight={row.sel ? 'bold' : 'normal'}>
                      {row.sub}
                    </BodyText>
                    <Subtext size="small" style={{ marginTop: 4 }}>Chloe Clarkson · Inbound</Subtext>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              flex={1}
              style={{
                minWidth: 280,
                minHeight: 320,
                border: `1px solid ${colors.soap300}`,
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                padding: 'l',
                display: 'flex',
                flexDirection: 'column',
                gap: 'm',
              }}
            >
              <Heading size="small" style={{ margin: 0 }}>
                Re: Invitation for an Interview
              </Heading>
              <Box>
                <Subtext size="small">From: Chloe Clarkson &lt;chloe.clarkson@email.com&gt;</Subtext>
                <Box marginTop="xxs">
                  <Subtext size="small">To: Rachel Vaccaro &lt;rachel.vaccaro@email.com&gt;</Subtext>
                </Box>
                <Box marginTop="xxs">
                  <Subtext size="small">11/12/2026, 9:14 AM</Subtext>
                </Box>
              </Box>
              <Box padding="m" style={{ backgroundColor: colors.soap100, borderRadius: 8, flex: 1, minHeight: 120 }}>
                <BodyText size="small" style={{ margin: 0, lineHeight: 1.6 }}>
                  Hi Rachel — thank you for the invite. I am available Wednesday afternoon for a Zoom interview. Please
                  send the calendar hold and let me know if you need anything else from my side.
                </BodyText>
              </Box>
              <Flex gap="s" flexWrap="wrap">
                <SecondaryButton size="small">Reply</SecondaryButton>
                <SecondaryButton size="small">Forward</SecondaryButton>
              </Flex>
            </Box>
          </Flex>
        </>
      );
    case 'audienceFilterDemo':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <AudienceFilterStepDemo />
        </>
      );
    case 'threadChromeDemo':
      return (
        <>
          <Heading size="medium">{step.title}</Heading>
          <ThreadChromeStepDemo />
        </>
      );
    default:
      return <BodyText size="small">Unknown step.</BodyText>;
  }
}

export default function E2eTwoWayEmailRecruitingV01(): JSX.Element {
  const initialIndex = useMemo(() => {
    const h = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';
    const stepPart = h.split('&')[0];
    const prefix = 'e2e-2way-email-recruiting-v01/';
    if (stepPart.startsWith(prefix)) {
      const key = stepPart.slice(prefix.length);
      const i = STEPS.findIndex((s) => s.key === key);
      if (i >= 0) return i;
    }
    return 0;
  }, []);

  const [idx, setIdx] = useState(initialIndex);
  const step = STEPS[idx];
  const total = STEPS.length;

  const setHashForIndex = (next: number) => {
    const s = STEPS[next];
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#e2e-2way-email-recruiting-v01/${s.key}`
    );
  };

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setIdx(clamped);
    setHashForIndex(clamped);
  };

  const jumpToKey = (key: string) => {
    const i = STEPS.findIndex((s) => s.key === key);
    if (i >= 0) go(i);
  };

  const ix = (key: string) => STEPS.findIndex((s) => s.key === key);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: TWEMAIL_DOC_PAGE_BG }}>
      <WorkdayTopNav
        variant="app"
        searchValue=""
        onSearchChange={() => undefined}
        tenantLabel="Recruiting"
        inboxBadge={3}
        notificationBadge={12}
      />
      <Flex alignItems="stretch" style={{ minHeight: `calc(100vh - ${WORKDAY_TOP_NAV_HEIGHT_PX}px)` }}>
        <Box
          as="nav"
          aria-label="Screens"
          padding="m"
          style={{
            width: 280,
            flexShrink: 0,
            borderRight: `1px solid ${colors.soap300}`,
            backgroundColor: '#FFFFFF',
            overflowY: 'auto',
          }}
        >
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => go(i)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 10px',
                marginBottom: 4,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'inherit',
                backgroundColor: i === idx ? CONV_EMAIL_THREAD_SELECTED_BG : 'transparent',
                color: colors.blackPepper600,
              }}
            >
              <span style={{ fontWeight: i === idx ? 700 : 400 }}>{i + 1}. </span>
              {s.title}
            </button>
          ))}
        </Box>
        <Flex flex={1} flexDirection="column" padding="xl" style={{ minWidth: 0 }}>
          <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap="m">
            <div>
              <Heading size="large">{step.title}</Heading>
              <Subtext size="small" style={{ marginTop: 6 }}>
                Figma{' '}
                <a href={figmaDeepLink(step.figmaNodeId)} target="_blank" rel="noreferrer">
                  {step.figmaNodeId}
                </a>
              </Subtext>
            </div>
            <label style={{ fontSize: 13, color: colors.blackPepper500 }}>
              Jump to{' '}
              <select
                value={step.key}
                onChange={(e) => jumpToKey(e.target.value)}
                style={{ marginLeft: 8, padding: '6px 8px', borderRadius: 8, border: `1px solid ${colors.soap300}` }}
              >
                {STEPS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
          </Flex>

          <Box
            marginTop="m"
            padding="m"
            style={{
              maxWidth: 960,
              backgroundColor: colors.soap100,
              border: `1px solid ${colors.soap300}`,
              borderRadius: 8,
            }}
          >
            <BodyText size="small" style={{ margin: 0, lineHeight: 1.5, color: colors.blackPepper600 }}>
              <strong>Non-canonical gallery:</strong> the card below is a documentation stub. For Figma-faithful
              CommunicationDock, list/reading, compose, and the bottom-left Prototype Control panel, open the{' '}
              <a href={canonicalPrototypeHrefForStep(step.key)} rel="noreferrer">
                canonical <code>#2-way-email-prototype</code> preset
              </a>{' '}
              (hash query includes <code>proto=1</code> so the control panel is visible outside dev).
            </BodyText>
          </Box>

          <Flex marginTop="l" flexDirection="column" alignItems="flex-start" gap="l">
            {(step.kind === 'expandedInbound' || step.kind === 'notDeliveredCollapsed' ? cardShellWide : cardShell)(
              <ScreenBody
                step={step}
                onStart={() => go(ix('my-conversations'))}
                onOpenOverview={() => go(ix('overview'))}
              />
            )}
            <Flex gap="s" flexWrap="wrap" alignItems="center">
              <SecondaryButton onClick={() => go(idx - 1)} disabled={idx === 0}>
                Previous
              </SecondaryButton>
              <button
                type="button"
                onClick={() => go(idx + 1)}
                disabled={idx >= total - 1}
                style={{
                  ...protoDockPrimaryButtonStyle(),
                  ...(idx >= total - 1 ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
                }}
              >
                Next
              </button>
              <BodyText size="small" style={{ color: colors.blackPepper400 }}>
                Step {idx + 1} / {total}
              </BodyText>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
