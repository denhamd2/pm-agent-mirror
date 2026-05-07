/**
 * Microsoft Teams approver mockup — used as the "what the approver sees" step
 * in SSA prototypes that hand off an offer/req/transfer to a human approver.
 *
 * Reference frame: design/references/ssa-create-req-videos/frames-overlap/ov-2700.png
 * (Workday Talent Acquisition Agent message in a Teams chat thread, adaptive-card
 * style CTA).
 *
 * Visual treatment is a stylised Teams chrome - not a pixel-perfect clone. We
 * approximate Segoe UI using a system fallback (Teams' real font is not shipped
 * with Canvas Kit) and hand-roll the sidebar + chat list + adaptive card container
 * without pulling in any Teams brand assets.
 *
 * Variants (current: approval; scheduling variant lands in task 2b):
 *  - 'approval'    → "Approve offer" / "Request changes" CTAs
 *  - 'scheduling'  → "Suggest different times" / "Confirm slot" CTAs (future)
 */
import React from 'react';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { Avatar } from '@workday/canvas-kit-react/avatar';

const TEAMS_PURPLE = '#6264A7';
const TEAMS_PURPLE_DARK = '#4B4C7D';
const TEAMS_LAVENDER_BG = '#F5F5F5';
const TEAMS_CHAT_BG = '#F9F8F8';
const TEAMS_INK = '#252423';
const TEAMS_INK_SOFT = '#605E5C';
const TEAMS_HAIRLINE = '#E1DFDD';
const TEAMS_LINK = '#4F52B2';
const TEAMS_UNREAD_DOT = '#C4314B';
const TEAMS_MENTION_BG = '#EBEBF5';

const SEGOE_STACK =
  '"Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

/* ----------------------------------------------------------------------- *\
 * Types
\* ----------------------------------------------------------------------- */

export type TeamsChatCardVariant = 'approval' | 'scheduling';

export interface TeamsChatCardPayload {
  candidateName: string;
  role: string;
  requisitionId: string;
  workLocation: string;
  startDate: string;
  compensationSummary: string;
  approverName: string;
  approverRole: string;
  txnId: string;
}

export interface TeamsChatCardProps {
  payload: TeamsChatCardPayload;
  variant?: TeamsChatCardVariant;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  /** Display height for the chrome; defaults to fill container. */
  height?: number | string;
}

/* ----------------------------------------------------------------------- *\
 * Static sidebar + chat list data — keep inline to avoid token churn.
\* ----------------------------------------------------------------------- */

const SIDEBAR_ITEMS: { label: string; glyph: React.ReactNode; active?: boolean; hasUnread?: boolean }[] =
  [
    { label: 'Activity', glyph: <IconBell /> },
    { label: 'Chat', glyph: <IconChat />, active: true, hasUnread: true },
    { label: 'Teams', glyph: <IconTeams /> },
    { label: 'Calendar', glyph: <IconCalendar /> },
    { label: 'Calls', glyph: <IconPhone /> },
    { label: 'Files', glyph: <IconFile /> },
  ];

const PINNED_CHATS: { name: string; preview: string; time: string; unread?: boolean; active?: boolean }[] =
  [
    {
      name: 'Workday Talent Acq. Agent',
      preview: 'Offer ready for your approval',
      time: 'Now',
      unread: true,
      active: true,
    },
    { name: 'Ciara Flaherty', preview: 'Can we sync on the Dublin pipel…', time: '2:10 PM' },
    { name: 'Diane O’Connor', preview: 'Thanks, approved.', time: '1:47 PM' },
    { name: 'Conor Byrne', preview: 'HRBP sign-off on Friday works.', time: '11:22 AM' },
  ];

const RECENT_CHATS: { name: string; preview: string; time: string }[] = [
  { name: 'Sourcing standup', preview: 'Kayo: numbers for Q2 are attac…', time: 'Yesterday' },
  { name: 'Dublin hiring committee', preview: 'Liam: need feedback on Sarah…', time: 'Yesterday' },
  { name: 'Henry Thompson', preview: 'Thanks for the intro.', time: 'Mon' },
  { name: 'Amanda Evans', preview: 'Sounds good.', time: 'Mon' },
  { name: 'Kayo Miwa', preview: 'I reviewed with the client o…', time: 'Mon' },
];

/* ----------------------------------------------------------------------- *\
 * TeamsApprovalCard
\* ----------------------------------------------------------------------- */

export function TeamsChatCard({
  payload,
  variant = 'approval',
  onPrimaryAction,
  onSecondaryAction,
  height = '100%',
}: TeamsChatCardProps) {
  return (
    <Box
      role="region"
      aria-label="Microsoft Teams chat preview"
      style={{
        height,
        width: '100%',
        minHeight: 520,
        minWidth: 880,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${TEAMS_HAIRLINE}`,
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 14px rgba(0, 0, 0, 0.04)',
        backgroundColor: '#FFFFFF',
        fontFamily: SEGOE_STACK,
      }}
    >
      <TeamsTitleBar />
      <Flex style={{ flex: 1, minHeight: 0 }}>
        <TeamsSidebar />
        <TeamsChatList />
        <TeamsThread
          payload={payload}
          variant={variant}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
        />
      </Flex>
    </Box>
  );
}

/**
 * Backwards-compatible alias used by existing Offer prototype.
 * Prefer `TeamsChatCard` for all new work.
 */
export type TeamsApprovalCardOffer = TeamsChatCardPayload;
export interface TeamsApprovalCardProps {
  offer: TeamsApprovalCardOffer;
  onApprove: () => void;
  onRequestChanges?: () => void;
  height?: number | string;
}

export function TeamsApprovalCard({
  offer,
  onApprove,
  onRequestChanges,
  height,
}: TeamsApprovalCardProps) {
  return (
    <TeamsChatCard
      payload={offer}
      variant="approval"
      onPrimaryAction={onApprove}
      onSecondaryAction={onRequestChanges}
      height={height}
    />
  );
}

/* ----------------------------------------------------------------------- *\
 * Title bar (purple Teams strip with search)
\* ----------------------------------------------------------------------- */

function TeamsTitleBar() {
  return (
    <Flex
      alignItems="center"
      style={{
        height: 44,
        flexShrink: 0,
        backgroundColor: TEAMS_PURPLE,
        color: '#FFFFFF',
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <Box
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        Microsoft Teams
      </Box>
      <Box flex={1} />
      <Box
        style={{
          flex: '0 1 420px',
          height: 28,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.16)',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
        }}
      >
        <span style={{ opacity: 0.85, marginRight: 8 }}>⌕</span>
        <span>Search</span>
      </Box>
      <Box flex={1} />
      <Flex alignItems="center" gap="xs">
        <Box
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: TEAMS_PURPLE_DARK,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          AM
        </Box>
      </Flex>
    </Flex>
  );
}

/* ----------------------------------------------------------------------- *\
 * Left rail sidebar (Activity / Chat / Teams / Calendar / Calls / Files)
\* ----------------------------------------------------------------------- */

function TeamsSidebar() {
  return (
    <Flex
      flexDirection="column"
      alignItems="stretch"
      style={{
        width: 68,
        minWidth: 68,
        backgroundColor: TEAMS_LAVENDER_BG,
        borderRight: `1px solid ${TEAMS_HAIRLINE}`,
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      {SIDEBAR_ITEMS.map(({ label, glyph, active, hasUnread }) => (
        <Flex
          key={label}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          style={{
            padding: '8px 4px',
            color: active ? TEAMS_PURPLE : TEAMS_INK_SOFT,
            position: 'relative',
            gap: 3,
          }}
        >
          <Box
            style={{
              position: 'relative',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {glyph}
            {hasUnread ? (
              <Box
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: TEAMS_UNREAD_DOT,
                  color: '#FFFFFF',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                }}
              >
                1
              </Box>
            ) : null}
          </Box>
          <Box
            style={{
              fontSize: 10,
              fontWeight: active ? 700 : 400,
              color: active ? TEAMS_PURPLE : TEAMS_INK_SOFT,
              letterSpacing: '0.01em',
            }}
          >
            {label}
          </Box>
        </Flex>
      ))}
    </Flex>
  );
}

/* ----------------------------------------------------------------------- *\
 * Chat list (Pinned / Recent)
\* ----------------------------------------------------------------------- */

function TeamsChatList() {
  return (
    <Flex
      flexDirection="column"
      style={{
        width: 260,
        minWidth: 260,
        backgroundColor: '#FAFAFA',
        borderRight: `1px solid ${TEAMS_HAIRLINE}`,
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${TEAMS_HAIRLINE}`,
        }}
      >
        <Box style={{ fontSize: 16, fontWeight: 700, color: TEAMS_INK }}>Chat</Box>
        <Box style={{ fontSize: 11, color: TEAMS_INK_SOFT }}>New chat</Box>
      </Flex>

      <Flex
        flexDirection="column"
        style={{ flex: 1, overflowY: 'auto' }}
      >
        <SectionLabel label="Pinned" />
        {PINNED_CHATS.map((chat, idx) => (
          <ChatRow key={`p-${idx}`} {...chat} />
        ))}
        <SectionLabel label="Recent" />
        {RECENT_CHATS.map((chat, idx) => (
          <ChatRow key={`r-${idx}`} {...chat} />
        ))}
      </Flex>
    </Flex>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Box
      style={{
        padding: '10px 14px 4px',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: TEAMS_INK_SOFT,
      }}
    >
      {label}
    </Box>
  );
}

function ChatRow({
  name,
  preview,
  time,
  unread,
  active,
}: {
  name: string;
  preview: string;
  time: string;
  unread?: boolean;
  active?: boolean;
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <Flex
      alignItems="center"
      gap="xs"
      style={{
        padding: '8px 14px',
        borderLeft: active ? `3px solid ${TEAMS_PURPLE}` : '3px solid transparent',
        backgroundColor: active ? '#F0EFF9' : 'transparent',
        cursor: 'default',
      }}
    >
      <Box
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: name.includes('Workday') ? TEAMS_PURPLE : '#6E6E6E',
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {name.includes('Workday') ? 'W' : initials}
      </Box>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Flex alignItems="center" justifyContent="space-between" gap="xxs">
          <Box
            style={{
              fontSize: 13,
              fontWeight: unread ? 700 : 500,
              color: TEAMS_INK,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}
          >
            {name}
          </Box>
          <Box
            style={{
              fontSize: 11,
              color: unread ? TEAMS_UNREAD_DOT : TEAMS_INK_SOFT,
              flexShrink: 0,
              fontWeight: unread ? 700 : 400,
            }}
          >
            {time}
          </Box>
        </Flex>
        <Box
          style={{
            fontSize: 12,
            color: TEAMS_INK_SOFT,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 2,
            fontWeight: unread ? 600 : 400,
          }}
        >
          {preview}
        </Box>
      </Box>
    </Flex>
  );
}

/* ----------------------------------------------------------------------- *\
 * Main chat thread + adaptive card + composer
\* ----------------------------------------------------------------------- */

function TeamsThread({
  payload,
  variant,
  onPrimaryAction,
  onSecondaryAction,
}: {
  payload: TeamsChatCardPayload;
  variant: TeamsChatCardVariant;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}) {
  return (
    <Flex
      flexDirection="column"
      style={{ flex: 1, minWidth: 0, backgroundColor: TEAMS_CHAT_BG }}
    >
      <ThreadHeader />
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 28px',
        }}
      >
        <BotMessage
          payload={payload}
          variant={variant}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
        />
      </Box>
      <ComposerMock />
    </Flex>
  );
}

function ThreadHeader() {
  return (
    <Flex
      alignItems="center"
      gap="s"
      style={{
        padding: '12px 24px',
        borderBottom: `1px solid ${TEAMS_HAIRLINE}`,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: TEAMS_PURPLE,
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        W
      </Box>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Box style={{ fontSize: 14, fontWeight: 700, color: TEAMS_INK }}>
          Workday Talent Acquisition Agent
        </Box>
        <Flex alignItems="center" gap="xxs">
          <Box
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#6BB700',
            }}
          />
          <Box style={{ fontSize: 12, color: TEAMS_INK_SOFT }}>Available · Bot</Box>
        </Flex>
      </Box>
      <Box style={{ fontSize: 12, color: TEAMS_INK_SOFT }}>Chat · Files · Activity</Box>
    </Flex>
  );
}

function BotMessage({
  payload,
  variant,
  onPrimaryAction,
  onSecondaryAction,
}: {
  payload: TeamsChatCardPayload;
  variant: TeamsChatCardVariant;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}) {
  const now = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
  return (
    <Flex gap="s" alignItems="flex-start">
      <Avatar size={Avatar.Size.s} as="div" />
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Flex alignItems="baseline" gap="xs" style={{ marginBottom: 6 }}>
          <Box style={{ fontSize: 13, fontWeight: 700, color: TEAMS_INK }}>
            Workday Talent Acquisition Agent
          </Box>
          <Box style={{ fontSize: 11, color: TEAMS_INK_SOFT }}>{now}</Box>
        </Flex>
        <Box style={{ fontSize: 13, color: TEAMS_INK, lineHeight: 1.5, marginBottom: 12 }}>
          Hello{' '}
          <Box
            as="span"
            style={{
              backgroundColor: TEAMS_MENTION_BG,
              color: TEAMS_LINK,
              padding: '1px 4px',
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            @{payload.approverName.split(' ')[0]}
          </Box>{' '}
          —{' '}
          {variant === 'scheduling'
            ? 'a panel scheduling proposal is ready for your review.'
            : 'an offer is ready for your approval.'}
        </Box>

        <AdaptiveCard
          payload={payload}
          variant={variant}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
        />
      </Box>
    </Flex>
  );
}

function AdaptiveCard({
  payload,
  variant,
  onPrimaryAction,
  onSecondaryAction,
}: {
  payload: TeamsChatCardPayload;
  variant: TeamsChatCardVariant;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}) {
  const cardTitle = variant === 'scheduling' ? 'Interview · Scheduling proposal' : 'Offer · Approval request';
  const primaryLabel = variant === 'scheduling' ? 'Confirm slot' : 'Approve offer';
  const secondaryLabel = variant === 'scheduling' ? 'Suggest different times' : 'Request changes';
  const helperText =
    variant === 'scheduling'
      ? 'The proposed panel times are attached in Workday. Confirming here posts the slot and sends the candidate scheduling note.'
      : 'The letter, pay-band check, and approver packet are attached in Workday. Approving here posts your decision back to the offer and notifies the candidate and recruiter.';
  return (
    <Box
      style={{
        width: '100%',
        maxWidth: 560,
        backgroundColor: '#FFFFFF',
        border: `1px solid ${TEAMS_HAIRLINE}`,
        borderRadius: 6,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          padding: '16px 18px 10px',
          borderBottom: `1px solid ${TEAMS_HAIRLINE}`,
          backgroundColor: '#FAFAFB',
        }}
      >
        <Box style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: TEAMS_INK_SOFT, marginBottom: 4 }}>
          {cardTitle}
        </Box>
        <Box style={{ fontSize: 16, fontWeight: 700, color: TEAMS_INK, lineHeight: 1.3 }}>
          {payload.candidateName} — {payload.role}
        </Box>
        <Box style={{ fontSize: 12, color: TEAMS_INK_SOFT, marginTop: 2 }}>
          {payload.requisitionId} · {payload.workLocation}
        </Box>
      </Box>

      <Box style={{ padding: '14px 18px' }}>
        <Flex flexDirection="column" gap="xs">
          <FactRow label={variant === 'scheduling' ? 'Proposal' : 'Compensation'} value={payload.compensationSummary} />
          <FactRow label={variant === 'scheduling' ? 'Interview date' : 'Start date'} value={payload.startDate} />
          <FactRow label="Approver" value={`${payload.approverName} · ${payload.approverRole}`} />
          <FactRow label="Transaction" value={payload.txnId} />
        </Flex>

        <Box style={{ marginTop: 14, padding: '10px 12px', backgroundColor: '#F3F2F1', borderRadius: 4, fontSize: 12, color: TEAMS_INK_SOFT, lineHeight: 1.45 }}>
          {helperText}
        </Box>
      </Box>

      <Flex
        gap="xs"
        style={{
          padding: '12px 18px 16px',
          borderTop: `1px solid ${TEAMS_HAIRLINE}`,
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={onPrimaryAction}
          style={{
            backgroundColor: TEAMS_PURPLE,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 4,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: SEGOE_STACK,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = TEAMS_PURPLE_DARK;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = TEAMS_PURPLE;
          }}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onSecondaryAction}
          disabled={!onSecondaryAction}
          style={{
            backgroundColor: '#FFFFFF',
            color: TEAMS_INK,
            border: `1px solid ${TEAMS_HAIRLINE}`,
            borderRadius: 4,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: onSecondaryAction ? 'pointer' : 'not-allowed',
            fontFamily: SEGOE_STACK,
          }}
        >
          {secondaryLabel}
        </button>
        <Box flex={1} />
        <Box style={{ fontSize: 11, color: TEAMS_INK_SOFT, alignSelf: 'center' }}>
          View in Workday
        </Box>
      </Flex>
    </Box>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex gap="s" alignItems="baseline">
      <Box
        style={{
          width: 130,
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: TEAMS_INK_SOFT,
        }}
      >
        {label}
      </Box>
      <Box style={{ fontSize: 13, color: TEAMS_INK, lineHeight: 1.4 }}>{value}</Box>
    </Flex>
  );
}

function ComposerMock() {
  return (
    <Box
      style={{
        padding: '12px 20px 16px',
        borderTop: `1px solid ${TEAMS_HAIRLINE}`,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Box
        style={{
          border: `1px solid ${TEAMS_HAIRLINE}`,
          borderRadius: 4,
          padding: '10px 12px',
          backgroundColor: '#FAFAFA',
          fontSize: 12,
          color: TEAMS_INK_SOFT,
          fontFamily: SEGOE_STACK,
        }}
      >
        Type a new message
      </Box>
      <Flex gap="xs" marginTop="xs" style={{ fontSize: 11, color: TEAMS_INK_SOFT }}>
        <span>A</span>
        <span>·</span>
        <span>Emoji</span>
        <span>·</span>
        <span>GIF</span>
        <span>·</span>
        <span>Attach</span>
        <Box flex={1} />
        <span>Send</span>
      </Flex>
    </Box>
  );
}

/* ----------------------------------------------------------------------- *\
 * Inline SVG glyphs for the Teams sidebar (neutral, currentColor).
\* ----------------------------------------------------------------------- */

function IconBell() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0v4l1.5 2.5a.5.5 0 0 1-.43.75H4.93a.5.5 0 0 1-.43-.75L6 13V9Zm4.5 9h3a1.5 1.5 0 1 1-3 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-3.9 2.94A.5.5 0 0 1 4.3 19.6V6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconTeams() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm6 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 14a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5H3v-5Zm13 0a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v5h-7v-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5h14a1 1 0 0 1 1 1v2H4V6a1 1 0 0 1 1-1Zm-1 5h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Zm3-7a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0V3Zm8 0a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.25 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1l-2.2 2.21Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6H6Zm7 1v5h5"
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
      />
    </svg>
  );
}

