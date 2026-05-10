/**
 * 2-way email recruiting — candidate profile prototype
 *
 * **Onboarding:** Anchored **Introducing Conversational Email** popover near the mail rail — **every full page refresh** resets to this opening canvas (hash query normalized to defaults); dismissing the popover persists until you refresh. Canonical copy matches Overview-9.
 * **Mail rail:** **Conversational Email** panel — thread list shows **one row per conversation**; **full threading** (stacked messages, Reply/Forward per message) lives in the **reading pane** only when `threadMessages` is set.
 * **Workspace dim:** Full-viewport semi-transparent scrim below the global header (`top: HEADER_H`) over recruiting rail, candidate blue nav, and profile when the dock is wide; top nav stays bright. Collaboration dock stays above the scrim.
 * **Compose:** templates link, rich-text toolbar, body placeholder — parity vs PM Compose PNG (`design/reference-screens/2way-email-refs/Compose-*.png`).
 * **Decision action bar:** [6887:21505](https://www.figma.com/design/HpAOHGAeXBORpHnyhsCMja/2-Way-Email_Recruiting_12_2024?node-id=6887-21505).
 *
 * Routes:
 *   - **`#conversational-email-prototype`** — bookmark slug only (this hash is preferred when normalizing); **same opening reset on refresh** as `#2-way-email-prototype`.
 *   - `#2-way-email-prototype` — full prototype (legacy `#india-candidate-profile-email-v92` supported)
 * Mission: INDIA-E2E-006
 * PRD: docs/prds/india-candidate-profile-email-conversation-prd.md
 */
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useLayoutEffect,
  useId,
  type CSSProperties,
  type RefObject,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import type { CanvasSystemIcon } from '@workday/design-assets-types';
import {
  Card,
  Flex,
  Box,
  Heading,
  BodyText,
  Subtext,
  Avatar,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  ToolbarIconButton,
  Table,
  TwFormSelect,
  TwFormTextInput,
  TwModal,
  TwIcon,
  TW,
  SPACE,
  twProfileCardStyle,
  AlertBanner,
  ComposeInlineErrorSummary,
} from './components/twemail';
import './two-way-email-reading-pane.css';
import {
  chevronDownSmallIcon,
  chevronLeftSmallIcon,
  chevronRightSmallIcon,
  exclamationCircleIcon,
  fileIcon,
  locationIcon,
  mailIcon,
  phoneIcon,
  shrinkIcon,
  chartIcon,
  clockIcon,
  alarmClockIcon,
  inboxIcon,
  justifyIcon,
  messagingIcon,
  pdfIcon,
  notificationsIcon,
  relatedActionsIcon,
  searchIcon,
  tagIcon,
  speechBubbleIcon,
  userIcon,
  noteIcon,
  documentIcon,
  xIcon,
} from '@workday/canvas-system-icons-web';
import { CommunicationDock, RichTextEditor } from './components';
import {
  TWEMAIL_DIVIDER,
  TWEMAIL_DIVIDER_SUBTLE,
  TWEMAIL_DOC_CARD_SHADOW,
  TWEMAIL_PANEL_SHADOW,
  TWEMAIL_THREAD_LIST_CANVAS_BG,
} from './components/twoWayEmailDesignTokens';
import {
  CONV_EMAIL_RAIL_BADGE_BG,
  CONV_EMAIL_RAIL_BADGE_FG,
  CONV_EMAIL_RAIL_ICON_ACTIVE,
  CONV_EMAIL_RAIL_ICON_IDLE,
  CONV_EMAIL_RAIL_TILE_ACTIVE_BG,
  CONV_EMAIL_RAIL_TILE_RADIUS_PX,
  CONV_EMAIL_THREAD_DIVIDER,
  CONV_EMAIL_THREAD_ROW_HOVER_BG,
  CONV_EMAIL_THREAD_SELECTED_BAR,
  CONV_EMAIL_THREAD_SELECTED_BG,
  protoDockIconButtonStyle,
  protoDockPopoverCloseButtonStyle,
  protoDockPrimaryButtonStyle,
} from './components/conversationalEmailPrototypeTheme';

/** Figma: global header height */
const HEADER_H = 64;
/** Sits above workspace dim & mail dock so the global chrome is never covered by modal scrims. */
const GLOBAL_HEADER_Z = 220;
/** Figma: recruiting icon rail */
const RECRUITING_RAIL_W = 65;
/** Figma: candidate chrome — narrow sidebar (`Screenshot_2026-05-08_at_16.12.11`). */
const CANDIDATE_MENU_W = 280;
/** Figma: collaboration panel total width */
const COLLAB_PANEL_W = 1000;
/** Figma: collaboration inner channel rail */
const COLLAB_RAIL_W = 64;
/** Gap between profile cards and fixed comm rail / dock — ~½ rail (`Screenshot_2026-05-08_at_16.13.13`). */
const COLLAB_DOCK_CONTENT_GUTTER_PX = 32;
/** Compose column width when dock is expanded (`COLLAB_PANEL_W` − rail). */
const COLLAB_SHEET_W = COLLAB_PANEL_W - COLLAB_RAIL_W;

/** List-first dock sheet — ~28% viewport (Figma Overview family). */
const dockSheetNarrowPx = (vw: number) => Math.min(480, Math.max(320, Math.round(vw * 0.28)));
/** Compose dock sheet — ~72% viewport minus rail (Figma Compose family). */
const dockSheetComposePx = (vw: number) => Math.min(1200, Math.max(COLLAB_SHEET_W, Math.round(vw * 0.72)));

/** PM capture: panel contract control — chevron toward viewport edge + vertical bar (outline rail). */
function RailPanelContractGlyph({ color }: { color: string }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      style={{ width: 24, height: 24, gap: 2, flexShrink: 0 }}
    >
      <TwIcon icon={chevronRightSmallIcon} size={18} color={color} />
      <Box
        style={{
          width: 2,
          height: 16,
          flexShrink: 0,
          backgroundColor: color,
          borderRadius: 0,
        }}
      />
    </Flex>
  );
}

/** Two overlapping speech-bubble outlines (Messaging channel). */
function RailDualSpeechBubbleGlyph({ color }: { color: string }) {
  return (
    <Box style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
      <Box style={{ position: 'absolute', left: 0, top: 6, opacity: 0.45, pointerEvents: 'none' }}>
        <TwIcon icon={speechBubbleIcon} size={17} color={color} />
      </Box>
      <Box style={{ position: 'absolute', left: 6, top: 1, pointerEvents: 'none' }}>
        <TwIcon icon={speechBubbleIcon} size={17} color={color} />
      </Box>
    </Box>
  );
}

/** Closed envelope — outline body + V flap (collaboration rail); matches simple line-art mail glyphs. */
function RailClassicEnvelopeGlyph({ color }: { color: string }) {
  const sw = 1.65;
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: 'block', flexShrink: 0, color }}
    >
      <path
        d="M5.25 8v8.75h13.5V8"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M5.25 8 12 13.5 18.75 8"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/** Full-viewport dim behind mail dock — above page chrome, below {@link COMMUNICATION_DOCK_Z} — Figma Overview modal scrim. */
const WORKSPACE_DIM_SCRIM_Z = 200;
/** Intro popover card — below global header; interactions stay on the card only (no full-screen dismiss scrim — it blocked dock clicks). */
const FEATURE_ONBOARDING_CARD_Z = 209;
/** Mail / compose sliding dock — above workspace dim & onboarding backdrop; **below** decision bar so Decline/Move Forward stays on top (6887:21505). */
const COMMUNICATION_DOCK_Z = 210;
/**
 * Bottom candidate decision bar (Decline / Move Forward) — **above** {@link COMMUNICATION_DOCK_Z} so it is not obscured by the 2-way email panel shadow/edge.
 * Below Prototype controls launcher (~241).
 */
const DECISION_ACTION_BAR_Z = 230;
const DECISION_ACTION_BAR_HEIGHT_PX = 72;

/** Recruiting chrome accent / candidate pane fill (`#0077D4`). */
const OVERVIEW_NAV_BLUE = '#0077D4';

/** Candidate profile blue pane — flat brand blue (Canvas Kit–aligned link blue). */
const CANDIDATE_MENU_BG = OVERVIEW_NAV_BLUE;
/** Quick-action icon discs — darker blue contrast on flat pane. */
const CANDIDATE_MENU_QUICK_ACTION_CIRCLE = '#0B5599';
/** Selected Summary/nav row — slightly darker than flat pane (`CANDIDATE_MENU_BG`), not high-contrast navy. */
const CANDIDATE_NAV_ROW_SELECTED_BG = '#0070CC';

/** Profile cards — label/value hierarchy vs canonical mock (bold labels, regular values). */
const PROFILE_FIELD_LABEL: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 700,
  color: TW.blackPepper600,
  lineHeight: 1.3,
};
const PROFILE_FIELD_VALUE: CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 400,
  color: TW.blackPepper400,
  lineHeight: 1.4,
};

/** Profile column canvas behind cards — Active Job Applications capture (`Screenshot_2026-05-08_at_16.11.01`). */
const PROFILE_COLUMN_CANVAS_BG = '#F3F4F6';
/** Job-application row link (chakra-style blue from reference). */
const ACTIVE_JOB_APPLICATION_LINK = '#3182CE';
const ACTIVE_JOB_APPLICATION_CARD_RADIUS_PX = 14;

/** Figma Overview-4 reading pane — metadata / typography rhythm. */
const READING_HEADER_NAME: CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: TW.blackPepper600,
  lineHeight: 1.3,
};
const READING_HEADER_TIME: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 400,
  color: TW.blackPepper300,
  lineHeight: 1.3,
};
const READING_META_ROW: CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.45,
  color: TW.blackPepper500,
};
const READING_SUBJECT: CSSProperties = {
  margin: 0,
  marginBottom: 10,
  fontSize: 16,
  fontWeight: 700,
  color: TW.blackPepper600,
  lineHeight: 1.3,
};
const READING_BODY: CSSProperties = {
  margin: 0,
  marginBottom: 16,
  fontSize: 14,
  lineHeight: 1.5,
  color: TW.blackPepper600,
  /** Preserve `\n` / `\n\n` from message bodies (HTML collapses them by default). */
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

/** Attachment chips — compact vs PM capture (`design-sm` parity). */
const READING_ATTACHMENT_GAP_PX = 8;
/** Chips size to content and sit side-by-side; do not grow to half row width (Figma reading pane). */
const ATTACHMENT_CHIP_MAX_WIDTH_PX = 280;
const READING_ATTACHMENT_CHIP_RADIUS_PX = 8;
const READING_ATTACHMENT_NAME: CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  color: TW.blackPepper600,
  lineHeight: 1.25,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
const READING_ATTACHMENT_META: CSSProperties = {
  margin: 0,
  marginTop: 2,
  fontSize: 11,
  fontWeight: 400,
  color: TW.blackPepper400,
  lineHeight: 1.3,
};

/** Reply / Forward — compact outline pills (design reference). */
const READING_REPLY_PILL: CSSProperties = {
  padding: '7px 18px',
  borderRadius: 999,
  border: `1px solid ${TW.blackPepper600}`,
  backgroundColor: TW.frenchVanilla100,
  color: TW.blackPepper600,
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  lineHeight: 1.2,
  boxSizing: 'border-box',
};

/** Initial compose subject for new mail; reset on discard confirmation. */
const DEFAULT_COMPOSE_SUBJECT = '';

/** Reference empty-state artwork — 3D paper plane (transparent PNG). */
const REF_EMPTY_STATE_PNG = new URL(
  './reference-screens/2way-email-refs/empty-state-paper-plane.png',
  import.meta.url,
).href;

/** Compose body — template-first variant (Figma Compose family). */
const COMPOSE_BODY_PLACEHOLDER_TEMPLATE = 'Select a template, or begin typing to add a message.';
/** Compose body — primary placeholder from latest Overview / Compose parity pass. */
const COMPOSE_BODY_PLACEHOLDER_BEGIN = 'Begin typing to add a message.';

/** Compose shell — parity vs Conversational Email compose capture (`Screenshot_2026-05-08_at_15.36.05`). */
const COMPOSE_BODY_CANVAS_BG = '#F3F4F6';

/** Figma frames: Compose `6887:14115`, Reply `6887:15547`, Forward `6887:16008`. */
type ComposeVariant = 'compose' | 'reply' | 'forward';

/** Maps India demos to Figma error screens 6887:18369, 6887:18849, 6887:19329. */
type ComposeValidationDemo = 'none' | 'invalidTo' | 'noRecipient' | 'multiple';

type PendingComposeNavigate =
  | { kind: 'close' }
  | { kind: 'channel'; channel: 'msg' | 'wa' }
  | { kind: 'composeToThreads' };

type AudienceFilter = 'all' | 'candidate' | 'agency';

function threadSentMs(row: MailThreadRow): number {
  const ms = Date.parse(row.sentAt);
  return Number.isNaN(ms) ? 0 : ms;
}

/** Overview list — newest activity first (design parity vs Conversational Email captures). */
function applyMailThreadSortNewestFirst(rows: MailThreadRow[]): MailThreadRow[] {
  return [...rows].sort((a, b) => threadSentMs(b) - threadSentMs(a));
}

/** Row-level status chips (Figma Conversational Email list). */
type ThreadRowBadge = 'sent' | 'notDelivered';

/** Prototype-only reading-pane delivery errors — cycle via control panel. */
export type DeliveryErrorKey =
  | 'none'
  | 'generic'
  | 'spam'
  | 'virus'
  | 'unsubscribe'
  | 'template'
  | 'server'
  | 'retry';

export const DELIVERY_ERROR_COPY: Record<
  Exclude<DeliveryErrorKey, 'none'>,
  { title: string; body: string }
> = {
  generic: {
    title: 'This email could not be delivered successfully.',
    body:
      'Try sending it out again or reaching out to the recipient using other communication methods.',
  },
  spam: {
    title: 'This email could not be delivered successfully.',
    body:
      'This recipient has unsubscribed from your emails. You’ll need their explicit opt-in before contacting them again. Use a different communication method.',
  },
  virus: {
    title: 'This email could not be delivered successfully.',
    body:
      'This email was blocked because it contained content flagged as a virus. Remove any attachments and try resending.',
  },
  unsubscribe: {
    title: 'This email could not be delivered successfully.',
    body:
      'This recipient has unsubscribed from your emails. Use a different communication method.',
  },
  template: {
    title: 'This email could not be delivered successfully.',
    body:
      'This email was not delivered due to a template or formatting issue. Try sending again without a template, or use a different communication method.',
  },
  server: {
    title: 'This email could not be delivered successfully.',
    body:
      'The recipient’s server is temporarily unavailable. We’ll keep retrying automatically. Use a different communication method if urgent.',
  },
  retry: {
    title: 'This email could not be delivered successfully.',
    body:
      'This email was not delivered due to a technical issue. If the issue persists, use a different communication method or contact support.',
  },
};

/** Single message within a Threads Linear reading pane (7064:12437). */
type MailThreadMessage = {
  id: string;
  senderLabel: string;
  readingTimestamp?: string;
  direction: 'in' | 'out';
  fromLine: string;
  readingTo?: string;
  readingToFull?: string;
  subject: string;
  body: string;
  bodyItalicPhrase?: string;
  readingAttachments?: Array<{ name: string; meta?: string }>;
};

type MailThreadRow = {
  id: string;
  audience: 'candidate' | 'agency';
  subject: string;
  preview: string;
  when: string;
  body: string;
  fromLine: string;
  /** Display name for thread list (reference Overview rows). */
  senderLabel: string;
  /** Short time label shown on the right (e.g. Today · 2:14 PM). */
  sentAt: string;
  /** Full timestamp for reading pane header (Figma). */
  readingTimestamp?: string;
  direction: 'in' | 'out';
  /** @deprecated — use threadRowBadge */
  sentBadge?: boolean;
  /** MVP list chip: Sent | Not delivered only (no Delivered state). */
  threadRowBadge?: ThreadRowBadge;
  unread?: boolean;
  /** Inbound subject shown as blue link in reference. */
  subjectTone?: 'link' | 'default';
  /** Reading pane — multi-recipient lines (short). */
  readingTo?: string;
  /** Full format To line with angle brackets (Figma). */
  readingToFull?: string;
  /** Attachment chips in reading pane. */
  readingAttachments?: Array<{ name: string; meta?: string }>;
  /** Collapsed list row: failed delivery (Figma 6913:20249). */
  deliveryStatus?: 'ok' | 'notDelivered';
  /** Italic segments in body for emphasis (substring markers). */
  bodyItalicPhrase?: string;
  /** Reading pane only: stacked conversation (oldest → newest); overrides synthetic single-message pane when set. */
  threadMessages?: MailThreadMessage[];
};

/** Build one synthetic pane message from legacy single-message row fields. */
function syntheticMessageFromRow(row: MailThreadRow): MailThreadMessage {
  return {
    id: `syn-${row.id}`,
    senderLabel: row.senderLabel,
    readingTimestamp: row.readingTimestamp,
    direction: row.direction,
    fromLine: row.fromLine,
    readingTo: row.readingTo,
    readingToFull: row.readingToFull,
    subject: row.subject,
    body: row.body,
    bodyItalicPhrase: row.bodyItalicPhrase,
    readingAttachments: row.readingAttachments,
  };
}

function messagesForReadingPane(row: MailThreadRow): MailThreadMessage[] {
  if (row.threadMessages && row.threadMessages.length > 0) {
    /** Newest-first in data — display chronological (oldest at top) per conversation-email reference. */
    return [...row.threadMessages].reverse();
  }
  return [syntheticMessageFromRow(row)];
}

/** Stub inbox — Figma-aligned names, timestamps, badges. */
const MOCK_MAIL_THREADS: MailThreadRow[] = [
  {
    id: '1',
    audience: 'candidate',
    subject: 'Re: Invitation for an Interview',
    preview:
      'Hi Rachel, I just noticed a different link was sent on the previous message. Plea…',
    when: 'Today',
    sentAt: '11/15/2025, 9:46 AM',
    readingTimestamp: '11/15/2025, 9:46 AM',
    senderLabel: 'Chloe Clarkson',
    direction: 'in',
    unread: true,
    subjectTone: 'link',
    readingToFull: 'Rachel Vaccaro <Rachel.Vaccaro@email.com>',
    readingTo: 'Rachel Vaccaro',
    fromLine: 'Chloe Clarkson <chloe.clarkson@email.com>',
    body:
      'Hi Rachel, I just noticed a different link was sent on the previous message. Please send over the updated link. Thank you so much!\n\nChloe Clarkson',
    bodyItalicPhrase: 'different link',
    readingAttachments: [
      { name: 'Resume.pdf', meta: '245 KB' },
      { name: 'Cover-letter.pdf', meta: '245 KB' },
    ],
    threadMessages: [
      {
        id: '1-m1',
        senderLabel: 'Chloe Clarkson',
        readingTimestamp: '11/15/2025, 9:46 AM',
        direction: 'in',
        fromLine: 'Chloe Clarkson <chloe.clarkson@email.com>',
        readingToFull: 'Rachel Vaccaro <Rachel.Vaccaro@email.com>',
        readingTo: 'Rachel Vaccaro',
        subject: 'Re: Invitation for an Interview',
        body:
          'Hi Rachel, I just noticed a different link was sent on the previous message. Please send over the updated link. Thank you so much!\n\nChloe Clarkson',
        bodyItalicPhrase: 'different link',
        readingAttachments: [
          { name: 'Resume.pdf', meta: '245 KB' },
          { name: 'Cover-letter.pdf', meta: '245 KB' },
        ],
      },
      {
        id: '1-m2',
        senderLabel: 'Rachel Vaccaro (You)',
        readingTimestamp: '11/10/2025, 9:03 AM',
        direction: 'out',
        fromLine: 'Rachel Vaccaro <rachel.vaccaro@gms.workday.com>',
        readingToFull: 'Chloe Clarkson <chloe.clarkson@email.com>',
        subject: 'Re: Invitation for an Interview',
        body:
          'Hello,\n\nI am sending a Zoom link for the interview scheduled on December 10, 2025.\n\nPlease join using the details below and confirm your attendance.',
      },
      {
        id: '1-m3',
        senderLabel: 'Rachel Vaccaro (You)',
        readingTimestamp: '11/10/2025, 10:23 AM',
        direction: 'out',
        fromLine: 'Rachel Vaccaro <rachel.vaccaro@gms.workday.com>',
        readingToFull: 'Chloe Clarkson <chloe.clarkson@email.com>',
        subject: 'Interview Request from GMS',
        body:
          'Hi Chloe,\n\nThank you. James is looking forward to meeting the team on Wednesday.\n\nLet us know if you need to reschedule or have questions about the role.',
        readingAttachments: [
          { name: 'Resume.pdf', meta: '245 KB' },
          { name: 'Cover-letter.pdf', meta: '245 KB' },
        ],
      },
      {
        id: '1-m4',
        senderLabel: 'Chloe Clarkson',
        readingTimestamp: '11/08/2025, 9:00 AM',
        direction: 'in',
        fromLine: 'Chloe Clarkson <chloe.clarkson@email.com>',
        readingToFull: 'Rachel Vaccaro <Rachel.Vaccaro@email.com>',
        readingTo: 'Rachel Vaccaro',
        subject: 'Invitation for an Interview',
        body:
          'Hi Rachel,\n\nThank you for your interest. We would like to invite you to interview for the Marketing Coordinator role. Please let us know your availability.\n\nBest,\nChloe Clarkson',
      },
    ],
  },
  {
    id: '2',
    audience: 'candidate',
    subject: 'Interview Request from GMS',
    preview:
      'Hi Chloe, Thank you. James is looking forward to meeting the team on Wednesday. Let us know if you need to reschedule or have questions about the role.',
    when: 'Yesterday',
    sentAt: '11/10/2025, 10:23 AM',
    readingTimestamp: '11/10/2025, 10:23 AM',
    senderLabel: 'Rachel Vaccaro (You)',
    direction: 'out',
    threadRowBadge: 'sent',
    subjectTone: 'default',
    readingToFull: 'Chloe Clarkson <chloe.clarkson@email.com>',
    readingAttachments: [
      { name: 'Resume.pdf', meta: '245 KB' },
      { name: 'Cover-letter.pdf', meta: '245 KB' },
    ],
    body:
      'Hi Chloe,\n\nThank you. James is looking forward to meeting the team on Wednesday.\n\nLet us know if you need to reschedule or have questions about the role.',
    fromLine: 'Rachel Vaccaro <rachel.vaccaro@gms.workday.com>',
  },
  {
    id: '3',
    audience: 'candidate',
    subject: 'Re: Invitation for an Interview',
    preview:
      'Hello, I am sending a Zoom link for the interview scheduled on December 10, 2025. Please join using the details below and confirm your attendance.',
    when: 'Yesterday',
    sentAt: '11/10/2025, 9:03 AM',
    readingTimestamp: '11/10/2025, 9:03 AM',
    senderLabel: 'Rachel Vaccaro (You)',
    direction: 'out',
    threadRowBadge: 'sent',
    subjectTone: 'default',
    readingToFull: 'Chloe Clarkson <chloe.clarkson@email.com>',
    readingAttachments: [],
    body:
      'Hello,\n\nI am sending a Zoom link for the interview scheduled on December 10, 2025.\n\nPlease join using the details below and confirm your attendance.',
    fromLine: 'Rachel Vaccaro <rachel.vaccaro@gms.workday.com>',
  },
  {
    id: '4',
    audience: 'candidate',
    subject: 'Re: Invitation for an Interview',
    preview:
      'Hello, Thank you for getting back! I just set up some time on calendar. Could not deliver — mailbox unavailable.',
    when: 'Mon',
    sentAt: '01/10/2023, 10:23 AM',
    readingTimestamp: '01/10/2023, 10:23 AM',
    senderLabel: 'Chloe Clarkson',
    direction: 'out',
    threadRowBadge: 'notDelivered',
    subjectTone: 'default',
    readingToFull: 'Rachel Vaccaro <Rachel.Vaccaro@email.com>',
    readingAttachments: [],
    body:
      'Hello, Thank you for getting back! I just set up some time on calendar.\n\nHi Rachel, I just noticed a different link was sent on the previous message. Please send over the updated link.',
    fromLine: 'Chloe Clarkson <chloe.clarkson@email.com>',
    deliveryStatus: 'notDelivered',
  },
  {
    id: '5',
    audience: 'agency',
    subject: 'Candidate submission — Chloe Clarkson (JR-00073)',
    preview:
      'BrightPath Staffing is submitting Chloe Clarkson for the Marketing Coordinator role on JR-00073. Agency packet and rate card attached.',
    when: 'Today',
    sentAt: '11/14/2025, 2:18 PM',
    readingTimestamp: '11/14/2025, 2:18 PM',
    senderLabel: 'Alex Rivera',
    direction: 'in',
    unread: true,
    subjectTone: 'link',
    readingToFull: 'Rachel Vaccaro <Rachel.Vaccaro@email.com>',
    readingTo: 'Rachel Vaccaro',
    fromLine: 'Alex Rivera <alex.rivera@brightpathstaffing.com>',
    body:
      'Hi Rachel,\n\nBrightPath Staffing is pleased to formally submit Chloe Clarkson for the Marketing Coordinator role (JR-00073). Chloe has four years of campaign coordination experience and is available to start in two weeks.\n\nPlease find our agency submission summary and standard rate card attached. Let me know if you would like to schedule a screening call or need any additional compliance documentation.\n\nBest,\nAlex Rivera\nBrightPath Staffing',
    readingAttachments: [
      { name: 'Chloe-Clarkson-agency-submission.pdf', meta: '312 KB' },
      { name: 'BrightPath-rate-card.pdf', meta: '89 KB' },
    ],
  },
  {
    id: '6',
    audience: 'agency',
    subject: 'Re: Chloe Clarkson — JR-00073',
    preview:
      'Following up on Chloe for the Marketing Coordinator role — happy to coordinate references or interview times once you confirm next steps.',
    when: 'Wed',
    sentAt: '11/12/2025, 10:05 AM',
    readingTimestamp: '11/12/2025, 10:05 AM',
    senderLabel: 'Priya Nair',
    direction: 'in',
    subjectTone: 'default',
    readingToFull: 'Rachel Vaccaro <Rachel.Vaccaro@email.com>',
    readingTo: 'Rachel Vaccaro',
    fromLine: 'Priya Nair <priya.nair@apexrecruit.co>',
    body:
      'Hi Rachel,\n\nFollowing up on Chloe Clarkson for JR-00073 — happy to coordinate interviews, share references, or align on timeline whenever you are ready to move her forward.\n\nThanks,\nPriya\nApex Recruit Partners',
  },
];

/** Session: onboarding complete after step 2 (Figma 6887:23551). */
const TWO_WAY_EMAIL_ONBOARDING_COMPLETE_KEY = 'two_way_email_onboarding_complete_v3';

/** Job requisition line — mail Overview header + candidate hero (design JR-00073). */
const CANDIDATE_JOB_REQ_DISPLAY = 'JR-00073 Marketing Coordinator';

const CANDIDATE = {
  name: 'Chloe Clarkson',
  title: CANDIDATE_JOB_REQ_DISPLAY,
  phone: '+1 408-977-3477 (Mobile)',
  email: 'Chloe.Clarkson@gmail.com',
  location: '111 Jackson Blvd, Chicago, IL 60604 United States of America',
  jobsInReview: '1',
};

const CANDIDATE_NAV = [
  { id: 'summary', label: 'Summary', icon: relatedActionsIcon },
  { id: 'overview', label: 'Overview', icon: fileIcon },
  { id: 'history', label: 'Recruiting History', icon: clockIcon },
  { id: 'attachments', label: 'Attachments', icon: fileIcon },
  { id: 'reminders', label: 'Reminders', icon: alarmClockIcon },
  { id: 'questionnaire', label: 'Questionnaire Results', icon: userIcon },
  { id: 'interview', label: 'Interview', icon: userIcon },
  { id: 'screening', label: 'Screening', icon: fileIcon },
  { id: 'offer', label: 'Employment Offer', icon: fileIcon },
  { id: 'notes', label: 'Personal Notes', icon: userIcon },
] as const;

/** Narrow global icon rail — light chrome (canonical); not the blue candidate column. */
function recruitingRailIconButton(
  active: boolean,
  children: React.ReactNode,
  title: string,
  onClick?: () => void,
) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: RECRUITING_RAIL_W,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: active ? TW.blueberry100 : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function collabRailTile(
  active: boolean,
  icon: typeof mailIcon,
  label: string,
  onClick: () => void,
  options?: {
    badgeCount?: number;
    showOnboardingDot?: boolean;
    customIcon?: ReactNode;
    /** Red circular alert with “!” (PM rail capture) instead of numeric unread pill. */
    mailAlertBadge?: boolean;
  },
) {
  const badge = options?.badgeCount;
  const showDot = options?.showOnboardingDot;
  const mailAlert = options?.mailAlertBadge;
  /** Full-bleed in the rail column — no inset (Figma: active wash edge-to-edge in the 64px rail). */
  const tileInnerStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: CONV_EMAIL_RAIL_TILE_RADIUS_PX,
    boxSizing: 'border-box',
    borderLeft: active ? `4px solid ${CONV_EMAIL_THREAD_SELECTED_BAR}` : 'none',
    backgroundColor: active ? CONV_EMAIL_RAIL_TILE_ACTIVE_BG : 'transparent',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: 0,
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: COLLAB_RAIL_W,
        height: COLLAB_RAIL_W,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        margin: 0,
        padding: 0,
        background: 'transparent',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        flexShrink: 0,
        boxSizing: 'border-box',
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      <span style={tileInnerStyle}>
        {options?.customIcon ?? (
          <TwIcon icon={icon} size={22} color={active ? CONV_EMAIL_RAIL_ICON_ACTIVE : CONV_EMAIL_RAIL_ICON_IDLE} />
        )}
      </span>
      {showDot ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: TW.blueberry400,
            border: `2px solid ${TW.frenchVanilla100}`,
            boxShadow: `0 0 0 1px ${TW.blueberry200}`,
            zIndex: 2,
          }}
        />
      ) : null}
      {badge !== undefined && badge > 0 && mailAlert ? (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: TW.cinnamon500,
            color: TW.frenchVanilla100,
            fontSize: 11,
            fontWeight: 800,
            lineHeight: '16px',
            textAlign: 'center',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          !
        </span>
      ) : null}
      {badge !== undefined && badge > 0 && !mailAlert ? (
        <span
          style={{
            position: 'absolute',
            top: showDot ? 2 : 6,
            right: showDot ? 2 : 6,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 8,
            backgroundColor: CONV_EMAIL_RAIL_BADGE_BG,
            color: CONV_EMAIL_RAIL_BADGE_FG,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: '16px',
            textAlign: 'center',
            zIndex: 3,
          }}
        >
          {badge > 9 ? '9+' : badge}
        </span>
      ) : null}
    </button>
  );
}

function utilityHeaderAction(
  icon: CanvasSystemIcon,
  label: string,
  count: number,
  uid: string,
) {
  const labelWithCount = count > 0 ? `${label} (${count})` : label;
  return (
    <Box
      key={uid}
      position="relative"
      style={{ display: 'inline-flex', flexShrink: 0, overflow: 'visible' }}
    >
      <button
        type="button"
        aria-label={labelWithCount}
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 8,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <TwIcon icon={icon} size={24} color={TW.blackPepper400} />
      </button>
      {count > 0 ? (
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -6,
            minWidth: 17,
            height: 17,
            padding: '0 4px',
            borderRadius: 9,
            backgroundColor: TW.cinnamon500,
            color: TW.frenchVanilla100,
            fontSize: 10,
            fontWeight: 700,
            lineHeight: '17px',
            textAlign: 'center',
            border: `1px solid ${TW.frenchVanilla100}`,
            pointerEvents: 'none',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Box>
  );
}

function GlobalHeader({
  searchValue,
  onSearchChange,
  utilityBadgeCounts = [6, 9, 1] as [number, number, number],
}: {
  searchValue: string;
  onSearchChange: (v: string) => void;
  utilityBadgeCounts?: [number, number, number];
}) {
  /** Reference: pill search — cool grey fill, hairline border slightly darker than fill */
  const headerSearchBg = '#F3F4F6';
  const headerSearchBorder = '#E5E7EB';

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      paddingX="m"
      style={{
        position: 'relative',
        zIndex: GLOBAL_HEADER_Z,
        height: HEADER_H,
        minHeight: HEADER_H,
        backgroundColor: TW.frenchVanilla100,
        flexShrink: 0,
        /** Separation from canvas below — Figma: light drop shadow, not a heavy rule. */
        borderBottom: 'none',
        boxShadow: '0 4px 14px rgba(11, 31, 66, 0.09)',
      }}
    >
      <Flex alignItems="center" gap="m">
        <Flex alignItems="center" gap="xxs">
          <button
            type="button"
            aria-label="Global menu"
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: 8,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <TwIcon icon={justifyIcon} size={24} color={TW.blackPepper400} />
          </button>
          <BodyText size="small" style={{ margin: 0, fontWeight: 700, color: TW.blackPepper600, letterSpacing: 0.5 }}>
            MENU
          </BodyText>
        </Flex>
        <Box aria-hidden style={{ width: 1, height: 28, flexShrink: 0, backgroundColor: TWEMAIL_DIVIDER }} />
        <Flex alignItems="center" gap="s">
          <Box
            aria-hidden
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${TW.blueberry400} 0%, ${TW.blueberry600} 100%)`,
              flexShrink: 0,
            }}
          />
          <Flex flexDirection="column" gap="xxs" style={{ lineHeight: 1.15 }}>
            <Subtext size="small" style={{ margin: 0, fontWeight: 700, color: TW.blackPepper600 }}>
              Global Modern Services
            </Subtext>
            <BodyText size="small" style={{ margin: 0, fontWeight: 600, color: TW.blackPepper500 }}>
              GMS
            </BodyText>
          </Flex>
        </Flex>
      </Flex>
      <Box
        flex={1}
        maxWidth={526}
        marginX="l"
        style={{
          border: `1px solid ${headerSearchBorder}`,
          borderRadius: 999,
          backgroundColor: headerSearchBg,
          padding: '10px 16px',
        }}
      >
        <Flex alignItems="center" gap="s">
          <TwIcon icon={searchIcon} size={24} color={TW.blackPepper400} />
          <input
            aria-label="Search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              minWidth: 0,
              fontSize: 14,
              fontWeight: 400,
              color: TW.blackPepper600,
              background: 'transparent',
            }}
          />
        </Flex>
      </Box>
      <Flex alignItems="center" gap="xs" style={{ overflow: 'visible' }}>
        {utilityHeaderAction(speechBubbleIcon, 'Chat', 0, 'ub-chat')}
        {utilityHeaderAction(messagingIcon, 'Messages', utilityBadgeCounts[0], 'ub0')}
        {utilityHeaderAction(notificationsIcon, 'Notifications', utilityBadgeCounts[1], 'ub1')}
        {utilityHeaderAction(inboxIcon, 'Inbox', utilityBadgeCounts[2], 'ub2')}
        <Box marginLeft="xs">
          <Avatar size={40} />
        </Box>
      </Flex>
    </Flex>
  );
}

function RecruitingNavRail() {
  const idle = TW.blackPepper400;
  const activeInk = TW.blueberry600;
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      alignSelf="stretch"
      style={{
        width: RECRUITING_RAIL_W,
        minWidth: RECRUITING_RAIL_W,
        minHeight: '100%',
        borderRight: `1px solid ${TWEMAIL_DIVIDER}`,
        backgroundColor: TW.frenchVanilla100,
        paddingTop: SPACE.s,
      }}
    >
      {recruitingRailIconButton(
        false,
        <TwIcon icon={relatedActionsIcon} size={24} color={idle} />,
        'Home',
      )}
      {recruitingRailIconButton(
        true,
        <TwIcon icon={userIcon} size={24} color={activeInk} />,
        'Find candidates',
      )}
      {recruitingRailIconButton(false, <TwIcon icon={searchIcon} size={24} color={idle} />, 'Search')}
      {recruitingRailIconButton(false, <TwIcon icon={chartIcon} size={24} color={idle} />, 'Reports')}
      <Box marginY="m" style={{ width: 40, height: 1, backgroundColor: TWEMAIL_DIVIDER }} />
      {recruitingRailIconButton(false, <TwIcon icon={relatedActionsIcon} size={24} color={idle} />, 'Favorites')}
      {recruitingRailIconButton(false, <TwIcon icon={relatedActionsIcon} size={24} color={idle} />, 'Settings')}
    </Flex>
  );
}

function CandidateMenu({
  activeNav,
  onNav,
}: {
  activeNav: string;
  onNav: (id: string) => void;
}) {
  const chromeGhostBtn: CSSProperties = {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: 4,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: 0,
  };
  return (
    <Flex
      flexDirection="column"
      alignSelf="stretch"
      style={{
        width: CANDIDATE_MENU_W,
        minWidth: CANDIDATE_MENU_W,
        minHeight: '100%',
        borderRight: `1px solid ${TWEMAIL_DIVIDER}`,
        backgroundColor: CANDIDATE_MENU_BG,
        paddingTop: SPACE.s,
        color: TW.frenchVanilla100,
      }}
    >
      <Box paddingX="m" paddingTop="s" paddingBottom="xs">
        <Flex justifyContent="flex-end" gap="xs" marginBottom="s">
          <button type="button" aria-label="Tag" style={chromeGhostBtn}>
            <TwIcon icon={tagIcon} size={20} color={TW.frenchVanilla100} />
          </button>
          <button type="button" aria-label="PDF" style={chromeGhostBtn}>
            <TwIcon icon={pdfIcon} size={20} color={TW.frenchVanilla100} />
          </button>
        </Flex>
        <Flex flexDirection="column" alignItems="center" marginBottom="m">
          <Heading
            size="medium"
            style={{
              margin: 0,
              textAlign: 'center',
              color: TW.frenchVanilla100,
              fontWeight: 700,
              fontSize: 24,
              lineHeight: 1.2,
              letterSpacing: -0.02,
            }}
          >
            {CANDIDATE.name}
          </Heading>
          <BodyText
            size="small"
            style={{
              marginTop: 8,
              marginBottom: 0,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.35,
            }}
          >
            {CANDIDATE.title}
          </BodyText>
          <Box marginTop="m">
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 18px',
                borderRadius: 999,
                border: `1px solid rgba(255,255,255,0.95)`,
                backgroundColor: 'transparent',
                color: TW.frenchVanilla100,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                lineHeight: 1.2,
              }}
            >
              Actions
              <TwIcon icon={chevronDownSmallIcon} size={14} color={TW.frenchVanilla100} aria-hidden />
            </button>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" paddingX="xs" paddingBottom="m" style={{ gap: 8 }}>
          {[
            { icon: phoneIcon, label: 'Phone' },
            { icon: speechBubbleIcon, label: 'Message' },
            { icon: fileIcon, label: 'Resume' },
          ].map((c) => (
            <Flex key={c.label} flexDirection="column" alignItems="center" gap="xxs" style={{ flex: 1, minWidth: 0 }}>
              <Box
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: CANDIDATE_MENU_QUICK_ACTION_CIRCLE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12)',
                }}
              >
                <TwIcon icon={c.icon} size={22} color={TW.frenchVanilla100} />
              </Box>
              <Subtext
                size="small"
                style={{
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: 11,
                  fontWeight: 500,
                  textAlign: 'center',
                  lineHeight: 1.25,
                }}
              >
                {c.label}
              </Subtext>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Box flex={1} style={{ overflow: 'auto' }}>
        {CANDIDATE_NAV.map((item) => {
          const sel = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNav(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 18px',
                border: 'none',
                background: sel ? CANDIDATE_NAV_ROW_SELECTED_BG : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <TwIcon icon={item.icon} size={24} color={TW.frenchVanilla100} />
              <BodyText
                size="small"
                style={{
                  margin: 0,
                  fontWeight: sel ? 700 : 600,
                  color: TW.frenchVanilla100,
                }}
              >
                {item.label}
              </BodyText>
            </button>
          );
        })}
      </Box>
    </Flex>
  );
}

function ProfileMainColumn({
  actionBarVisible,
  onMoveForward,
  backgroundScrollLocked = false,
}: {
  actionBarVisible: boolean;
  onMoveForward: () => void;
  /** When true, profile column does not scroll (mail Overview / Composer is foreground). */
  backgroundScrollLocked?: boolean;
}) {
  const cell: CSSProperties = { padding: '8px 12px', borderBottom: `1px solid ${TWEMAIL_DIVIDER_SUBTLE}`, fontSize: 13 };
  return (
    <Flex
      flex={1}
      gap="l"
      padding="m"
      style={{
        minWidth: 0,
        overflow: backgroundScrollLocked ? 'hidden' : 'auto',
        overscrollBehavior: backgroundScrollLocked ? 'none' : undefined,
        backgroundColor: PROFILE_COLUMN_CANVAS_BG,
        paddingBottom: actionBarVisible ? DECISION_ACTION_BAR_HEIGHT_PX : undefined,
      }}
    >
      <Box style={{ flex: '1 1 0', minWidth: 280, minHeight: 0 }}>
        <Card padding="l" marginBottom="m" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)', width: '100%' }}>
          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 24,
              rowGap: 24,
            }}
          >
            <Flex gap="s" alignItems="flex-start" style={{ minWidth: 0 }}>
              <TwIcon icon={phoneIcon} size={24} color={TW.blackPepper400} style={{ flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, marginBottom: 4 }}>
                  Phone Number
                </BodyText>
                <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, wordBreak: 'break-word' }}>
                  {CANDIDATE.phone}
                </BodyText>
              </Box>
            </Flex>
            <Flex gap="s" alignItems="flex-start" style={{ minWidth: 0 }}>
              <TwIcon icon={mailIcon} size={24} color={TW.blackPepper400} style={{ flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, marginBottom: 4 }}>
                  Email
                </BodyText>
                <BodyText
                  size="small"
                  style={{
                    ...PROFILE_FIELD_VALUE,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={CANDIDATE.email}
                >
                  {CANDIDATE.email}
                </BodyText>
              </Box>
            </Flex>
            <Flex gap="s" alignItems="flex-start" style={{ minWidth: 0 }}>
              <TwIcon icon={locationIcon} size={24} color={TW.blackPepper400} style={{ flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, marginBottom: 4 }}>
                  Location
                </BodyText>
                <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, wordBreak: 'break-word' }}>
                  {CANDIDATE.location}
                </BodyText>
              </Box>
            </Flex>
            <Flex gap="s" alignItems="flex-start" style={{ minWidth: 0 }}>
              <TwIcon icon={fileIcon} size={24} color={TW.blackPepper400} style={{ flexShrink: 0 }} />
              <Box style={{ minWidth: 0 }}>
                <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, marginBottom: 4 }}>
                  Jobs In Review to
                </BodyText>
                <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, wordBreak: 'break-word' }}>
                  {CANDIDATE.jobsInReview}
                </BodyText>
              </Box>
            </Flex>
          </Box>
        </Card>

        <Card
          padding={24}
          marginBottom="m"
          style={{
            width: '100%',
            borderRadius: ACTIVE_JOB_APPLICATION_CARD_RADIUS_PX,
            border: `1px solid ${TWEMAIL_DIVIDER_SUBTLE}`,
            backgroundColor: TW.frenchVanilla100,
            boxShadow: 'none',
          }}
        >
          <Heading
            size="small"
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: TW.blackPepper600,
              lineHeight: 1.35,
            }}
          >
            Active Job Applications (1)
          </Heading>

          <Flex gap="s" alignItems="flex-start" style={{ marginTop: 20 }}>
            <Box
              aria-hidden
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: TW.soap400,
                flexShrink: 0,
                marginTop: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: TW.frenchVanilla100,
                }}
              />
            </Box>
            <Box style={{ minWidth: 0, flex: 1 }}>
              <button
                type="button"
                style={{
                  margin: 0,
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 600,
                  color: ACTIVE_JOB_APPLICATION_LINK,
                  fontFamily: 'inherit',
                  lineHeight: 1.35,
                }}
              >
                {CANDIDATE.name} - {CANDIDATE.title}
              </button>
              <Subtext
                size="small"
                style={{
                  display: 'block',
                  margin: '8px 0 0',
                  color: TW.blackPepper500,
                  fontSize: 13,
                  lineHeight: 1.45,
                  fontWeight: 400,
                }}
              >
                Location: Chicago | Date Applied: 11/01/24
              </Subtext>
              <Subtext
                size="small"
                style={{
                  display: 'block',
                  margin: '6px 0 0',
                  color: TW.blackPepper400,
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.35,
                }}
              >
                Review
              </Subtext>
            </Box>
          </Flex>

          <Flex flexDirection="column" alignItems="flex-start" style={{ marginTop: 20, gap: 16 }}>
            <button
              type="button"
              onClick={onMoveForward}
              aria-haspopup="menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderRadius: 999,
                border: `1px solid ${TW.blackPepper400}`,
                backgroundColor: TW.frenchVanilla100,
                color: TW.blackPepper600,
                fontSize: 14,
                fontWeight: 600,
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                lineHeight: 1.25,
              }}
            >
              Actions
              <TwIcon icon={chevronDownSmallIcon} size={16} color={TW.blackPepper600} aria-hidden />
            </button>
            <button
              type="button"
              style={{
                borderRadius: 999,
                border: `1px solid ${TW.blackPepper400}`,
                backgroundColor: TW.frenchVanilla100,
                color: TW.blackPepper600,
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 22px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                lineHeight: 1.35,
                width: '56%',
                maxWidth: 360,
                minWidth: 220,
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              Decline These Applications
            </button>
          </Flex>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Work History
          </Heading>
          <Flex gap="xl" marginBottom="m">
            <Flex flexDirection="column" gap="s">
              <BodyText size="small" style={PROFILE_FIELD_LABEL}>
                Current Job
              </BodyText>
              <BodyText size="small" style={PROFILE_FIELD_LABEL}>
                Total Jobs
              </BodyText>
              <BodyText size="small" style={PROFILE_FIELD_LABEL}>
                Total Experience
              </BodyText>
            </Flex>
            <Flex flexDirection="column" gap="s">
              <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, textAlign: 'right' }}>
                2 years
              </BodyText>
              <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, textAlign: 'right' }}>
                2
              </BodyText>
              <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, textAlign: 'right' }}>
                2 years
              </BodyText>
            </Flex>
          </Flex>
          <Heading size="small" marginBottom="s">
            Experience
          </Heading>
          <BodyText size="small" style={{ margin: 0, lineHeight: 1.5, color: TW.blackPepper500 }}>
            Nationwide Insurance Chief of Staff | February 2008 - Current (15 years, 7 months) Established marketing plan and management strategies through market analysis.
          </BodyText>
        </Card>

        <Card padding="l" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <TwFormSelect
            id="timeline-filter"
            label=""
            value="all"
            onChange={() => {}}
            options={[
              { value: 'all', label: 'All activity' },
              { value: 'email', label: 'Email' },
            ]}
          />
          <Box marginTop="m" height={1} background={TWEMAIL_DIVIDER} />
          <Heading size="small" marginY="m">
            2023
          </Heading>
          <Flex gap="m">
            <Flex flexDirection="column" alignItems="center" gap="xs">
              <Subtext size="small">25 Aug</Subtext>
              <Subtext size="small">25 Aug</Subtext>
            </Flex>
            <Flex flexDirection="column" alignItems="center" gap={0}>
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: TW.soap200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TwIcon icon={mailIcon} size={24} />
              </Box>
              <Box style={{ width: 2, flex: 1, minHeight: 40, backgroundColor: TWEMAIL_DIVIDER }} />
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: TW.soap200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TwIcon icon={fileIcon} size={22} />
              </Box>
            </Flex>
            <Box flex={1}>
              <BodyText size="small" style={{ margin: 0, fontWeight: 700 }}>
                System sent &quot;Thank You For Applying!&quot; Em…
              </BodyText>
              <BodyText size="small" style={{ marginTop: 'm', margin: 0, fontWeight: 700 }}>
                E-00001 Multiple Customer Service Career…
              </BodyText>
            </Box>
          </Flex>
        </Card>

        <Card padding="l" marginTop="m" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Resume / Cover Letter
          </Heading>
          <Flex alignItems="center" gap="s">
            <TwIcon icon={fileIcon} size={20} />
            <BodyText size="small" style={{ margin: 0 }}>
              Callie.cat.Resume+for+parsing+doc.docx
            </BodyText>
          </Flex>
        </Card>
      </Box>

      <Box style={{ flex: '1 1 0', minWidth: 280, minHeight: 0 }}>
        <Card padding="l" marginBottom="m" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)', width: '100%' }}>
          <Heading size="small" marginBottom="m">
            Job Application Details
          </Heading>
          <Flex flexDirection="column" gap="m">
            <Flex justifyContent="space-between" gap="m" flexWrap="wrap">
              <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, minWidth: 100 }}>
                Job Requisition
              </BodyText>
              <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, flex: 1, textAlign: 'right' }}>
                E-00001 Multiple Customer Service Career Opportunities! (Evergreen) (Open)
              </BodyText>
            </Flex>
            <Flex alignItems="center" gap="m">
              <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, minWidth: 100 }}>
                Location
              </BodyText>
              <Flex alignItems="center" gap="xs">
                <TwIcon icon={locationIcon} size={20} />
                <BodyText size="small" style={PROFILE_FIELD_VALUE}>
                  Chicago
                </BodyText>
              </Flex>
            </Flex>
            <Flex gap="m">
              <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, minWidth: 100 }}>
                Date Applied
              </BodyText>
              <BodyText size="small" style={PROFILE_FIELD_VALUE}>
                08/25/2023 04:29:43 PM
              </BodyText>
            </Flex>
            <Flex justifyContent="space-between" gap="m" flexWrap="wrap">
              <BodyText size="small" style={{ ...PROFILE_FIELD_LABEL, minWidth: 100 }}>
                Source
              </BodyText>
              <BodyText size="small" style={{ ...PROFILE_FIELD_VALUE, flex: 1, textAlign: 'right' }}>
                Landing Paged -&gt; Recruiting Landing Pages -&gt; Internships at GMS
              </BodyText>
            </Flex>
          </Flex>

          <Flex gap="m" marginTop="l" flexWrap="wrap">
            <Avatar size={40} />
            <Box>
              <BodyText size="small" style={{ margin: 0, fontWeight: 700 }}>
                Tomas Callahan
              </BodyText>
              <Subtext size="small" style={{ color: TW.blackPepper400 }}>
                Hiring Manager
              </Subtext>
            </Box>
          </Flex>
          <Flex gap="m" marginTop="m" flexWrap="wrap">
            <Avatar size={40} />
            <Box>
              <BodyText size="small" style={{ margin: 0, fontWeight: 700 }}>
                Rachel Vaccaro
              </BodyText>
              <Subtext size="small" style={{ color: TW.blackPepper400 }}>
                Recruiter
              </Subtext>
            </Box>
          </Flex>

          <Box marginTop="l">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header style={cell}>Stage</Table.Header>
                  <Table.Header style={cell}>Status</Table.Header>
                  <Table.Header style={cell}>Disposition</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell style={cell}>Review</Table.Cell>
                  <Table.Cell style={cell}>Active</Table.Cell>
                  <Table.Cell style={cell}>—</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Education
          </Heading>
          <BodyText size="small" style={{ margin: 0 }}>
            Tuskegee University B.A. | Marketing
          </BodyText>
        </Card>

        <Card padding="l" marginBottom="m" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Languages
          </Heading>
          <Subtext size="small">none entered</Subtext>
          <Heading size="small" marginTop="l" marginBottom="s">
            Websites
          </Heading>
          <Subtext size="small">none entered</Subtext>
          <Heading size="small" marginTop="l" marginBottom="s">
            Skills
          </Heading>
          <Flex gap="xs" flexWrap="wrap">
            {['Marketing', 'Customer Service', 'Sales', 'Leadership', 'Analysis'].map((s) => (
              <SecondaryButton key={s} size="small">
                {s}
              </SecondaryButton>
            ))}
          </Flex>
        </Card>

        <Card padding="l" style={{ ...twProfileCardStyle(), boxShadow: '0 1px 3px rgba(11,31,66,0.08)' }}>
          <Heading size="small" marginBottom="s">
            Personal Reminders
          </Heading>
          <SecondaryButton size="small">Add reminder</SecondaryButton>
          <Subtext size="small" style={{ marginTop: 'm' }}>none entered</Subtext>
        </Card>
      </Box>
    </Flex>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

type ComposeAttachment = { id: string; name: string; size: number };

/** Injected on compose toolbar attach; seed control uses same rows — dedupe by stable ids. */
const MOCK_ATTACH_RESUME: ComposeAttachment = { id: 'compose-att-resume', name: 'Resume.pdf', size: 245 * 1024 };
const MOCK_ATTACH_COVERLETTER: ComposeAttachment = {
  id: 'compose-att-coverletter',
  name: 'Coverletter.pdf',
  size: 245 * 1024,
};
const MOCK_ATTACHMENT_ROWS: ComposeAttachment[] = [MOCK_ATTACH_RESUME, MOCK_ATTACH_COVERLETTER];
const MOCK_ATTACHMENT_ID_SET = new Set(MOCK_ATTACHMENT_ROWS.map((a) => a.id));

type SendOutcome = 'idle' | 'sent' | 'failed';

/** Anchored popover toward the mail rail — matches reference “Introducing Conversational Email”. */
function FeatureHighlightPopover({
  anchorRef,
  onTry,
  onDismiss,
  /** Re-measure when the collaboration dock opens/closes (rail position shifts). */
  layoutSignal,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  onTry: () => void;
  onDismiss: () => void;
  layoutSignal?: boolean;
}) {
  const cardWidth = 300;
  const gap = 12;

  const fallbackAnchorRect = useCallback((): {
    top: number;
    left: number;
    width: number;
    height: number;
  } => {
    if (typeof window === 'undefined') {
      return { top: 120, left: 400, width: COLLAB_RAIL_W, height: COLLAB_RAIL_W };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const railLeft = vw - COLLAB_RAIL_W;
    return {
      top: Math.min(vh - 220, Math.max(HEADER_H + 56, vh * 0.3)),
      left: Math.max(16, railLeft - cardWidth - gap),
      width: COLLAB_RAIL_W,
      height: COLLAB_RAIL_W,
    };
  }, []);

  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const update = useCallback(() => {
    const el = anchorRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setRect(fallbackAnchorRect());
    }
  }, [anchorRef, fallbackAnchorRect]);

  useLayoutEffect(() => {
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [update, layoutSignal]);

  useLayoutEffect(() => {
    const el = anchorRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [anchorRef, update, layoutSignal]);

  /** Ref attaches after sibling CommunicationDock mounts — measure again next frame(s). */
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      update();
      requestAnimationFrame(() => {
        if (!cancelled) update();
      });
    };
    run();
    const t = window.setTimeout(run, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [update, layoutSignal]);

  return (
    <>
      {/*
       * Do **not** render a full-screen invisible dismiss layer: even when z-index is below the mail dock,
       * browsers still resolve hit-testing in DOM/stacking order such that Reply / + New on the dock fail.
       * Dismiss via the card Close button or “Try Conversational Email” only.
       */}
      {rect ? (
        <Box
          style={{
            position: 'fixed',
            zIndex: FEATURE_ONBOARDING_CARD_Z,
            top: Math.max(16, rect.top + rect.height / 2 - 100),
            left: Math.max(16, rect.left - cardWidth - gap),
            width: cardWidth,
            filter: 'drop-shadow(0 8px 24px rgba(11,31,66,0.18))',
            pointerEvents: 'auto',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              right: -10,
              top: 88,
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: `10px solid ${TW.frenchVanilla100}`,
            }}
          />
          <Card
            padding="l"
            style={{
              borderRadius: 8,
              border: `1px solid ${TWEMAIL_DIVIDER}`,
              position: 'relative',
              backgroundColor: TW.frenchVanilla100,
            }}
          >
            <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
              <Heading
                size="small"
                style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TW.blackPepper600, paddingRight: 8, lineHeight: 1.3 }}
              >
                Introducing Conversational Email
              </Heading>
              <TertiaryButton size="small" aria-label="Close" onClick={onDismiss}>
                <TwIcon icon={xIcon} size={20} />
              </TertiaryButton>
            </Flex>
            <BodyText size="small" style={{ margin: '0 0 16px', lineHeight: 1.5, color: TW.blackPepper500 }}>
              Conversational email is now available. Send and receive emails with candidates right here within Workday.
            </BodyText>
            <PrimaryButton style={{ width: '100%' }} onClick={onTry}>
              Try Conversational Email
            </PrimaryButton>
          </Card>
        </Box>
      ) : null}
    </>
  );
}

function MailPanelEmptyState({
  audienceFilter,
  onCompose,
}: {
  audienceFilter: AudienceFilter;
  onCompose: () => void;
}) {
  const title =
    audienceFilter === 'agency'
      ? 'No agency conversations yet'
      : audienceFilter === 'candidate'
        ? 'No candidate messages in this view'
        : 'Start the conversation';
  return (
    <Flex
      flex={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="l"
      style={{ backgroundColor: TW.soap100, minHeight: 200 }}
    >
      <img
        src={REF_EMPTY_STATE_PNG}
        alt=""
        style={{
          maxWidth: 220,
          width: '100%',
          height: 'auto',
          marginBottom: 20,
          objectFit: 'contain',
          backgroundColor: 'transparent',
          display: 'block',
        }}
      />
      <Heading size="small" style={{ margin: '0 0 8px', textAlign: 'center', maxWidth: 320, color: TW.blackPepper600 }}>
        {title}
      </Heading>
      <BodyText
        size="small"
        style={{
          margin: '0 0 20px',
          textAlign: 'center',
          color: TW.blackPepper500,
          maxWidth: 380,
          lineHeight: 1.5,
        }}
      >
        {`There are no email conversations yet. Start a conversation with Chloe Clarkson for ${CANDIDATE_JOB_REQ_DISPLAY}.`}
      </BodyText>
      <button type="button" onClick={onCompose} style={protoDockPrimaryButtonStyle()}>
        + Compose Email
      </button>
    </Flex>
  );
}

function MailThreadListRow({
  row,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  row: MailThreadRow;
  selected: boolean;
  hovered: boolean;
  onSelect: () => void;
  onHover: (h: boolean) => void;
}) {
  const failed = row.deliveryStatus === 'notDelivered';
  const badge = row.threadRowBadge;
  const subjectColor = selected
    ? TW.blackPepper600
    : row.subjectTone === 'link'
      ? TW.blueberry500
      : TW.blackPepper600;

  const pillStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    color: TW.blackPepper500,
    backgroundColor: TW.soap200,
    border: 'none',
    borderRadius: 4,
    padding: '3px 9px',
    flexShrink: 0,
  };

  const statusRight =
    badge === 'sent' || row.sentBadge ? (
      <span style={pillStyle}>Sent</span>
    ) : badge === 'notDelivered' ? (
      <Flex alignItems="center" gap="xxs" flexShrink={0} aria-label="Not Delivered">
        <TwIcon icon={exclamationCircleIcon} size={14} color={TW.cinnamon600} aria-hidden />
        <span style={{ fontSize: 11, fontWeight: 600, color: TW.cinnamon600, whiteSpace: 'nowrap' }}>
          Not Delivered
        </span>
      </Flex>
    ) : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px 14px',
        border: 'none',
        borderBottom: `1px solid ${CONV_EMAIL_THREAD_DIVIDER}`,
        cursor: 'pointer',
        backgroundColor: selected
          ? CONV_EMAIL_THREAD_SELECTED_BG
          : hovered
            ? CONV_EMAIL_THREAD_ROW_HOVER_BG
            : 'transparent',
      }}
    >
      <Box style={{ minWidth: 0, width: '100%' }}>
        <Flex alignItems="flex-start" justifyContent="space-between" gap="s">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <BodyText
              size="small"
              fontWeight={700}
              style={{
                margin: 0,
                color: TW.blackPepper600,
                lineHeight: 1.3,
              }}
            >
              {row.senderLabel}
            </BodyText>
            <Subtext
              size="small"
              style={{ margin: '4px 0 0', display: 'block', color: TW.blackPepper400, lineHeight: 1.3 }}
            >
              {row.sentAt}
            </Subtext>
          </Box>
          <Box style={{ flexShrink: 0, paddingTop: 2 }}>{statusRight}</Box>
        </Flex>

        <Flex alignItems="flex-start" gap="xxs" style={{ marginTop: 8, minWidth: 0 }}>
          {row.unread ? (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: TW.blueberry500,
                flexShrink: 0,
                marginTop: 5,
              }}
              aria-hidden
            />
          ) : null}
          <BodyText
            size="small"
            fontWeight={700}
            style={{
              margin: 0,
              color: subjectColor,
              flex: 1,
              minWidth: 0,
              lineHeight: 1.35,
              wordBreak: 'break-word',
            }}
          >
            {row.subject}
          </BodyText>
        </Flex>

        <BodyText
          size="small"
          style={{
            marginTop: 6,
            marginBottom: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: failed ? TW.cinnamon600 : TW.blackPepper400,
            lineHeight: 1.45,
            wordBreak: 'break-word',
            fontWeight: 400,
          }}
        >
          {row.preview}
        </BodyText>
      </Box>
    </button>
  );
}

/** To line only — sender is shown in the card header (`senderLabel`); **From** is omitted as redundant. */
function ReadingPaneEnvelopeLines({ msg }: { msg: MailThreadMessage }) {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {msg.readingToFull !== undefined ? (
        <BodyText size="small" style={READING_META_ROW}>
          <strong style={{ color: TW.blackPepper600 }}>To</strong> {msg.readingToFull}
        </BodyText>
      ) : msg.readingTo !== undefined ? (
        <BodyText size="small" style={READING_META_ROW}>
          <strong style={{ color: TW.blackPepper600 }}>To</strong> {msg.readingTo}
        </BodyText>
      ) : null}
    </Box>
  );
}

function ReadingPaneMessage({
  msg,
  parentRow,
  onReplyToThread,
  onForwardThread,
  onMailSurfaceChange,
}: {
  msg: MailThreadMessage;
  parentRow: MailThreadRow;
  onReplyToThread: (row: MailThreadRow) => void;
  onForwardThread: (row: MailThreadRow) => void;
  onMailSurfaceChange: (s: 'threads' | 'compose') => void;
}) {
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="flex-start" gap="m" marginBottom="s">
        <BodyText size="small" style={READING_HEADER_NAME}>
          {msg.senderLabel}
        </BodyText>
        {msg.readingTimestamp ? (
          <Subtext size="small" style={{ ...READING_HEADER_TIME, flexShrink: 0 }}>
            {msg.readingTimestamp}
          </Subtext>
        ) : null}
      </Flex>
      <Box marginBottom={12}>
        <ReadingPaneEnvelopeLines msg={msg} />
      </Box>
      <Heading size="small" style={READING_SUBJECT}>
        {msg.subject}
      </Heading>
      <BodyText size="medium" style={READING_BODY}>
        {(() => {
          const phrase = msg.bodyItalicPhrase;
          if (phrase) {
            const i = msg.body.indexOf(phrase);
            if (i >= 0) {
              return (
                <>
                  {msg.body.slice(0, i)}
                  <em
                    style={{
                      fontStyle: 'italic',
                      fontWeight: 400,
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                      color: 'inherit',
                    }}
                  >
                    {phrase}
                  </em>
                  {msg.body.slice(i + phrase.length)}
                </>
              );
            }
          }
          return msg.body;
        })()}
      </BodyText>
      {msg.readingAttachments && msg.readingAttachments.length > 0 ? (
        <Flex flexDirection="column" gap="xxs" marginTop={16}>
          <Subtext
            size="small"
            style={{ fontWeight: 700, color: TW.blackPepper500, fontSize: 11, margin: 0, lineHeight: 1.3 }}
          >
            Attachments
          </Subtext>
          <Flex
            flexWrap="wrap"
            style={{
              gap: READING_ATTACHMENT_GAP_PX,
              alignItems: 'stretch',
              justifyContent: 'flex-start',
            }}
          >
            {msg.readingAttachments.map((a) => {
              const lower = a.name.toLowerCase();
              const attIcon = lower.endsWith('.pdf') ? pdfIcon : documentIcon;
              return (
                <Box
                  key={`${msg.id}-${a.name}`}
                  style={{
                    flex: '0 0 auto',
                    width: 'fit-content',
                    maxWidth: `min(${ATTACHMENT_CHIP_MAX_WIDTH_PX}px, 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    border: `1px solid ${TWEMAIL_DIVIDER}`,
                    borderRadius: READING_ATTACHMENT_CHIP_RADIUS_PX,
                    backgroundColor: TW.frenchVanilla100,
                    boxSizing: 'border-box',
                  }}
                >
                  <TwIcon icon={attIcon} size={20} color={TW.blueberry500} style={{ flexShrink: 0 }} />
                  <Box style={{ minWidth: 0, maxWidth: ATTACHMENT_CHIP_MAX_WIDTH_PX - 60 }}>
                    <span style={READING_ATTACHMENT_NAME}>{a.name}</span>
                    {a.meta ? <div style={READING_ATTACHMENT_META}>{a.meta}</div> : null}
                  </Box>
                </Box>
              );
            })}
          </Flex>
        </Flex>
      ) : null}
      <Flex
        gap="xs"
        marginTop={16}
        paddingTop="s"
        style={{ borderTop: `1px solid ${TWEMAIL_DIVIDER_SUBTLE}` }}
      >
        <button
          type="button"
          onClick={() => {
            onReplyToThread(parentRow);
            onMailSurfaceChange('compose');
          }}
          style={READING_REPLY_PILL}
        >
          Reply
        </button>
        <button
          type="button"
          onClick={() => {
            onForwardThread(parentRow);
            onMailSurfaceChange('compose');
          }}
          style={READING_REPLY_PILL}
        >
          Forward
        </button>
      </Flex>
    </Box>
  );
}

/** Reply/Forward: quoted thread inside compose card — grows with content (no inner scroll). */
function ComposeQuotedOriginalConversation({ row }: { row: MailThreadRow }) {
  const msgs = messagesForReadingPane(row);
  return (
    <>
      {msgs.map((msg, index) => (
        <Box
          key={msg.id}
          marginTop={index > 0 ? 'm' : undefined}
          paddingTop={index > 0 ? 'm' : undefined}
          style={index > 0 ? { borderTop: `1px solid ${TWEMAIL_DIVIDER_SUBTLE}` } : undefined}
        >
          <Flex justifyContent="space-between" alignItems="flex-start" gap="m" marginBottom="s">
            <BodyText size="small" style={READING_HEADER_NAME}>
              {msg.senderLabel}
            </BodyText>
            {msg.readingTimestamp ? (
              <Subtext size="small" style={{ ...READING_HEADER_TIME, flexShrink: 0 }}>
                {msg.readingTimestamp}
              </Subtext>
            ) : null}
          </Flex>
          <ReadingPaneEnvelopeLines msg={msg} />
          <Heading size="small" style={{ ...READING_SUBJECT, marginTop: 20 }}>
            {msg.subject}
          </Heading>
          <BodyText size="medium" style={{ ...READING_BODY, marginTop: 8 }}>
            {(() => {
              const phrase = msg.bodyItalicPhrase;
              if (phrase) {
                const i = msg.body.indexOf(phrase);
                if (i >= 0) {
                  return (
                    <>
                      {msg.body.slice(0, i)}
                      <em
                        style={{
                          fontStyle: 'italic',
                          fontWeight: 400,
                          textDecoration: 'underline',
                          textUnderlineOffset: 2,
                          color: 'inherit',
                        }}
                      >
                        {phrase}
                      </em>
                      {msg.body.slice(i + phrase.length)}
                    </>
                  );
                }
              }
              return msg.body;
            })()}
          </BodyText>
        </Box>
      ))}
    </>
  );
}

/** Dock header — shrink control: in split view hides reading pane only; list-only closes the mail sheet. */
function ConversationalEmailCollapsePanelButton({
  onCollapse,
  readingPaneExpanded = false,
}: {
  onCollapse: () => void;
  /** True when list + reading pane are both visible — control collapses the right pane only. */
  readingPaneExpanded?: boolean;
}) {
  const tipId = useId();
  const [hover, setHover] = useState(false);
  const label = readingPaneExpanded ? 'Collapse reading pane' : 'Close panel';

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', flexShrink: 0 }}
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        aria-describedby={hover ? tipId : undefined}
        onClick={onCollapse}
        style={{
          ...protoDockIconButtonStyle(40),
          borderRadius: 999,
          backgroundColor: TW.soap100,
        }}
      >
        <TwIcon icon={shrinkIcon} size={20} color={TW.blackPepper600} />
      </button>
      {hover ? (
        <Box
          id={tipId}
          role="tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 8,
            padding: '8px 12px',
            backgroundColor: '#101820',
            color: TW.frenchVanilla100,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'inherit',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            zIndex: 200,
            pointerEvents: 'none',
            boxShadow: '0 4px 14px rgba(11, 31, 66, 0.22)',
          }}
        >
          {label}
        </Box>
      ) : null}
    </Box>
  );
}

function MailCollaborationSurface({
  mailSurface,
  onMailSurfaceChange,
  onRequestComposeExit,
  onComposeDirtyChange,
  fromLine,
  toLine,
  subject,
  onSubjectChange,
  composeResetKey,
  composeVariant,
  onComposeNew,
  onReplyToThread,
  onForwardThread,
  threadsResetKey,
  onCollapseDock,
  audienceFilter,
  onAudienceFilterChange,
  selectedId,
  onSelectedIdChange,
  demoEmptyInbox,
  deliveryErrorKey,
  composePlaceholderVariant,
  seedComposePdfAttachments,
  composeValidationDemo,
  onComposeValidationDemoChange,
  threads,
  quotedThreadRow,
}: {
  mailSurface: 'threads' | 'compose';
  onMailSurfaceChange: (s: 'threads' | 'compose') => void;
  onRequestComposeExit: () => void;
  onComposeDirtyChange?: (dirty: boolean) => void;
  fromLine: string;
  toLine: string;
  subject: string;
  onSubjectChange: (v: string) => void;
  composeResetKey: number;
  composeVariant: ComposeVariant;
  onComposeNew: () => void;
  onReplyToThread: (row: MailThreadRow) => void;
  onForwardThread: (row: MailThreadRow) => void;
  /** Increment when mail panel closes — remount thread list for list-first UX. */
  threadsResetKey: number;
  /** Collapses the collaboration dock (same as rail chevron / backdrop dismiss guards). */
  onCollapseDock: () => void;
  audienceFilter: AudienceFilter;
  onAudienceFilterChange: (a: AudienceFilter) => void;
  selectedId: string | null;
  onSelectedIdChange: (id: string | null) => void;
  demoEmptyInbox: boolean;
  deliveryErrorKey: DeliveryErrorKey;
  composePlaceholderVariant: 'begin' | 'template';
  seedComposePdfAttachments: boolean;
  composeValidationDemo: ComposeValidationDemo;
  onComposeValidationDemoChange: (v: ComposeValidationDemo) => void;
  threads: MailThreadRow[];
  /** Thread shown below the caret for Reply/Forward compose (Outlook-style quote). */
  quotedThreadRow: MailThreadRow | null;
}) {
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [createEmailPopoverOpen, setCreateEmailPopoverOpen] = useState(false);

  const filtered = threads;

  const selected = useMemo(
    () => (selectedId ? filtered.find((t) => t.id === selectedId) ?? null : null),
    [filtered, selectedId],
  );

  useEffect(() => {
    if (selectedId && !filtered.some((t) => t.id === selectedId)) {
      onSelectedIdChange(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedId, onSelectedIdChange]);

  const launchCompose = useCallback(() => {
    setCreateEmailPopoverOpen(false);
    onComposeNew();
    onMailSurfaceChange('compose');
  }, [onComposeNew, onMailSurfaceChange]);

  const openCompose = launchCompose;

  const splitView = Boolean(selectedId && filtered.some((t) => t.id === selectedId));
  /** Stacked messages for reading pane (chronological oldest → newest). */
  const readingPaneMessages = useMemo(() => {
    if (!selected) return [];
    return messagesForReadingPane(selected);
  }, [selected]);
  /** Matches thread list column width — header panes use the same split. */
  const mailListColumnWidthPx = 272;

  if (mailSurface === 'compose') {
    return (
      <Flex
        flexDirection="column"
        flex={1}
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          alignSelf: 'stretch',
        }}
      >
        <ComposeEmailPanel
          key={composeResetKey}
          composeVariant={composeVariant}
          onRequestDismiss={onRequestComposeExit}
          onDirtyChange={onComposeDirtyChange}
          fromLine={fromLine}
          toLine={toLine}
          subject={subject}
          onSubjectChange={onSubjectChange}
          placeholderVariant={composePlaceholderVariant}
          seedSamplePdfAttachments={seedComposePdfAttachments}
          composeValidationDemo={composeValidationDemo}
          onComposeValidationDemoChange={onComposeValidationDemoChange}
          quotedThreadRow={quotedThreadRow}
        />
      </Flex>
    );
  }

  const emptyFilterCopy =
    audienceFilter === 'candidate'
      ? 'No candidate threads for this filter. Try the All or Agency tab, or turn off Empty inbox (demo).'
      : audienceFilter === 'agency'
        ? 'No agency threads for this filter. Try the All or Candidate tab, or turn off Empty inbox (demo).'
        : 'No threads match this audience tab. Choose another tab, or turn off Empty inbox (demo).';

  const audienceTab = (id: AudienceFilter, label: string) => {
    const active = audienceFilter === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onAudienceFilterChange(id)}
        style={{
          padding: '8px 4px',
          marginRight: 16,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? TW.blueberry600 : TW.blackPepper500,
          borderBottom: active ? `3px solid ${TW.blueberry500}` : '3px solid transparent',
          marginBottom: -1,
        }}
      >
        {label}
      </button>
    );
  };

  const threadListRows = filtered.map((row) => (
    <MailThreadListRow
      key={row.id}
      row={row}
      selected={selectedId === row.id}
      hovered={hoveredRowId === row.id}
      onSelect={() => onSelectedIdChange(row.id)}
      onHover={(h) => setHoveredRowId(h ? row.id : null)}
    />
  ));

  /** List-first only — full-width list under stacked header. Split view uses {@link threadListRows} in the left column. */
  const threadListColumn = (
    <Box
      key={threadsResetKey}
      flex={1}
      style={{
        overflowY: 'auto',
        backgroundColor: TWEMAIL_THREAD_LIST_CANVAS_BG,
        minHeight: 0,
        width: '100%',
      }}
    >
      {threadListRows}
    </Box>
  );

  const createEmailPopoverMarkup =
    createEmailPopoverOpen ? (
      <Box
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          zIndex: 10,
          width: 292,
          filter: 'drop-shadow(0 8px 24px rgba(11,31,66,0.18))',
        }}
      >
        <Card
          padding="m"
          style={{
            borderRadius: 8,
            border: `1px solid ${TWEMAIL_DIVIDER}`,
            backgroundColor: TW.frenchVanilla100,
          }}
        >
          <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
            <Heading size="small" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TW.blackPepper600 }}>
              Create a New Email
            </Heading>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setCreateEmailPopoverOpen(false)}
              style={protoDockPopoverCloseButtonStyle()}
            >
              <TwIcon icon={xIcon} size={18} />
            </button>
          </Flex>
          <BodyText size="small" style={{ margin: '0 0 16px', lineHeight: 1.5, color: TW.blackPepper500 }}>
            Send a new email to this candidate.
          </BodyText>
          <button type="button" style={protoDockPrimaryButtonStyle(true)} onClick={launchCompose}>
            Send New Email
          </button>
        </Card>
      </Box>
    ) : null;

  /** Split read: single vertical divider — left = chrome + list; right = preview header + messages. */
  const splitViewReadingPane = (
    <Box
      flex={1}
      style={{
        minHeight: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {selected && selected.deliveryStatus === 'notDelivered' ? (
        <Box paddingX="l" paddingTop="m" style={{ flexShrink: 0, backgroundColor: TW.frenchVanilla100 }}>
          {(() => {
            const copy =
              deliveryErrorKey !== 'none' ? DELIVERY_ERROR_COPY[deliveryErrorKey] : DELIVERY_ERROR_COPY.generic;
            return <AlertBanner type="error" message={`${copy.title}\n\n${copy.body}`} />;
          })()}
        </Box>
      ) : null}
      <Box
        flex={1}
        className="two-way-email-reading-pane-scroll"
        style={{
          minHeight: 0,
          width: '100%',
          overflowY: 'auto',
          paddingBottom: 12,
          backgroundColor: TW.frenchVanilla100,
        }}
      >
        {selected ? (
          <Box padding="l">
            {readingPaneMessages.map((msg, index) => (
              <Box
                key={msg.id}
                marginTop={index > 0 ? 'm' : undefined}
                paddingTop={index > 0 ? 'm' : undefined}
                style={index > 0 ? { borderTop: `1px solid ${TWEMAIL_DIVIDER}` } : undefined}
              >
                <ReadingPaneMessage
                  msg={msg}
                  parentRow={selected}
                  onReplyToThread={onReplyToThread}
                  onForwardThread={onForwardThread}
                  onMailSurfaceChange={onMailSurfaceChange}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Flex flex={1} alignItems="center" justifyContent="center" padding="xl" minHeight={200}>
            <BodyText size="small" style={{ color: TW.blackPepper400, textAlign: 'center' }}>
              Select an email in the list to view details.
            </BodyText>
          </Flex>
        )}
      </Box>
    </Box>
  );

  return (
    <Flex
      flexDirection="column"
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        width: '100%',
        height: '100%',
        alignSelf: 'stretch',
        /** Full-bleed canvas under header + split panes (dock shell was white; gaps read as “broken”). */
        backgroundColor: TWEMAIL_THREAD_LIST_CANVAS_BG,
      }}
    >
      {demoEmptyInbox ? (
        <Flex flex={1} style={{ flex: '1 1 0%', minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
          <MailPanelEmptyState audienceFilter={audienceFilter} onCompose={openCompose} />
        </Flex>
      ) : filtered.length === 0 ? (
        <Flex
          flex={1}
          alignItems="center"
          justifyContent="center"
          padding="xl"
          style={{ backgroundColor: TWEMAIL_THREAD_LIST_CANVAS_BG }}
        >
          <BodyText size="small" style={{ margin: 0, textAlign: 'center', color: TW.blackPepper500, maxWidth: 360 }}>
            {emptyFilterCopy}
          </BodyText>
        </Flex>
      ) : splitView ? (
        <Flex
          flex={1}
          flexDirection="row"
          alignItems="stretch"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden',
            backgroundColor: TWEMAIL_THREAD_LIST_CANVAS_BG,
          }}
        >
          {createEmailPopoverOpen ? (
            <button
              type="button"
              aria-label="Dismiss create email menu"
              onClick={() => setCreateEmailPopoverOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 8,
                border: 'none',
                background: 'transparent',
                cursor: 'default',
              }}
            />
          ) : null}
          <Box
            style={{
              width: mailListColumnWidthPx,
              flexShrink: 0,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'stretch',
              borderRight: `1px solid ${TWEMAIL_DIVIDER}`,
              boxSizing: 'border-box',
            }}
          >
            <Box
              paddingX="s"
              paddingTop="s"
              style={{
                position: 'relative',
                flexShrink: 0,
                borderBottom: `1px solid ${TWEMAIL_DIVIDER}`,
                backgroundColor: TW.frenchVanilla100,
              }}
            >
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between" gap="xs" style={{ minHeight: 40 }}>
                <Heading
                  size="medium"
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: TW.blackPepper600,
                    lineHeight: 1.25,
                    letterSpacing: -0.01,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  Conversational Email
                </Heading>
                <Box style={{ position: 'relative', flexShrink: 0 }}>
                  <Flex alignItems="center" gap="xs">
                    <ConversationalEmailCollapsePanelButton
                      readingPaneExpanded={splitView}
                      onCollapse={onCollapseDock}
                    />
                    <button
                      type="button"
                      aria-label="Create new email"
                      title="Create new email"
                      onClick={() => {
                        setCreateEmailPopoverOpen(true);
                      }}
                      style={protoDockPrimaryButtonStyle()}
                    >
                      + New
                    </button>
                  </Flex>
                  {createEmailPopoverMarkup}
                </Box>
              </Flex>
              <Box style={{ marginTop: 10 }}>
                <Subtext size="small" style={{ margin: 0, display: 'block', color: TW.blackPepper400, fontWeight: 600 }}>
                  Job Requisition
                </Subtext>
                <BodyText
                  size="small"
                  style={{ margin: '6px 0 0', fontWeight: 600, color: TW.blackPepper600, display: 'block' }}
                >
                  {CANDIDATE_JOB_REQ_DISPLAY}
                </BodyText>
              </Box>
              <Flex marginTop="s" paddingTop="xs" style={{ flexWrap: 'wrap' }}>
                {audienceTab('all', 'All')}
                {audienceTab('candidate', 'Candidate')}
                {audienceTab('agency', 'Agency')}
              </Flex>
            </Box>
            <Box
              key={threadsResetKey}
              flex={1}
              style={{
                minHeight: 0,
                overflowY: 'auto',
                backgroundColor: TWEMAIL_THREAD_LIST_CANVAS_BG,
              }}
            >
              {threadListRows}
            </Box>
          </Box>
          <Box
            flex={1}
            style={{
              flex: '1 1 0%',
              minWidth: 0,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: TW.frenchVanilla100,
            }}
          >
            {splitViewReadingPane}
          </Box>
        </Flex>
      ) : (
        <>
          <Box paddingX="s" paddingTop="s" style={{ position: 'relative', borderBottom: `1px solid ${TWEMAIL_DIVIDER}`, flexShrink: 0 }}>
            <Flex alignItems="center" justifyContent="space-between" gap="s" flexWrap="nowrap">
              <Heading
                size="medium"
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: TW.blackPepper600,
                  lineHeight: 1.25,
                  letterSpacing: -0.01,
                }}
              >
                Conversational Email
              </Heading>
              <Flex alignItems="center" gap="xs" flexShrink={0}>
                <ConversationalEmailCollapsePanelButton
                  readingPaneExpanded={false}
                  onCollapse={onCollapseDock}
                />
                <button
                  type="button"
                  aria-label="Create new email"
                  title="Create new email"
                  onClick={() => {
                    setCreateEmailPopoverOpen(true);
                  }}
                  style={protoDockPrimaryButtonStyle()}
                >
                  + New
                </button>
              </Flex>
            </Flex>
            <Box style={{ marginTop: 10 }}>
              <Subtext
                size="small"
                style={{ margin: 0, display: 'block', color: TW.blackPepper400, fontWeight: 600 }}
              >
                Job Requisition
              </Subtext>
              <BodyText
                size="small"
                style={{ margin: '6px 0 0', fontWeight: 600, color: TW.blackPepper600, display: 'block' }}
              >
                {CANDIDATE_JOB_REQ_DISPLAY}
              </BodyText>
            </Box>
            <Flex marginTop="s" paddingTop="xs" style={{ borderBottom: `1px solid ${TWEMAIL_DIVIDER}` }}>
              {audienceTab('all', 'All')}
              {audienceTab('candidate', 'Candidate')}
              {audienceTab('agency', 'Agency')}
            </Flex>
            {createEmailPopoverOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Dismiss create email menu"
                  onClick={() => setCreateEmailPopoverOpen(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 8,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'default',
                  }}
                />
                <Box
                  style={{
                    position: 'absolute',
                    top: 44,
                    right: 8,
                    zIndex: 9,
                    width: 292,
                    filter: 'drop-shadow(0 8px 24px rgba(11,31,66,0.18))',
                  }}
                >
                  <Card
                    padding="m"
                    style={{
                      borderRadius: 8,
                      border: `1px solid ${TWEMAIL_DIVIDER}`,
                      backgroundColor: TW.frenchVanilla100,
                    }}
                  >
                    <Flex justifyContent="space-between" alignItems="flex-start" marginBottom="s">
                      <Heading size="small" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: TW.blackPepper600 }}>
                        Create a New Email
                      </Heading>
                      <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setCreateEmailPopoverOpen(false)}
                        style={protoDockPopoverCloseButtonStyle()}
                      >
                        <TwIcon icon={xIcon} size={18} />
                      </button>
                    </Flex>
                    <BodyText size="small" style={{ margin: '0 0 16px', lineHeight: 1.5, color: TW.blackPepper500 }}>
                      Send a new email to this candidate.
                    </BodyText>
                    <button type="button" style={protoDockPrimaryButtonStyle(true)} onClick={launchCompose}>
                      Send New Email
                    </button>
                  </Card>
                </Box>
              </>
            ) : null}
          </Box>
          <Flex flex={1} style={{ flex: '1 1 0%', minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
            {threadListColumn}
          </Flex>
        </>
      )}
    </Flex>
  );
}

function ComposeEmailPanel({
  composeVariant,
  onRequestDismiss,
  onDirtyChange,
  fromLine,
  toLine,
  subject,
  onSubjectChange,
  placeholderVariant = 'begin',
  seedSamplePdfAttachments = false,
  composeValidationDemo,
  onComposeValidationDemoChange,
  quotedThreadRow = null,
}: {
  composeVariant: ComposeVariant;
  onRequestDismiss: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  fromLine: string;
  toLine: string;
  subject: string;
  onSubjectChange: (v: string) => void;
  placeholderVariant?: 'begin' | 'template';
  seedSamplePdfAttachments?: boolean;
  composeValidationDemo: ComposeValidationDemo;
  onComposeValidationDemoChange: (v: ComposeValidationDemo) => void;
  quotedThreadRow?: MailThreadRow | null;
}) {
  const composeTitle: Record<ComposeVariant, string> = {
    compose: 'Compose Email',
    reply: 'Reply',
    forward: 'Forward',
  };

  const bodyPlaceholder =
    placeholderVariant === 'begin' ? COMPOSE_BODY_PLACEHOLDER_BEGIN : COMPOSE_BODY_PLACEHOLDER_TEMPLATE;

  const [attachments, setAttachments] = useState<ComposeAttachment[]>([]);
  const [sendOutcome, setSendOutcome] = useState<SendOutcome>('idle');
  const [messageBodyHtml, setMessageBodyHtml] = useState('');
  const [messagePlain, setMessagePlain] = useState('');
  const [toRecipientError, setToRecipientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialSubjectRef = useRef(subject);
  const initialBodyRef = useRef('');

  useEffect(() => {
    if (seedSamplePdfAttachments) {
      setAttachments([...MOCK_ATTACHMENT_ROWS]);
    } else {
      setAttachments([]);
    }
  }, [seedSamplePdfAttachments]);

  const isDirty =
    sendOutcome === 'sent'
      ? false
      : subject !== initialSubjectRef.current ||
        messagePlain !== initialBodyRef.current ||
        attachments.length > 0 ||
        sendOutcome === 'failed' ||
        !!toRecipientError;

  useEffect(() => {
    if (composeValidationDemo === 'multiple') {
      setToRecipientError('Error: Required field.');
    } else if (composeValidationDemo === 'invalidTo') {
      setToRecipientError('Error: Invalid email address(s).');
    } else if (composeValidationDemo === 'noRecipient') {
      setToRecipientError(null);
    } else {
      setToRecipientError(null);
    }
  }, [composeValidationDemo]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(
    () => () => {
      onDirtyChange?.(false);
    },
    [onDirtyChange],
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) return;
    const makeId = () =>
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `att-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setAttachments((prev) => {
      const next = [...prev];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        next.push({ id: makeId(), name: f.name, size: f.size });
      }
      return next;
    });
    e.target.value = '';
  };

  const handleComposeAttachClick = useCallback(() => {
    fileInputRef.current?.click();
    setAttachments((prev) => {
      const rest = prev.filter((a) => !MOCK_ATTACHMENT_ID_SET.has(a.id));
      return [...rest, ...MOCK_ATTACHMENT_ROWS];
    });
  }, []);

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDiscard = () => {
    if (isDirty) {
      onRequestDismiss();
      return;
    }
    setAttachments([]);
    setSendOutcome('idle');
    setToRecipientError(null);
    setMessageBodyHtml('');
    setMessagePlain('');
    onComposeValidationDemoChange('none');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onRequestDismiss();
  };

  const hasQuotedInBody =
    !!quotedThreadRow && (composeVariant === 'reply' || composeVariant === 'forward');

  const handlePrimarySend = () => {
    if (composeValidationDemo === 'invalidTo') {
      setToRecipientError('Error: Invalid email address(s).');
      return;
    }
    if (composeValidationDemo === 'noRecipient') {
      setToRecipientError('Error: Required field.');
      return;
    }
    if (composeValidationDemo === 'multiple') {
      setToRecipientError('Error: Required field.');
      return;
    }
    setToRecipientError(null);
    setSendOutcome('sent');
  };

  return (
    <Flex
      flexDirection="column"
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        backgroundColor: TW.frenchVanilla100,
        width: '100%',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        aria-hidden
        tabIndex={-1}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="m"
        paddingX="m"
        paddingY="s"
        style={{
          borderBottom: `1px solid ${TWEMAIL_DIVIDER}`,
          minHeight: 56,
          flexShrink: 0,
        }}
      >
        <Flex alignItems="center" gap="s" style={{ minWidth: 0 }}>
          <TertiaryButton
            size="medium"
            onClick={onRequestDismiss}
            aria-label="Back to Inbox"
            title="Back to Inbox"
          >
            <TwIcon icon={chevronLeftSmallIcon} size={24} />
          </TertiaryButton>
          <Heading size="small" style={{ margin: 0, fontWeight: 700, color: TW.blackPepper600 }}>
            {composeTitle[composeVariant]}
          </Heading>
        </Flex>
        <ComposeInlineErrorSummary count={composeValidationDemo === 'multiple' ? 2 : 0} />
      </Flex>

      <Flex flexDirection="column" flex={1} style={{ minHeight: 0, overflowY: 'auto' }}>
        <Box padding="m" style={{ borderBottom: `1px solid ${TWEMAIL_DIVIDER}` }}>
          <Flex gap="m" flexWrap="wrap" alignItems="flex-end">
            <Box style={{ flex: '1 1 220px', minWidth: 0 }}>
              <TwFormTextInput
                id="compose-from"
                label="From"
                required
                readOnly
                type="text"
                value={fromLine}
                onChange={() => {}}
              />
            </Box>
            <Box style={{ flex: '1 1 260px', minWidth: 0 }}>
              {composeValidationDemo === 'noRecipient' ? (
                <TwFormTextInput
                  id="compose-to"
                  label="To"
                  required
                  readOnly
                  type="text"
                  placeholder="Add a recipient"
                  value=""
                  onChange={() => {}}
                  error={toRecipientError ?? undefined}
                />
              ) : composeValidationDemo === 'invalidTo' ? (
                <TwFormTextInput
                  id="compose-to"
                  label="To"
                  required
                  readOnly
                  type="text"
                  value="not-a-valid-email"
                  onChange={() => {}}
                  error={toRecipientError ?? undefined}
                />
              ) : (
                <TwFormTextInput
                  id="compose-to"
                  label="To"
                  required
                  readOnly
                  type="text"
                  value={toLine}
                  onChange={() => {}}
                  error={toRecipientError ?? undefined}
                />
              )}
            </Box>
          </Flex>

          <Box marginTop="m">
            <TwFormTextInput
              id="compose-subject"
              label="Subject"
              required
              placeholder=""
              value={subject}
              onChange={onSubjectChange}
              error={composeValidationDemo === 'multiple' ? 'Error: Required field.' : undefined}
            />
          </Box>
        </Box>

        <Box
          style={{
            flex: hasQuotedInBody ? '0 1 auto' : '1 1 auto',
            minHeight: 220,
            borderBottom: `1px solid ${TWEMAIL_DIVIDER}`,
            backgroundColor: COMPOSE_BODY_CANVAS_BG,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <Box
            style={{
              flex: hasQuotedInBody ? '0 1 auto' : 1,
              minHeight: hasQuotedInBody ? undefined : 0,
              width: '100%',
            }}
          >
            <RichTextEditor
              value={messageBodyHtml}
              canvasBackgroundColor={COMPOSE_BODY_CANVAS_BG}
              onChange={(html, text) => {
                setMessageBodyHtml(html);
                setMessagePlain(text);
              }}
              placeholder={bodyPlaceholder}
              minHeight={240}
              maxHeight={560}
              composeLayout
              onAttachClick={handleComposeAttachClick}
              slotBelowToolbar={
                attachments.length > 0 ? (
                  <Flex
                    gap="xs"
                    flexWrap="wrap"
                    alignItems="stretch"
                    paddingX="m"
                    paddingY="s"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      borderBottom: `1px solid ${TWEMAIL_DIVIDER}`,
                      backgroundColor: TW.soap100,
                      flexShrink: 0,
                      justifyContent: 'flex-start',
                    }}
                  >
                    {attachments.map((a) => (
                      <Flex
                        key={a.id}
                        alignItems="center"
                        gap="s"
                        paddingX="s"
                        paddingY="xs"
                        style={{
                          border: `1px solid ${TWEMAIL_DIVIDER}`,
                          borderRadius: 8,
                          backgroundColor: TW.frenchVanilla100,
                          flex: '0 0 auto',
                          width: 'fit-content',
                          maxWidth: `min(${ATTACHMENT_CHIP_MAX_WIDTH_PX}px, 100%)`,
                          minWidth: 0,
                          boxSizing: 'border-box',
                        }}
                      >
                        <TwIcon icon={fileIcon} size={20} color={TW.blueberry500} aria-hidden />
                        <Flex
                          flexDirection="column"
                          gap="xxs"
                          style={{ minWidth: 0, maxWidth: ATTACHMENT_CHIP_MAX_WIDTH_PX - 88 }}
                        >
                          <BodyText
                            size="small"
                            fontWeight={700}
                            style={{
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {a.name}
                          </BodyText>
                          <Subtext size="small" style={{ margin: 0, color: TW.blackPepper400 }}>
                            {formatBytes(a.size)}
                          </Subtext>
                        </Flex>
                        {sendOutcome === 'idle' ? (
                          <TertiaryButton
                            size="small"
                            aria-label={`Remove ${a.name}`}
                            onClick={() => removeAttachment(a.id)}
                            style={{ flexShrink: 0 }}
                          >
                            <TwIcon icon={xIcon} size={18} />
                          </TertiaryButton>
                        ) : null}
                      </Flex>
                    ))}
                  </Flex>
                ) : undefined
              }
              composeQuotedThread={
                hasQuotedInBody && quotedThreadRow ? (
                  <ComposeQuotedOriginalConversation row={quotedThreadRow} />
                ) : undefined
              }
              candidateData={{
                firstName: 'Chloe',
                name: 'Chloe Clarkson',
                jobTitle: 'Marketing Coordinator',
                requisitionId: 'JR-00073',
                recruiterName: 'Recruiter',
                companyName: 'Organization',
              }}
            />
          </Box>
        </Box>

        {sendOutcome === 'sent' ? (
          <Box padding="m" style={{ backgroundColor: TW.greenApple100, borderBottom: `1px solid ${TW.greenApple400}` }}>
            <BodyText size="small" fontWeight="bold" style={{ margin: 0 }}>
              Message sent (prototype — no mail server).
            </BodyText>
          </Box>
        ) : null}
      </Flex>

      <Flex
        justifyContent="flex-start"
        gap="s"
        padding="m"
        style={{
          borderTop: `1px solid ${TWEMAIL_DIVIDER}`,
          backgroundColor: TW.frenchVanilla100,
          flexShrink: 0,
        }}
      >
        <PrimaryButton
          disabled={sendOutcome !== 'idle' || composeValidationDemo === 'noRecipient'}
          onClick={handlePrimarySend}
          style={{ borderRadius: 999 }}
        >
          Send
        </PrimaryButton>
        <SecondaryButton
          onClick={handleDiscard}
          style={{
            borderRadius: 999,
            border: `1px solid ${TW.blackPepper400}`,
            backgroundColor: TW.frenchVanilla100,
            color: TW.blackPepper600,
          }}
        >
          Discard
        </SecondaryButton>
      </Flex>
    </Flex>
  );
}

type DockWidthPreset = 'auto' | 'narrow' | 'medium' | 'wide';

function useViewportWidth(): number {
  const [w, setW] = useState(1440);
  useEffect(() => {
    setW(typeof window !== 'undefined' ? window.innerWidth : 1440);
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

function parseTwoWayEmailPrototypeQuery(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const h = window.location.hash.slice(1);
  const q = h.includes('?') ? h.split('?')[1] ?? '' : '';
  return new URLSearchParams(q);
}

/** Parsed mail/dock URL state — shared by lazy `useState` init and the mount `useEffect` (must stay in sync). */
function initialMailPrototypeFromSearchParams(q: URLSearchParams): {
  panelOpen: boolean;
  activeNav: string;
  mailAudienceFilter: AudienceFilter;
  mailSelectedId: string | null;
  mailDemoEmpty: boolean;
  deliveryErrorKey: DeliveryErrorKey;
  dockWidthPreset: DockWidthPreset;
  mailSurface: 'threads' | 'compose';
  collabChannel: 'mail' | 'msg' | 'wa';
  composePlaceholderVariant: 'begin' | 'template';
  seedComposePdfAttachments: boolean;
  composeValidationDemo: ComposeValidationDemo;
  utilityBadgeCounts: [number, number, number];
  mailRailBadgeCount: number;
} {
  let panelOpen = q.get('panel') === '1';
  let activeNav = 'summary';
  const nav = q.get('nav');
  if (nav && CANDIDATE_NAV.some((x) => x.id === nav)) activeNav = nav;

  let mailAudienceFilter: AudienceFilter = 'all';
  const audience = q.get('audience');
  if (audience === 'all' || audience === 'candidate' || audience === 'agency') mailAudienceFilter = audience;

  const thread = q.get('thread');
  let mailSelectedId: string | null = null;
  if (thread === '' || thread === 'none') mailSelectedId = null;
  else if (thread && MOCK_MAIL_THREADS.some((t) => t.id === thread)) mailSelectedId = thread;

  let mailDemoEmpty = false;
  const empty = q.get('empty');
  if (empty === '1') mailDemoEmpty = true;

  let deliveryErrorKey: DeliveryErrorKey = 'none';
  const err = q.get('error');
  if (err === 'none') {
    deliveryErrorKey = 'none';
  } else if (err && (Object.keys(DELIVERY_ERROR_COPY) as string[]).includes(err)) {
    deliveryErrorKey = err as Exclude<DeliveryErrorKey, 'none'>;
  }

  let dockWidthPreset: DockWidthPreset = 'auto';
  const dock = q.get('dock') as DockWidthPreset | null;
  if (dock === 'auto' || dock === 'narrow' || dock === 'medium' || dock === 'wide') dockWidthPreset = dock;

  let mailSurface: 'threads' | 'compose' = 'threads';
  let collabChannel: 'mail' | 'msg' | 'wa' = 'mail';
  const surface = q.get('surface');
  if (surface === 'compose') {
    mailSurface = 'compose';
    collabChannel = 'mail';
  } else if (surface === 'empty') {
    mailDemoEmpty = true;
    mailSelectedId = null;
    mailSurface = 'threads';
    collabChannel = 'mail';
  } else if (surface === 'split') {
    mailDemoEmpty = false;
    mailSelectedId = thread ?? '1';
    mailSurface = 'threads';
    collabChannel = 'mail';
  } else if (surface === 'list') {
    mailDemoEmpty = false;
    mailSelectedId = null;
    mailSurface = 'threads';
    collabChannel = 'mail';
  }

  let composePlaceholderVariant: 'begin' | 'template' = 'begin';
  const place = q.get('composePlace');
  if (place === 'begin' || place === 'template') composePlaceholderVariant = place;

  let seedComposePdfAttachments = false;
  if (q.get('attach') === '1') seedComposePdfAttachments = true;

  let composeValidationDemo: ComposeValidationDemo = 'none';
  const composeValid = q.get('composeValid');
  if (
    composeValid === 'none' ||
    composeValid === 'invalidTo' ||
    composeValid === 'noRecipient' ||
    composeValid === 'multiple'
  ) {
    composeValidationDemo = composeValid;
  }

  let utilityBadgeCounts: [number, number, number] = [6, 9, 1];
  const badges = q.get('badges');
  if (badges) {
    const parts = badges.split(',').map((x) => parseInt(x, 10));
    if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
      utilityBadgeCounts = [parts[0], parts[1], parts[2]];
    }
  }

  let mailRailBadgeCount = 1;
  const mb = q.get('mailBadge');
  if (mb !== null && mb !== '') {
    const n = parseInt(mb, 10);
    if (!Number.isNaN(n)) mailRailBadgeCount = n;
  }

  /** Reply / Send New Email mount compose inside the dock — `panel=0` would keep the sheet collapsed → blank panel. */
  if (mailSurface === 'compose') {
    panelOpen = true;
    collabChannel = 'mail';
  }

  return {
    panelOpen,
    activeNav,
    mailAudienceFilter,
    mailSelectedId,
    mailDemoEmpty,
    deliveryErrorKey,
    dockWidthPreset,
    mailSurface,
    collabChannel,
    composePlaceholderVariant,
    seedComposePdfAttachments,
    composeValidationDemo,
    utilityBadgeCounts,
    mailRailBadgeCount,
  };
}

function mailSnapshotToUrlSearchParams(
  s: ReturnType<typeof initialMailPrototypeFromSearchParams>,
  mailSplitView: boolean,
  includeProto: boolean,
): URLSearchParams {
  const q = new URLSearchParams();
  q.set('nav', s.activeNav);
  q.set('audience', s.mailAudienceFilter);
  q.set('thread', s.mailSelectedId ?? 'none');
  q.set('empty', s.mailDemoEmpty ? '1' : '0');
  q.set('error', s.deliveryErrorKey);
  q.set('dock', s.dockWidthPreset);
  q.set(
    'surface',
    s.mailDemoEmpty ? 'empty' : s.mailSurface === 'compose' ? 'compose' : mailSplitView ? 'split' : 'list',
  );
  q.set('composePlace', s.composePlaceholderVariant);
  if (s.seedComposePdfAttachments) q.set('attach', '1');
  q.set('composeValid', s.composeValidationDemo);
  q.set('badges', `${s.utilityBadgeCounts[0]},${s.utilityBadgeCounts[1]},${s.utilityBadgeCounts[2]}`);
  q.set('mailBadge', String(s.mailRailBadgeCount));
  if (includeProto) q.set('proto', '1');
  q.set('panel', s.panelOpen ? '1' : '0');
  return q;
}

export function buildTwoWayEmailPrototypeHref(
  params: Record<string, string>,
  options?: { hashSlug?: '2-way-email-prototype' | 'conversational-email-prototype' },
): string {
  const q = new URLSearchParams(params).toString();
  const base = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
  const slug = options?.hashSlug ?? '2-way-email-prototype';
  return `${base}#${slug}${q ? `?${q}` : ''}`;
}

/**
 * Show the floating prototype controls in dev; on the public catalogue bundle (`vite.config.public` sets
 * `VITE_PUBLIC_PROTOTYPE_CATALOGUE`); otherwise in production only when deployed under a non-root path base
 * (fallback) or when `proto=1` is in the hash query.
 */
function showPrototypeControlsByDefaultForBuild(): boolean {
  if (import.meta.env.DEV) return true;
  if (import.meta.env.VITE_PUBLIC_PROTOTYPE_CATALOGUE === '1') return true;
  if (!import.meta.env.PROD) return false;
  const raw = import.meta.env.BASE_URL ?? '/';
  const base = raw.replace(/\/+$/, '') || '/';
  if (base === '/' || base === '.' || base === './') return false;
  return true;
}

export type TwoWayEmailPrototypeProps = {
  /**
   * Short bookmark route (`#conversational-email-prototype`): same opening reset as any refresh; hash slug prefers `conversational-email-prototype`.
   */
  alwaysStartWithOnboarding?: boolean;
};

export function TwoWayEmailPrototype({ alwaysStartWithOnboarding = false }: TwoWayEmailPrototypeProps = {}) {
  const initialMailRef = useRef<ReturnType<typeof initialMailPrototypeFromSearchParams> | null>(null);
  if (initialMailRef.current === null) {
    /** Full page load: ignore persisted hash query so refresh always matches the opening demo canvas. */
    initialMailRef.current = initialMailPrototypeFromSearchParams(new URLSearchParams());
  }
  const initMail = initialMailRef.current;

  const [search, setSearch] = useState('');
  const [activeNav, setActiveNav] = useState(initMail.activeNav);
  const [panelOpen, setPanelOpen] = useState(initMail.panelOpen);
  const [collabChannel, setCollabChannel] = useState<'mail' | 'msg' | 'wa'>(initMail.collabChannel);

  const [subject, setSubject] = useState(DEFAULT_COMPOSE_SUBJECT);

  const composeFromLine = 'Rachel Vaccaro <rachel.vaccaro@gms.workday.com>';
  const toLine = 'Chloe Clarkson <chloe.clarkson@email.com>';

  const [composeVariant, setComposeVariant] = useState<ComposeVariant>('compose');

  const [mailSurface, setMailSurface] = useState<'threads' | 'compose'>(initMail.mailSurface);

  /** Opening compose must expand the dock — `CommunicationDock` hides `panel` when `expanded` is false (blank sheet). */
  const handleMailSurfaceChange = useCallback((surface: 'threads' | 'compose') => {
    if (surface === 'compose') {
      setPanelOpen(true);
      setCollabChannel('mail');
    }
    setMailSurface(surface);
  }, []);

  const [composeDirty, setComposeDirty] = useState(false);
  const [composeResetKey, setComposeResetKey] = useState(0);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [pendingNavigate, setPendingNavigate] = useState<PendingComposeNavigate | null>(null);

  const showPrototypeControls =
    showPrototypeControlsByDefaultForBuild() ||
    (typeof window !== 'undefined' && parseTwoWayEmailPrototypeQuery().get('proto') === '1');

  const vw = useViewportWidth();

  const [mailAudienceFilter, setMailAudienceFilter] = useState<AudienceFilter>(initMail.mailAudienceFilter);
  const [mailSelectedId, setMailSelectedId] = useState<string | null>(initMail.mailSelectedId);
  const [mailDemoEmpty, setMailDemoEmpty] = useState(initMail.mailDemoEmpty);
  const [deliveryErrorKey, setDeliveryErrorKey] = useState<DeliveryErrorKey>(initMail.deliveryErrorKey);
  const [composePlaceholderVariant, setComposePlaceholderVariant] = useState<'begin' | 'template'>(
    initMail.composePlaceholderVariant,
  );
  const [seedComposePdfAttachments, setSeedComposePdfAttachments] = useState(initMail.seedComposePdfAttachments);
  const [composeValidationDemo, setComposeValidationDemo] = useState<ComposeValidationDemo>(
    initMail.composeValidationDemo,
  );
  const [dockWidthPreset, setDockWidthPreset] = useState<DockWidthPreset>(initMail.dockWidthPreset);
  const [utilityBadgeCounts, setUtilityBadgeCounts] = useState<[number, number, number]>(initMail.utilityBadgeCounts);
  const [mailRailBadgeCount, setMailRailBadgeCount] = useState(initMail.mailRailBadgeCount);

  const [prototypeControlsExpanded, setPrototypeControlsExpanded] = useState(false);

  /**
   * `CommunicationDock` sets the mail panel to `display: none` when `expanded` (panel open) is false. Any code path
   * that sets compose without opening the sheet looks like a blank panel — keep dock + mail channel in sync.
   */
  useEffect(() => {
    if (mailSurface !== 'compose') return;
    setPanelOpen(true);
    setCollabChannel('mail');
  }, [mailSurface]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const opening = initialMailPrototypeFromSearchParams(new URLSearchParams());
    const mailSplitViewOpening =
      Boolean(opening.mailSelectedId) && MOCK_MAIL_THREADS.some((t) => t.id === opening.mailSelectedId);
    const includeProto =
      showPrototypeControlsByDefaultForBuild() ||
      parseTwoWayEmailPrototypeQuery().get('proto') === '1';
    const q = mailSnapshotToUrlSearchParams(opening, mailSplitViewOpening, includeProto);
    const base = `${window.location.pathname}${window.location.search}`;
    const hashLead = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    const hashSlug =
      alwaysStartWithOnboarding || hashLead === 'conversational-email-prototype'
        ? 'conversational-email-prototype'
        : '2-way-email-prototype';
    window.history.replaceState(null, '', `${base}#${hashSlug}?${q.toString()}`);
  }, [alwaysStartWithOnboarding]);

  const filteredThreadsForDock = useMemo(() => {
    if (mailDemoEmpty) return [];
    const base = MOCK_MAIL_THREADS.filter((t) => {
      if (mailAudienceFilter === 'all') return true;
      return t.audience === mailAudienceFilter;
    });
    return applyMailThreadSortNewestFirst(base);
  }, [mailAudienceFilter, mailDemoEmpty]);

  const quotedThreadForCompose = useMemo(() => {
    if (mailSurface !== 'compose') return null;
    if (composeVariant !== 'reply' && composeVariant !== 'forward') return null;
    if (!mailSelectedId) return null;
    return filteredThreadsForDock.find((t) => t.id === mailSelectedId) ?? null;
  }, [mailSurface, composeVariant, mailSelectedId, filteredThreadsForDock]);

  const mailSplitView =
    Boolean(mailSelectedId) && filteredThreadsForDock.some((t) => t.id === mailSelectedId);

  /** Split (list + reading pane) or Compose — freeze profile column scroll so the dock is the focus. */
  const lockProfileScrollBehindMail =
    panelOpen && collabChannel === 'mail' && (mailSurface === 'compose' || mailSplitView);

  const expandedMailPanelPx = useMemo(() => {
    if (mailSurface === 'compose') {
      return dockSheetComposePx(vw);
    }
    /** 2-column Overview (list + reading pane): same sliding sheet width as Compose (Figma Overview-4 / Compose-4). */
    if (mailSplitView) {
      return dockSheetComposePx(vw);
    }
    if (dockWidthPreset === 'narrow') {
      return dockSheetNarrowPx(vw);
    }
    if (dockWidthPreset === 'medium') {
      return COLLAB_SHEET_W;
    }
    if (dockWidthPreset === 'wide') {
      return dockSheetComposePx(vw);
    }
    return dockSheetNarrowPx(vw);
  }, [vw, dockWidthPreset, mailSurface, mailSplitView]);

  const narrowMailPanelPx = dockSheetNarrowPx(vw);

  const syncPrototypeHash = useCallback(() => {
    if (!showPrototypeControls) return;
    const snapshot: ReturnType<typeof initialMailPrototypeFromSearchParams> = {
      panelOpen,
      activeNav,
      mailAudienceFilter,
      mailSelectedId,
      mailDemoEmpty,
      deliveryErrorKey,
      dockWidthPreset,
      mailSurface,
      collabChannel,
      composePlaceholderVariant,
      seedComposePdfAttachments,
      composeValidationDemo,
      utilityBadgeCounts,
      mailRailBadgeCount,
    };
    const q = mailSnapshotToUrlSearchParams(snapshot, mailSplitView, true);
    const base = `${window.location.pathname}${window.location.search}`;
    const hashLead = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    const hashSlug =
      alwaysStartWithOnboarding || hashLead === 'conversational-email-prototype'
        ? 'conversational-email-prototype'
        : '2-way-email-prototype';
    window.history.replaceState(null, '', `${base}#${hashSlug}?${q.toString()}`);
  }, [
    showPrototypeControls,
    activeNav,
    mailAudienceFilter,
    mailSelectedId,
    mailDemoEmpty,
    deliveryErrorKey,
    dockWidthPreset,
    mailSurface,
    mailSplitView,
    composePlaceholderVariant,
    seedComposePdfAttachments,
    composeValidationDemo,
    utilityBadgeCounts,
    mailRailBadgeCount,
    panelOpen,
    collabChannel,
    alwaysStartWithOnboarding,
  ]);

  useEffect(() => {
    syncPrototypeHash();
  }, [syncPrototypeHash]);

  const tryNavigateAway = useCallback(
    (pending: PendingComposeNavigate) => {
      const guardMailCompose = panelOpen && collabChannel === 'mail';
      if (!guardMailCompose || !composeDirty) {
        if (pending.kind === 'close') {
          setPanelOpen(false);
          setMailSurface('threads');
        } else if (pending.kind === 'channel') {
          setCollabChannel(pending.channel);
          setPanelOpen(true);
          setMailSurface('threads');
        }
        return;
      }
      setPendingNavigate(pending);
      setDiscardModalOpen(true);
    },
    [panelOpen, collabChannel, composeDirty],
  );

  const tryComposeExitToThreads = useCallback(() => {
    if (!composeDirty) {
      setMailSurface('threads');
      setComposeVariant('compose');
      return;
    }
    setPendingNavigate({ kind: 'composeToThreads' });
    setDiscardModalOpen(true);
  }, [composeDirty]);

  const onComposeNew = useCallback(() => {
    setComposeVariant('compose');
    setSubject(DEFAULT_COMPOSE_SUBJECT);
  }, []);

  const onReplyToThread = useCallback((row: MailThreadRow) => {
    setComposeVariant('reply');
    const stripped = row.subject.replace(/^(Re:|Fwd:)\s*/i, '').trim();
    setSubject(`Re: ${stripped}`);
  }, []);

  const onForwardThread = useCallback((row: MailThreadRow) => {
    setComposeVariant('forward');
    const stripped = row.subject.replace(/^(Fwd:|Re:)\s*/i, '').trim();
    setSubject(`Fwd: ${stripped}`);
  }, []);

  const closePanel = useCallback(() => {
    tryNavigateAway({ kind: 'close' });
  }, [tryNavigateAway]);

  /** Header shrink: hide reading pane only (narrow list); if already list-only, close the mail sheet. */
  const collapseMailReadingPaneOrDock = useCallback(() => {
    if (mailSurface === 'threads' && mailSplitView) {
      setMailSelectedId(null);
      return;
    }
    closePanel();
  }, [mailSurface, mailSplitView, closePanel]);

  const confirmDiscardAndNavigate = useCallback(() => {
    const p = pendingNavigate;
    setDiscardModalOpen(false);
    setPendingNavigate(null);

    if (p?.kind === 'composeToThreads') {
      setSubject(DEFAULT_COMPOSE_SUBJECT);
      setComposeResetKey((k) => k + 1);
      setComposeDirty(false);
      setComposeValidationDemo('none');
      setMailSurface('threads');
      setComposeVariant('compose');
      return;
    }

    setSubject(DEFAULT_COMPOSE_SUBJECT);
    setComposeResetKey((k) => k + 1);
    setComposeDirty(false);
    setComposeValidationDemo('none');
    setComposeVariant('compose');
    if (!p) return;
    if (p.kind === 'close') {
      setPanelOpen(false);
      setMailSurface('threads');
    } else {
      setCollabChannel(p.channel);
      setPanelOpen(true);
      setMailSurface('threads');
    }
  }, [pendingNavigate]);

  const cancelDiscardModal = useCallback(() => {
    setDiscardModalOpen(false);
    setPendingNavigate(null);
  }, []);

  const openCollaboration = useCallback(
    (ch: 'mail' | 'msg' | 'wa') => {
      if (panelOpen && collabChannel === 'mail' && ch !== 'mail') {
        tryNavigateAway({ kind: 'channel', channel: ch });
        return;
      }
      setCollabChannel(ch);
      setPanelOpen(true);
    },
    [panelOpen, collabChannel, tryNavigateAway],
  );

  const [decisionActionBarVisible, setDecisionActionBarVisible] = useState(false);

  type OnboardingStep = 'feature' | null;
  /** Full page load always opens the intro popover; dismissing it does not survive refresh. */
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('feature');

  /** Figma: full-viewport scrim over rail + blue nav + profile + top nav for wider dock — not during feature onboarding (no dark scrim). */
  const showWorkspaceDimOverlay =
    onboardingStep !== 'feature' && panelOpen && expandedMailPanelPx > narrowMailPanelPx;

  /** Prevent double scrollbars: dock/panel scrolls; viewport must not when modal scrim is shown. */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!showWorkspaceDimOverlay) return;
    const html = document.documentElement;
    const { overflow: prevHtml } = html.style;
    const { overflow: prevBody } = document.body.style;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [showWorkspaceDimOverlay]);

  const finishOnboarding = useCallback(() => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(TWO_WAY_EMAIL_ONBOARDING_COMPLETE_KEY, '1');
      }
    } catch {
      /* ignore */
    }
    setOnboardingStep(null);
  }, []);

  const emailRailRef = useRef<HTMLDivElement | null>(null);
  /** Bumps when the mail rail anchor mounts so the onboarding popover can measure / observe it. */
  const [emailRailAnchorEpoch, setEmailRailAnchorEpoch] = useState(0);
  const bindEmailRailAnchor = useCallback((node: HTMLDivElement | null) => {
    emailRailRef.current = node;
    setEmailRailAnchorEpoch((n) => n + 1);
  }, []);

  /** Closing the collaboration sheet resets mail UI to list-first (Figma 6887:11657). */
  const [threadsResetKey, setThreadsResetKey] = useState(0);
  const panelWasOpenRef = useRef(false);
  useEffect(() => {
    if (panelWasOpenRef.current && !panelOpen) {
      setThreadsResetKey((k) => k + 1);
      setMailSelectedId(null);
    }
    panelWasOpenRef.current = panelOpen;
  }, [panelOpen]);

  const applySurfacePreset = useCallback(
    (preset: 'list' | 'split' | 'compose' | 'empty') => {
      if (preset === 'empty') {
        setMailDemoEmpty(true);
        setMailSelectedId(null);
        setMailSurface('threads');
        setPanelOpen(true);
        setCollabChannel('mail');
      } else if (preset === 'list') {
        setMailDemoEmpty(false);
        setMailSelectedId(null);
        setMailSurface('threads');
        setPanelOpen(true);
        setCollabChannel('mail');
      } else if (preset === 'split') {
        setMailDemoEmpty(false);
        setMailSelectedId('1');
        setMailSurface('threads');
        setPanelOpen(true);
        setCollabChannel('mail');
      } else {
        setMailDemoEmpty(false);
        setMailSurface('compose');
        setPanelOpen(true);
        setCollabChannel('mail');
      }
    },
    [],
  );

  return (
    <Flex
      flexDirection="column"
      style={{
        minHeight: '100vh',
        backgroundColor: TW.soap200,
        paddingBottom: decisionActionBarVisible ? DECISION_ACTION_BAR_HEIGHT_PX : undefined,
      }}
    >
      {onboardingStep === 'feature' ? (
        <FeatureHighlightPopover
          anchorRef={emailRailRef}
          layoutSignal={panelOpen || emailRailAnchorEpoch > 0}
          onTry={() => {
            finishOnboarding();
            setCollabChannel('mail');
            setPanelOpen(true);
          }}
          onDismiss={finishOnboarding}
        />
      ) : null}
      <GlobalHeader
        searchValue={search}
        onSearchChange={setSearch}
        utilityBadgeCounts={utilityBadgeCounts}
      />
      <Flex flex={1} style={{ minHeight: 0, position: 'relative', alignItems: 'stretch' }}>
        <RecruitingNavRail />
        <CandidateMenu activeNav={activeNav} onNav={setActiveNav} />
        <Box
          flex={1}
          style={{
            minWidth: 0,
            minHeight: 0,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            /** Collapsed: inset for narrow rail + gutter. Expanded: no inset — `CommunicationDock` overlays cards. */
            paddingRight: panelOpen ? 0 : COLLAB_RAIL_W + COLLAB_DOCK_CONTENT_GUTTER_PX,
            backgroundColor: PROFILE_COLUMN_CANVAS_BG,
            transition: 'padding-right 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
            boxSizing: 'border-box',
          }}
        >
          <Box style={{ position: 'relative', zIndex: 10, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ProfileMainColumn
              actionBarVisible={decisionActionBarVisible}
              onMoveForward={() => setDecisionActionBarVisible(true)}
              backgroundScrollLocked={lockProfileScrollBehindMail}
            />
          </Box>
        </Box>

        {showWorkspaceDimOverlay ? (
          <Box
            aria-hidden
            onClick={closePanel}
            style={{
              position: 'fixed',
              top: HEADER_H,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(11, 31, 66, 0.35)',
              /** Below {@link GLOBAL_HEADER_Z} — dims rail, blue nav, profile only; top nav stays clear (Figma). */
              zIndex: WORKSPACE_DIM_SCRIM_Z,
            }}
          />
        ) : null}

        <CommunicationDock
          headerOffsetPx={HEADER_H}
          expanded={panelOpen || mailSurface === 'compose'}
          expandedWidthPx={expandedMailPanelPx}
          railWidthPx={COLLAB_RAIL_W}
          railBackgroundColor={TW.frenchVanilla100}
          expandedPanelBoxShadow={TWEMAIL_PANEL_SHADOW}
          zIndex={COMMUNICATION_DOCK_Z}
          unifiedRailElevation={panelOpen || mailSurface === 'compose'}
          railGapPx={0}
          railPaddingYPx={0}
          rail={
            <>
              {panelOpen || mailSurface === 'compose' ? (
                <>
                  {collabRailTile(false, mailIcon, 'Collapse panel', closePanel, {
                    customIcon: (
                      <RailPanelContractGlyph color={CONV_EMAIL_RAIL_ICON_IDLE} />
                    ),
                  })}
                  <Box
                    style={{
                      width: COLLAB_RAIL_W,
                      height: 1,
                      flexShrink: 0,
                      backgroundColor: TW.soap200,
                    }}
                    aria-hidden
                  />
                </>
              ) : null}
              {collabRailTile(false, noteIcon, 'Notes', () => {})}
              {collabRailTile(false, documentIcon, 'Documents', () => {})}
              <Box
                ref={bindEmailRailAnchor}
                style={{
                  width: COLLAB_RAIL_W,
                  minHeight: COLLAB_RAIL_W,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  overflow: 'visible',
                }}
              >
                {collabRailTile(collabChannel === 'mail', mailIcon, 'Email', () => openCollaboration('mail'), {
                  customIcon: (
                    <RailClassicEnvelopeGlyph
                      color={collabChannel === 'mail' ? CONV_EMAIL_RAIL_ICON_ACTIVE : CONV_EMAIL_RAIL_ICON_IDLE}
                    />
                  ),
                  badgeCount: mailRailBadgeCount,
                  mailAlertBadge: true,
                  showOnboardingDot: onboardingStep === 'feature' && mailRailBadgeCount < 1,
                })}
              </Box>
              {collabRailTile(collabChannel === 'msg', speechBubbleIcon, 'Messaging', () => openCollaboration('msg'), {
                customIcon: (
                  <RailDualSpeechBubbleGlyph
                    color={collabChannel === 'msg' ? CONV_EMAIL_RAIL_ICON_ACTIVE : CONV_EMAIL_RAIL_ICON_IDLE}
                  />
                ),
              })}
              {collabRailTile(collabChannel === 'wa', messagingIcon, 'WhatsApp', () => openCollaboration('wa'))}
            </>
          }
          panel={
            <Flex
              flexDirection="column"
              style={{
                height: '100%',
                minHeight: 0,
                flex: 1,
                backgroundColor: TW.frenchVanilla100,
              }}
            >
              {collabChannel === 'mail' ? (
                <MailCollaborationSurface
                  mailSurface={mailSurface}
                  onMailSurfaceChange={handleMailSurfaceChange}
                  onRequestComposeExit={tryComposeExitToThreads}
                  onComposeDirtyChange={setComposeDirty}
                  fromLine={composeFromLine}
                  toLine={toLine}
                  subject={subject}
                  onSubjectChange={setSubject}
                  composeResetKey={composeResetKey}
                  composeVariant={composeVariant}
                  onComposeNew={onComposeNew}
                  onReplyToThread={onReplyToThread}
                  onForwardThread={onForwardThread}
                  threadsResetKey={threadsResetKey}
                  onCollapseDock={collapseMailReadingPaneOrDock}
                  audienceFilter={mailAudienceFilter}
                  onAudienceFilterChange={setMailAudienceFilter}
                  selectedId={mailSelectedId}
                  onSelectedIdChange={setMailSelectedId}
                  demoEmptyInbox={mailDemoEmpty}
                  deliveryErrorKey={deliveryErrorKey}
                  composePlaceholderVariant={composePlaceholderVariant}
                  seedComposePdfAttachments={seedComposePdfAttachments}
                  composeValidationDemo={composeValidationDemo}
                  onComposeValidationDemoChange={setComposeValidationDemo}
                  threads={filteredThreadsForDock}
                  quotedThreadRow={quotedThreadForCompose}
                />
              ) : (
                <Flex
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  style={{ backgroundColor: TW.frenchVanilla100, minHeight: 0 }}
                >
                  <BodyText size="small">
                    Select the mail icon to match the Figma &quot;Messages&quot; compose state.
                  </BodyText>
                </Flex>
              )}
            </Flex>
          }
        />
        <TwModal
          variant="destructivePill"
          title="Discard Email?"
          isOpen={discardModalOpen}
          onClose={cancelDiscardModal}
          primaryActionText="Discard"
          onPrimaryAction={confirmDiscardAndNavigate}
          secondaryActionText="Cancel"
          width="420px"
        >
          <BodyText size="small" style={{ margin: 0, color: TW.blackPepper600 }}>
            Are you sure you want to discard this email?
          </BodyText>
        </TwModal>
      </Flex>

      <Box padding="s" style={{ backgroundColor: TW.soap200, borderTop: `1px solid ${TWEMAIL_DIVIDER}` }}>
        <Flex alignItems="center" gap="m" flexWrap="wrap" justifyContent="space-between">
          <Subtext size="small">
            2-way email prototype — Figma 2-Way Email Recruiting 12/2024 (INDIA-E2E-006). Sample data; Legal review for
            production.
          </Subtext>
          {import.meta.env.DEV ? (
            <TertiaryButton
              size="small"
              onClick={() => {
                try {
                  if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem(TWO_WAY_EMAIL_ONBOARDING_COMPLETE_KEY);
                  }
                } catch {
                  /* ignore */
                }
                setOnboardingStep('feature');
              }}
            >
              Reset onboarding (demo)
            </TertiaryButton>
          ) : null}
        </Flex>
      </Box>

      {decisionActionBarVisible ? (
        <Box
          role="region"
          aria-label="Candidate decision actions"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: DECISION_ACTION_BAR_HEIGHT_PX,
            zIndex: DECISION_ACTION_BAR_Z,
            borderTop: `1px solid ${TWEMAIL_DIVIDER}`,
            backgroundColor: TW.frenchVanilla100,
            boxShadow: '0 -4px 12px rgba(11,31,66,0.08)',
            paddingLeft: SPACE.m,
            paddingRight: SPACE.m,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="s" style={{ width: '100%' }}>
            <Flex gap="s" alignItems="center" flexWrap="wrap">
              <SecondaryButton size="small">Decline</SecondaryButton>
              <PrimaryButton size="small">Move Forward</PrimaryButton>
              <ToolbarIconButton icon={relatedActionsIcon} aria-label="Favorite candidate" />
              <ToolbarIconButton icon={relatedActionsIcon} aria-label="More actions" />
            </Flex>
            <Flex gap="xxs" alignItems="center">
              <TertiaryButton size="small" aria-label="Previous candidate">
                <TwIcon icon={chevronLeftSmallIcon} size={24} />
              </TertiaryButton>
              <BodyText size="small" style={{ margin: 0, color: TW.blackPepper500 }}>
                1 / 24
              </BodyText>
              <TertiaryButton size="small" aria-label="Next candidate">
                <TwIcon icon={chevronRightSmallIcon} size={24} />
              </TertiaryButton>
            </Flex>
          </Flex>
        </Box>
      ) : null}

      {showPrototypeControls ? (
        <>
          <button
            type="button"
            aria-expanded={prototypeControlsExpanded}
            aria-controls="two-way-email-prototype-controls"
            onClick={() => setPrototypeControlsExpanded((v) => !v)}
            style={{
              position: 'fixed',
              left: 8,
              bottom:
                8 +
                (decisionActionBarVisible ? DECISION_ACTION_BAR_HEIGHT_PX : 0) +
                (import.meta.env.DEV ? 52 : 8),
              zIndex: 241,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              padding: '12px 20px',
              margin: 0,
              cursor: 'pointer',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.14)',
              backgroundColor: '#1a1a1a',
              boxShadow: '0 4px 12px rgba(11,31,66,0.2)',
              fontFamily: 'inherit',
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1.3,
              color: TW.frenchVanilla100,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = `2px solid ${TW.blueberry400}`;
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            {prototypeControlsExpanded ? 'Close controls' : 'Prototype controls'}
          </button>
          {prototypeControlsExpanded ? (
            <Box
              id="two-way-email-prototype-controls"
              role="complementary"
              aria-label="Prototype control panel"
              style={{
                position: 'fixed',
                left: 8,
                bottom:
                  8 +
                  (decisionActionBarVisible ? DECISION_ACTION_BAR_HEIGHT_PX : 0) +
                  (import.meta.env.DEV ? 52 : 8) +
                  52,
                width: 340,
                maxHeight: '42vh',
                overflowY: 'auto',
                zIndex: 240,
                backgroundColor: '#1a1a1a',
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                pointerEvents: 'auto',
              }}
            >
              <BodyText size="small" style={{ margin: '0 0 10px', color: '#fff', fontWeight: 700 }}>
                Prototype Control
              </BodyText>
              <Flex flexDirection="column" gap="xs">
            <label style={{ color: '#ccc', fontSize: 11 }}>
              Surface preset
              <select
                aria-label="Surface preset"
                style={{ display: 'block', width: '100%', marginTop: 4 }}
                onChange={(e) =>
                  applySurfacePreset(e.target.value as 'list' | 'split' | 'compose' | 'empty')
                }
                defaultValue=""
              >
                <option value="" disabled>
                  Apply…
                </option>
                <option value="list">List-first (narrow dock)</option>
                <option value="split">Split read (medium dock)</option>
                <option value="compose">Compose (wide dock)</option>
                <option value="empty">Empty inbox</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 11 }}>
              <input
                type="checkbox"
                checked={mailDemoEmpty}
                onChange={(e) => setMailDemoEmpty(e.target.checked)}
              />
              Empty inbox (demo)
            </label>
            <label style={{ color: '#ccc', fontSize: 11 }}>
              Thread row focus
              <select
                aria-label="Thread row focus"
                style={{ display: 'block', width: '100%', marginTop: 4 }}
                value={mailSelectedId ?? ''}
                onChange={(e) => setMailSelectedId(e.target.value === '' ? null : e.target.value)}
              >
                <option value="">None (list-only)</option>
                <option value="1">1 — Unread inbound</option>
                <option value="2">2 — Sent</option>
                <option value="3">3 — Sent</option>
                <option value="4">4 — Not delivered</option>
                <option value="5">5 — Agency referral</option>
                <option value="6">6 — Agency follow-up</option>
              </select>
            </label>
            <label style={{ color: '#ccc', fontSize: 11 }}>
              Reading error variant
              <select
                aria-label="Reading error variant"
                style={{ display: 'block', width: '100%', marginTop: 4 }}
                value={deliveryErrorKey}
                onChange={(e) => setDeliveryErrorKey(e.target.value as DeliveryErrorKey)}
              >
                <option value="none">none</option>
                <option value="generic">generic</option>
                <option value="spam">spam</option>
                <option value="virus">virus</option>
                <option value="unsubscribe">unsubscribe</option>
                <option value="template">template</option>
                <option value="server">server</option>
                <option value="retry">retry</option>
              </select>
            </label>
            <label style={{ color: '#ccc', fontSize: 11 }}>
              Figma validation states (prototype)
              <select
                aria-label="Figma compose validation states"
                style={{ display: 'block', width: '100%', marginTop: 4 }}
                value={composeValidationDemo}
                onChange={(e) => setComposeValidationDemo(e.target.value as ComposeValidationDemo)}
              >
                <option value="none">None — default compose (6887:14115)</option>
                <option value="invalidTo">Invalid To — 6887:18369</option>
                <option value="noRecipient">No recipient — 6887:18849</option>
                <option value="multiple">Multiple errors — 6887:19329</option>
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 11 }}>
              <input
                type="checkbox"
                checked={seedComposePdfAttachments}
                onChange={(e) => setSeedComposePdfAttachments(e.target.checked)}
              />
              Sample PDF attachments
            </label>
            <Subtext size="small" style={{ color: '#888', marginTop: 4 }}>
              Append <code style={{ color: '#ccc' }}>?proto=1</code> to the hash for controls outside dev. Use the
              bottom-left button to expand; URL stays bookmarkable (<code style={{ color: '#ccc' }}>panel=0|1</code>{' '}
              opens or closes the mail dock).
            </Subtext>
          </Flex>
            </Box>
          ) : null}
        </>
      ) : null}
    </Flex>
  );
}

export default TwoWayEmailPrototype;
