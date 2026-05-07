import React, { useState, type ReactNode } from 'react';
import { TertiaryButton, ToolbarIconButton } from '@workday/canvas-kit-react/button';
import { Box, Flex } from '@workday/canvas-kit-react/layout';
import { colors, space } from '@workday/canvas-kit-react/tokens';
import { BodyText } from '@workday/canvas-kit-react/text';
import { arrowDownIcon, arrowUpIcon, sendIcon } from '@workday/canvas-system-icons-web';
import {
  SANA_COMM_BUBBLE_BG,
  SANA_COMM_COMPOSER_RADIUS_PX,
  SANA_COMM_MESSAGE_RADIUS_PX,
  SANA_COMM_META_FG,
  SANA_COMM_PANEL_SURFACE,
  SANA_LINK_ACCENT,
  SANA_SEARCH_FIELD_BG,
} from './sanaShellTheme';

/** Select / text fields inside comm panels — white surface, 12px radius, soap border (Sana reference). */
export function sanaCommFormControlStyle(): React.CSSProperties {
  return {
    width: '100%',
    padding: `${space.xs} ${space.s}`,
    fontSize: 14,
    fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
    backgroundColor: SANA_SEARCH_FIELD_BG,
    border: `1px solid ${colors.soap300}`,
    borderRadius: SANA_COMM_MESSAGE_RADIUS_PX,
    color: colors.blackPepper600,
    minHeight: 44,
    boxSizing: 'border-box',
    outline: 'none',
  };
}

export function sanaCommFormControlFocusStyle(): React.CSSProperties {
  return {
    borderColor: SANA_LINK_ACCENT,
    boxShadow: `0 0 0 1px ${SANA_LINK_ACCENT}`,
  };
}

export interface SanaCommMessageBubbleProps {
  /** 'start' = incoming (left), 'end' = outgoing (right) */
  align: 'start' | 'end';
  timestamp?: string;
  maxWidth?: string | number;
  width?: string | number;
  children: ReactNode;
}

/** White bubble, hairline border, ~12px radius; optional timestamp (Sana reference). */
export const SanaCommMessageBubble: React.FC<SanaCommMessageBubbleProps> = ({
  align,
  timestamp,
  maxWidth = 'min(100%, 320px)',
  width,
  children,
}) => (
  <Flex
    flexDirection="column"
    alignItems={align === 'end' ? 'flex-end' : 'flex-start'}
    marginBottom="s"
    style={{ maxWidth: '100%', width: width || 'auto' }}
  >
    <Box
      style={{
        maxWidth,
        width: width || 'auto',
        padding: `${space.s} ${space.m}`,
        backgroundColor: SANA_COMM_BUBBLE_BG,
        border: `1px solid ${colors.soap300}`,
        borderRadius: SANA_COMM_MESSAGE_RADIUS_PX,
        boxShadow: '0 1px 2px rgba(15, 46, 102, 0.04)',
      }}
    >
      <BodyText as="div" size="small" color={colors.blackPepper600} style={{ lineHeight: 1.45, margin: 0 }}>
        {children}
      </BodyText>
    </Box>
    {timestamp ? (
      <BodyText
        size="small"
        style={{ marginTop: 4, color: SANA_COMM_META_FG, fontSize: 11 }}
      >
        {timestamp}
      </BodyText>
    ) : null}
  </Flex>
);

export interface SsaAgentTurnProps {
  text?: string;
  children?: ReactNode;
  sources?: string[];
  showSteps?: boolean;
  stepLines?: string[];
  hideFeedback?: boolean;
  onHelpful?: () => void;
  onNotHelpful?: () => void;
}

/**
 * Summit-style SSA assistant turn: plain text, optional "Show Steps", then grounding / feedback actions.
 * Use when the brief references the Innovation Summit Create Job Req / Transfer Position demos.
 */
export const SsaAgentTurn: React.FC<SsaAgentTurnProps> = ({
  text,
  children,
  sources,
  showSteps,
  stepLines,
  hideFeedback,
  onHelpful,
  onNotHelpful,
}) => {
  const lines = text?.split('\n').filter(Boolean) ?? [];

  return (
    <Box marginBottom="m">
      <Box>
        {children ??
          lines.map((line, i) => (
            <BodyText key={i} size="small" style={{ marginTop: i ? 6 : 0 }}>
              {line}
            </BodyText>
          ))}
      </Box>
      {showSteps && stepLines && stepLines.length > 0 && (
        <Box marginTop="xs">
          <details>
            <summary style={{ cursor: 'pointer', fontSize: 12, color: SANA_LINK_ACCENT, fontWeight: 600 }}>
              Show Steps
            </summary>
            <Box as="ul" style={{ margin: '8px 0 0 18px', padding: 0 }}>
              {stepLines.map((step, i) => (
                <BodyText as="li" key={i} size="small" style={{ marginTop: 4 }}>
                  {step}
                </BodyText>
              ))}
            </Box>
          </details>
        </Box>
      )}
      {!hideFeedback && (
        <Flex alignItems="center" gap="xxs" marginTop="s" style={{ flexWrap: 'wrap' }}>
          <ToolbarIconButton
            icon={arrowUpIcon}
            aria-label="Mark response as helpful"
            onClick={onHelpful ?? (() => undefined)}
          />
          <ToolbarIconButton
            icon={arrowDownIcon}
            aria-label="Mark response as not helpful"
            onClick={onNotHelpful ?? (() => undefined)}
          />
          <TertiaryButton size="small">Sources</TertiaryButton>
          {sources && sources.length > 0 && (
            <BodyText as="span" size="small" color={SANA_COMM_META_FG} style={{ fontSize: 11 }}>
              {sources.length} cited
            </BodyText>
          )}
        </Flex>
      )}
    </Box>
  );
};

export interface SsaUserPromptPillProps {
  text: string;
  maxWidth?: string | number;
}

/** Summit-style SSA user turn: right-aligned grey prompt pill. */
export const SsaUserPromptPill: React.FC<SsaUserPromptPillProps> = ({ text, maxWidth = '85%' }) => (
  <Flex justifyContent="flex-end" marginBottom="m">
    <Box
      style={{
        maxWidth,
        backgroundColor: '#E8EAEF',
        borderRadius: 16,
        padding: '10px 14px',
      }}
    >
      <BodyText size="small">{text}</BodyText>
    </Box>
  </Flex>
);

export interface SanaCommComposerProps {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  onSend: () => void;
  sendDisabled?: boolean;
  sendLabel?: string;
  /** e.g. "+ Add Template" tertiary action under the field */
  footer?: ReactNode;
}

/**
 * Pill composer with blue focus ring and circular send affordance inset on the right (Sana reference).
 * Uses a native textarea for multi-line typing inside the pill container.
 */
export const SanaCommComposer: React.FC<SanaCommComposerProps> = ({
  value,
  onChange,
  placeholder,
  onSend,
  sendDisabled,
  sendLabel = 'Send message',
  footer,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <Box>
      <Box
        style={{
          position: 'relative',
          borderRadius: SANA_COMM_COMPOSER_RADIUS_PX,
          border: `1px solid ${focused ? SANA_LINK_ACCENT : colors.soap300}`,
          backgroundColor: SANA_COMM_PANEL_SURFACE,
          boxShadow: focused ? `0 0 0 1px ${SANA_LINK_ACCENT}` : '0 1px 2px rgba(15, 46, 102, 0.04)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <Box
          as="textarea"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label={placeholder}
          rows={2}
          style={{
            width: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            borderRadius: SANA_COMM_COMPOSER_RADIUS_PX,
            padding: `${space.s} ${space.xl} ${space.s} ${space.m}`,
            fontSize: 14,
            fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
            color: colors.blackPepper600,
            lineHeight: 1.4,
            minHeight: 52,
            boxSizing: 'border-box',
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!sendDisabled) onSend();
            }
          }}
        />
        <Box
          style={{
            position: 'absolute',
            right: 8,
            bottom: 8,
          }}
        >
          <ToolbarIconButton
            icon={sendIcon}
            aria-label={sendLabel}
            onClick={onSend}
            disabled={sendDisabled}
            style={{
              borderRadius: '50%',
              width: 36,
              height: 36,
              backgroundColor: colors.blueberry500,
              color: colors.frenchVanilla100,
            }}
          />
        </Box>
      </Box>
      {footer ? (
        <Box marginTop="xs" paddingLeft="xxs">
          {footer}
        </Box>
      ) : null}
    </Box>
  );
};
